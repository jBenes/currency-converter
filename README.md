![CI](https://github.com/jBenes/currency-converter/actions/workflows/ci.yml/badge.svg)

# Currency Converter

A client-side currency converter using live CZK exchange rates from the Czech National Bank (CNB). Single-page app — fetches rates once on load, converts CZK to 29 currencies.

## Stack

React, TypeScript (strict), Vite, styled-components v6, TanStack Query, Vitest, Playwright.

## Prerequisites

Node 24 (pinned in `.nvmrc`) and pnpm.

```bash
nvm use        # or fnm use — reads .nvmrc
pnpm install
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start the Vite dev server (includes CNB proxy) |
| `pnpm build` | Production build |
| `pnpm preview` | Serve the production build locally |
| `pnpm typecheck` | `tsc --noEmit` (strict) |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm test` | Vitest (unit + component) |
| `pnpm test:e2e` | Playwright (mocked, against production build) |
| `pnpm test:e2e:smoke` | Playwright live smoke (requires `SMOKE_URL`) |

## Project structure

Feature-sliced layout. Unit and component tests are colocated with the code they test; e2e tests live in `tests/e2e/`.

```
src/
  app/             # App root, providers
  pages/           # Page compositions
  features/
    exchange-rates/ # Business module: parser, converter, hooks, components
  components/
    ui/            # Pure design primitives (Input, Card, Text, FlagBadge, ...)
    ui/icons/      # Reusable SVG icon components
  layouts/         # Header, PageLayout
  theme/           # Design tokens, ThemeProvider, light/dark
  config/          # Strings, currency catalog, flag mappings
  lib/             # Framework-agnostic utilities (money formatter, logger, input sanitization)
tests/
  e2e/             # Playwright e2e specs + fixture
api/
  rates.ts         # Vercel serverless proxy (CNB pass-through)
```

## Configuration

To add or remove currencies, edit `ALLOWED_CURRENCIES` in `src/config/currencies.ts`.

## Credits

Flag SVGs sourced from [flag-icons](https://github.com/lipis/flag-icons) (public domain).
