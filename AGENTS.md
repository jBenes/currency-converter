# AGENTS.md

Guidance for AI agent working on this repository. Read this fully before each task and follow it on every change.

## Project

A currency converter web app. On load it fetches the latest CZK exchange rates from the Czech National Bank (CNB), parses them, displays the rate list, and lets the user convert an amount in CZK into a selected currency — and back. Single-page and client-side.

## Commands

```
npm run dev          # start the Vite dev server (includes the CNB proxy, see Deployment)
npm run build        # production build
npm run preview      # serve the production build locally
npm run typecheck    # tsc --noEmit (strict)
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Vitest (unit/component)
npm run test:e2e     # Playwright (added once there is a running app)
```

Always run `typecheck` and `lint` before committing.

## Tech stack

- React (latest stable), function components and Hooks only
- TypeScript, `strict` mode, no `any` in the data model
- Vite for build/dev — **not** Next.js, no SSR
- styled-components v6 (ships its own types — do **not** add `@types/styled-components`)
- TanStack Query (React Query) for server state
- Vitest + React Testing Library + MSW for unit/component tests
- Playwright for e2e
- Downshift for the accessible currency combobox
- Native `fetch` for transport (with `if (!res.ok) throw`) — not axios

## Architecture

Feature-oriented, not type-oriented. Group by business module first, then by tier within.

```
src/
  app/                 # App, providers (QueryClient, Theme, GlobalStyle) — composition only
  pages/               # page-level compositions (ConverterPage)
  features/
    exchange-rates/    # the one business module: api, hooks, components, types
  components/
    ui/                # pure design primitives (Button, Input, Card, Stack, Heading...)
    ui/icons/          # reusable SVG icon components (SunIcon, MoonIcon, …)
    ThemeToggle.tsx     # shared behavioural components (not pure primitives, not feature-specific)
  layouts/             # Header, PageLayout
  theme/               # design tokens (primitive + semantic), ThemeProvider, light/dark
  config/              # brand/strings, currency allow-list, locale, constants
  lib/                 # framework-agnostic utilities (money formatter, logger seam)
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
- Spacing comes from layout primitives (`Stack gap`, `Box p`) backed by the scale — not ad-hoc margins.
- Typography is components: `Heading` and `Text`. `Heading` separates semantic level from visual size, e.g. `<Heading as="h2" size="lg">` renders a real `<h2>`. Never let visual size pick the tag.
- Light/dark from `prefers-color-scheme` via `ThemeProvider`, with an override seam (context/prop) so a mode can be pinned (for tests and a future user toggle). Every colour must work in both modes.
- styled-components must render correct semantic HTML (`styled.h1` → `<h1>`).

## DRY

- DRY **logic and config** aggressively: parsing, conversion math, the formatter, the currency list, brand strings — one source of truth each.
- Do **not** over-DRY UI. Tolerate duplication in components until a pattern proves itself (rule of three). Never collapse superficially-similar components into one flag-driven mega-component.

## Domain rules — CNB data (get these exactly right)

- Source: CNB `daily.txt` (English). Format:
  - **Line 1:** `DD Mon YYYY #seq` — the fixing date and sequence number. **Parse this** and display "rates as of <date>".
  - **Line 2:** header `Country|Currency|Amount|Code|Rate`.
  - **Lines 3+:** pipe-delimited rows.
- Decimal separator in the English feed is `.`.
- The **`Amount` column is critical.** The rate is CZK per `Amount` units of the currency (e.g. `Japan|yen|100|JPY|14.5` means 100 JPY = 14.5 CZK). Conversion CZK→foreign = `czk * amount / rate`. **Never** do `czk / rate` — it is wrong by 100x for JPY, HUF, etc. Parser and conversion tests **must** cover a per-100 currency.
- `parseRates` is a **pure function** (string in, typed data out), decoupled from fetch and React. It is the highest-value unit under test.

## Data fetching

- **CORS:** the CNB endpoint is not callable from the browser; it is reached through a proxy (see Deployment). **Never** fetch CNB directly from client code — always go through the app's proxy path.
- React Query: load **once** on app start. The rates query carries `staleTime: Infinity`, `refetchOnWindowFocus: false`, `refetchOnReconnect: false`. **No polling** — CNB updates once per working day (~2:30 p.m. Prague) and asks clients not to over-fetch. (Optional: a slow refetch gated to the error state only, for recovery.)
- These load-once settings belong **on the rates query, not on the global `QueryClient` defaults**. Keep app-wide defaults at their sensible values (focus-refetch stays on) so future queries aren't silently affected — override only where the unusual behaviour is actually needed. Co-locating `staleTime: Infinity` and `refetchOnWindowFocus: false` on the rates query also makes the "loads once, never re-fetches on its own" intent legible in one place.
- The currency allow-list is an **intersection** with what the API returns: never render a whitelisted currency the API didn't include that day.

## Numbers & money

- Use `Intl.NumberFormat`, **not** a decimal library. This is a display-only, single-operation converter; floats are correct here.
- Centralize the formatter in `lib/money.ts`: `style: 'decimal'`, 2 fraction digits, `roundingMode: 'halfExpand'`, locale from config. The currency code is shown by the selector, so format the number **without** a currency symbol.
- Compute at full precision; round only once, at display.

## Inputs

- Amount fields: `inputMode="decimal"` (correct mobile keyboard), **not** `type="number"` (avoids `e`/`+`/`-`, scroll-wheel mutation, locale comma/dot issues).
- Sanitize to digits + a single `.`. Empty value → treat as 0 in the calc. Use `placeholder="0"` with an empty stored value — do **not** store a literal 0 or clear-on-focus.
- Conversion is **bidirectional**: single source of truth `{ amount, currency, lastEdited }`; derive the opposite field. Never store both amounts and keep them in sync.

## Currency select

- Accessible combobox with search filter, built with Downshift (`useCombobox`), styled entirely in-house with styled-components. The headless lib is the **one** allowed exception to "build UI by hand" — it provides ARIA/keyboard behaviour we won't reimplement.
- Pattern: trigger button (symbol + code + chevron) → panel with search input + filtered listbox + selected checkmark + empty state.
- autoFocus the search on open; return focus to the trigger on close. Filter by code, name, and country.
- Display currency as **sign + code** (e.g. `$ USD`). **No flags** for now (EUR has no country flag; emoji flags break on Windows) — left as a documented next step.

## Accessibility

- Real `<label>`s associated with both inputs (placeholders are not labels).
- The conversion result lives in an `aria-live="polite"` region so it is announced on change.
- Error/unavailable state is announced (`role="alert"` or a live region).
- Fully keyboard-operable; visible focus rings (never `outline: none` without a replacement).
- Logo SVG: `role="img"` + `aria-label`.

## Testing

- **Vitest is added with the code it tests** — the parser tests land in the same commit as the parser, never backfilled later.
- Highest-value tests: `parseRates` (well-formed input, per-100 `Amount`, malformed/empty lines, the date header) and the conversion math.
- Component tests with RTL + MSW (mock the CNB response via a fixture).
- Playwright e2e: mocked happy path, the conversion test, an error-state test (route fulfilled with 500), plus one live smoke test against the deployed URL. Mock the network for CI determinism.

## Observability

- Wrap reporting in a `lib/logger.ts` seam (a console no-op here). Things like a missing-whitelist currency go through it. Do **not** install Sentry — the seam makes wiring it later a one-file change.

## Environment / configuration

- The client always calls the app's own proxy path for rates (e.g. `/api/rates`) — see Deployment for how that resolves in dev vs production. No CNB URL or secrets live in client code.
- App-level configuration (brand name, locale, currency allow-list) lives in `config/`, not in `.env`. There are no required secrets for this app.

## Deployment

This section is the single source of truth for hosting, build, and the proxy. Don't restate these facts elsewhere.

- **Host:** Vercel (static SPA build output from `vite build`).
- **CNB proxy:** the CNB endpoint lacks CORS headers, so the browser never calls it directly. The app calls its own path (e.g. `/api/rates`), which is proxied to CNB server-side:
  - **Dev:** Vite dev-server proxy (`server.proxy` in `vite.config.ts`) rewrites the app path → the CNB URL.
  - **Production:** a Vercel serverless function under `api/` fetches the CNB text server-side and returns it.
- Verify the production proxy in the Vercel environment, not just locally — "works in dev, broken in prod" is the most likely failure here.

## Commits

- Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `refactor:`). Incremental and meaningful — never squash unrelated work into one commit.
- Every commit leaves the app building and deployable.

## Out of scope — do not add

SSR/Next.js, an i18n library (English strings centralized in `config` instead), a decimal library, custom CDN config, Docker, monitoring infra, routine polling. These address scale/ops this app doesn't have. The architecture is intentionally structured for extension; keep the app itself lean.

## Reference design

The Claude Design HTML (if present in the repo) is a **visual reference only** — for design tokens, layout, and spacing. Do **not** copy its inline-styled markup or components. Rebuild everything with our own primitives and styled-components.
