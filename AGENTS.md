# AGENTS.md

Guidance for AI agent working on this repository. Read this fully before each task and follow it on every change.

## Project

A currency converter web app. On load it fetches the latest CZK exchange rates from the Czech National Bank (CNB), parses them, displays a selectable rates list, and lets the user convert an amount in CZK into a selected currency. Single-page and client-side.

## Commands

```
pnpm dev             # start the Vite dev server (includes the CNB proxy, see Deployment)
pnpm build           # production build
pnpm preview         # serve the production build locally
pnpm typecheck       # tsc --noEmit (strict)
pnpm lint            # ESLint
pnpm format          # Prettier
pnpm test            # Vitest (unit/component)
pnpm test:e2e        # Playwright (mocked, against production build)
pnpm test:e2e:smoke  # Playwright live smoke (requires SMOKE_URL)
```

Always run `typecheck` and `lint` before committing.

## Tech stack

- React (latest stable), function components and Hooks only
- TypeScript, `strict` mode, no `any` in the data model
- Vite for build/dev — **not** Next.js, no SSR
- styled-components v6 (ships its own types — do **not** add `@types/styled-components`)
- TanStack Query (React Query) for server state
- Vitest + React Testing Library for unit/component tests
- Playwright for e2e
- Native `fetch` for transport (with `if (!res.ok) throw`) — not axios
- pnpm as package manager; Node 24 (pinned in `.nvmrc`)

## Architecture

Feature-oriented, not type-oriented. Group by business module first, then by tier within.

```
src/
  app/                 # App root, providers (QueryClient, Theme, GlobalStyle) — composition only
  pages/               # Page-level compositions (ConverterPage)
  features/
    exchange-rates/    # Business module: parser, converter, hooks, components, types
  components/
    ui/                # Pure design primitives (Input, Card, Stack, Text, Label, Alert, ...)
    ui/icons/          # Reusable SVG icon components (SunIcon, MoonIcon, SearchIcon)
    ThemeToggle.tsx     # Shared behavioural components (not pure primitives, not feature-specific)
  layouts/             # Header, PageLayout
  theme/               # Design tokens (primitive + semantic), ThemeProvider, light/dark
  config/              # Strings, currency catalog + allowed list, flag mappings
  lib/                 # Framework-agnostic utilities (money formatter, logger seam, input sanitization)
tests/
  e2e/                 # Playwright e2e specs + fixture
api/
  rates.ts             # Vercel serverless proxy (CNB pass-through)
```

Three tiers, kept strictly separate:

1. **UI primitives** (`components/ui`) — pure, presentational, theme-driven. No business knowledge, no data fetching.
2. **Business components** (`features/*`) — compose primitives and consume hooks. App-specific.
3. **Hooks** (`features/*/use*.ts`) — hold logic and data access; components stay declarative.

Rules:

- Composition files (`App`, layouts, pages) only assemble components — no inline styles, no logic.
- Composition and page files (`app/`, `pages/`, and layout assembly) must contain zero `style={}` props. If a value isn't expressible through a primitive's props or a token, extend the primitive or add a token — never inline it.
- No inline styling anywhere. All styling via styled-components against semantic tokens.
- Event handlers are thin: they call a function/hook, they do not contain logic. Low-level UI components contain no business logic.
- Extract constants/config (brand name, locale, currency allow-list) — never hardcode these inline.

## Design tokens & styling

- Two-tier tokens in `theme/`: **primitive** (raw values: `space[2]`, colour scales) and **semantic** (named by role: `surface`, `textMuted`, `controlPadding`). Components reference semantic tokens **only**.
- Never hardcode colours, spacing, radii, or breakpoints in components. If a value isn't a token, add a token.
- Spacing comes from layout primitives (`Stack gap`) backed by the scale — not ad-hoc margins.
- Typography is components: `Heading` and `Text`. `Heading` separates semantic level from visual size, e.g. `<Heading as="h2" size="lg">` renders a real `<h2>`. Never let visual size pick the tag.
- Light/dark from `prefers-color-scheme` via `ThemeProvider`, with an override seam (context/prop) so a mode can be pinned (for tests and a future user toggle). Every colour must work in both modes.
- styled-components must render correct semantic HTML (`styled.h1` → `<h1>`).

## DRY

- DRY **logic and config** aggressively: parsing, conversion math, the formatter, the currency list, brand strings — one source of truth each.
- Do **not** over-DRY UI. Tolerate duplication in components until a pattern proves itself (rule of three). Never collapse superficially-similar components into one flag-driven mega-component.

## Domain rules — CNB data (get these exactly right)

- Source: CNB `daily.txt` (English). Format:
  - **Line 1:** `DD.Mon.YYYY  #seq` — the fixing date and sequence number. **Parse this** and display "rates as of <date>".
  - **Line 2:** header `Country|Currency|Amount|Code|Rate`.
  - **Lines 3+:** pipe-delimited rows.
- Decimal separator in the English feed is `.`.
- The **`Amount` column is critical.** The rate is CZK per `Amount` units of the currency (e.g. `Japan|yen|100|JPY|14.5` means 100 JPY = 14.5 CZK). Conversion CZK→foreign = `czk * amount / rate`. **Never** do `czk / rate` — it is wrong by 100x for JPY, HUF, etc. Parser and conversion tests **must** cover a per-100 currency.
- `parseRates` is a **pure function** (string in, typed data out), decoupled from fetch and React. It is the highest-value unit under test.
- **CORS:** CNB returns `Access-Control-Allow-Origin: apl.cnb.cz` (pinned to their own host), so browser calls from any other origin are blocked. A server-side proxy is mandatory.

## Data fetching

- The client always calls the app's own proxy path `/api/rates` — never CNB directly.
- React Query: load **once** on app start. The rates query carries `staleTime: Infinity`, `refetchOnWindowFocus: false`, `refetchOnReconnect: false`. **No routine polling** — CNB updates once per working day (~2:30 p.m. Prague) and asks clients not to over-fetch.
- **Error recovery:** after the default 3 retries fail, a `refetchInterval` of 30 seconds kicks in (gated to the error state only) so the app self-heals when CNB comes back. Once data loads, polling stops.
- These load-once settings belong **on the rates query, not on the global `QueryClient` defaults**. Keep app-wide defaults at their sensible values so future queries aren't silently affected.
- The currency allow-list is an **intersection** with what the API returns: never render an allowed currency the API didn't include that day.

## Currency catalog & allowed list

- `CURRENCIES` is a code-keyed catalog (`Record<CurrencyCode, CurrencyMeta>`) containing all known currencies including XDR.
- `ALLOWED_CURRENCIES` is a typed `CurrencyCode[]` controlling which currencies the app offers and in what order. XDR is intentionally excluded (synthetic reserve asset).
- `selectAvailableCurrencies` returns the intersection of allowed + feed, in allowed-list order, with metadata from the catalog.
- A typo or unknown code in `ALLOWED_CURRENCIES` is a compile error (typed against `keyof typeof CURRENCIES`).

## Numbers & money

- Use `Intl.NumberFormat`, **not** a decimal library. This is a display-only, single-operation converter; floats are correct here.
- Centralize the formatter in `lib/money.ts`: `style: 'decimal'`, 2 fraction digits, `roundingMode: 'halfExpand'`. The currency code is shown by the selector, so format the number **without** a currency symbol.
- Compute at full precision; round only once, at display.

## Inputs

- CZK amount field: `inputMode="decimal"` (correct mobile keyboard), **not** `type="number"` (avoids `e`/`+`/`-`, scroll-wheel mutation, locale comma/dot issues).
- Sanitize to digits + a single `.` (`lib/input.ts`). Empty value → treat as 0 in the calc. Use `placeholder="0"` with an empty stored value — do **not** store a literal 0 or clear-on-focus.
- Conversion is **one-directional** (CZK → selected currency). The CZK input is the only source of truth; the target amount is derived (`toForeign`) and read-only.

## Currency selection

- The always-visible rates list serves as the currency selector — clicking a row selects that currency for conversion. **No combobox/select component.**
- A plain text filter above the list narrows visible rows by code, name, or country.
- Each row shows a circular SVG flag badge + code + name + normalized rate. Flags are self-hosted SVG assets from `flag-icons`; EUR uses the EU flag; XDR has no flag (symbol fallback). Flags are `aria-hidden`; accessible name comes from the currency text.

## Accessibility

- Real `<label>`s associated with the CZK input (placeholders are not labels).
- The conversion result lives in an `aria-live="polite"` region so it is announced on change.
- Error state is announced (`role="alert"` via the `Alert` primitive).
- List rows are `<button>`s with `aria-pressed` for the selected state.
- Fully keyboard-operable; visible focus rings (never `outline: none` without a replacement).
- Logo SVG: `role="img"` + `aria-label`.

## Testing

- **Vitest is added with the code it tests** — tests land in the same commit as the code, never backfilled later.
- Unit/component tests are colocated (`*.test.ts` / `*.component.test.tsx`) next to their source.
- Highest-value tests: `parseRates` (well-formed input, per-100 `Amount`, malformed/empty lines, the date header), conversion math, input sanitization, and the currency intersection selector.
- Component tests with RTL (mock flags, use `ThemeProvider`).
- Playwright e2e in `tests/e2e/`: mocked happy path (rates list, conversion incl. per-100 currency, currency selection, filter, mobile viewport), error-state test (route fulfilled with 500), and a separate live smoke test against the deployed URL (not in PR gate).

## Observability

- Wrap reporting in a `lib/logger.ts` seam (console calls here). Things like a missing-allowed currency or fetch errors go through it. Do **not** install Sentry — the seam makes wiring it later a one-file change.

## Environment / configuration

- The client always calls the app's own proxy path for rates (`/api/rates`) — see Deployment for how that resolves in dev vs production. No CNB URL or secrets live in client code.
- App-level configuration (brand name, locale, currency catalog/allowed list) lives in `config/`, not in `.env`. There are no required secrets for this app.
- Node 24 pinned in `.nvmrc` and `.node-version`; `engines.node` range `>=20 <25` in `package.json`.

## Deployment

This section is the single source of truth for hosting, build, and the proxy. Don't restate these facts elsewhere.

- **Host:** Vercel (static SPA build output from `vite build`).
- **CNB proxy:** the CNB endpoint returns `Access-Control-Allow-Origin: apl.cnb.cz`, so the browser can't call it directly. The app calls its own path (`/api/rates`), which is proxied to CNB server-side:
  - **Dev:** Vite dev-server proxy (`server.proxy` in `vite.config.ts`) rewrites the app path → the CNB URL.
  - **Production:** a Vercel serverless function at `api/rates.ts` fetches the CNB text server-side and returns it, with `Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400`.
- Verify the production proxy in the Vercel environment, not just locally — "works in dev, broken in prod" is the most likely failure here.

## CI

- GitHub Actions workflow (`.github/workflows/ci.yml`) runs on push and PR.
- Steps: install (frozen lockfile) → lint → typecheck → unit tests → build → Playwright e2e.
- Uses pnpm and Node 24 via `.nvmrc` (single source of truth for local, CI, and Vercel).

## Commits

- Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `refactor:`). Incremental and meaningful — never squash unrelated work into one commit.
- Every commit leaves the app building and deployable.

## Out of scope — do not add

SSR/Next.js, an i18n library (English strings centralized in `config` instead), a decimal library, custom CDN config, Docker, monitoring infra, routine polling (error-gated recovery polling is in scope). These address scale/ops this app doesn't have. The architecture is intentionally structured for extension; keep the app itself lean.
