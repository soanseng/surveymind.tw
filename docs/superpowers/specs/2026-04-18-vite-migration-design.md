# Vite Migration Design — surveymind.tw

**Date:** 2026-04-18
**Author:** Claude + @soanseng
**Status:** Approved, pending implementation plan
**Scope class:** B — Migration + opportunistic fixes

## Goal

Migrate surveymind.tw off Next.js 14 to a modern Vite + React 19 + Tailwind v4 stack, preserving every URL, UI feature, and questionnaire behavior while fixing SEO prerendering and dropping unmaintained tooling.

## Motivation

Next.js provides ~5% of its value to this project: the app is static-export only, every page is `'use client'`, there are no server components, no API routes, no image optimization. The remaining coupling is trivial (`next/link`, `next/font`, `sitemap.ts`, `robots.ts`).

**Critical discovery during brainstorming:** `components/SEOHead.tsx` uses `next/head`, which is a Pages Router API. In the App Router static export, these meta tags do not reliably end up in the prerendered HTML — they are only rendered after client hydration. Crawlers that don't execute JS see none of the SEO investment. Migrating to Vite with proper SSG + `react-helmet-async` fixes this.

Secondary motivations: stack is ~2 years old, dependencies behind by multiple major versions, build is slow, JS obfuscation plugin adds bundle bloat for negligible benefit.

## Target stack

- **Vite 6** + **@vitejs/plugin-react 4**
- **React 19** + **react-dom 19**
- **react-router-dom 7** (client-side routing + SPA nav after hydration)
- **vite-react-ssg** (build-time prerendering of each route to static HTML)
- **react-helmet-async** (meta tag injection that actually ends up in SSG output)
- **Tailwind CSS v4** via `@tailwindcss/vite` (CSS-first config in `globals.css` via `@theme`)
- **@fontsource-variable/inter** (self-hosted Inter — replaces `next/font/google`)
- **tw-animate-css** (v4-compatible replacement for `tailwindcss-animate`)
- **@radix-ui/\***, **vaul**, **lucide-react**, **class-variance-authority**, **clsx**, **tailwind-merge** — all latest
- **TypeScript 5.7**, **ESLint 9 (flat config)**, **typescript-eslint**, **eslint-plugin-react-hooks**
- **tsx** (for sitemap build script)

**Removed:** `next`, `@cloudflare/next-on-pages`, `wrangler`, `webpack-obfuscator`, `autoprefixer`, `postcss` (standalone), `eslint-config-next`, `@radix-ui/react-navigation-menu` (verified unused).

## File structure

```
surveymind.tw/
├── index.html                  # Vite entry; <html>/<body>, CF analytics <script>
├── vite.config.ts              # Vite + React + vite-react-ssg + @tailwindcss/vite
├── tsconfig.json               # path alias @/* → src/*
├── eslint.config.js            # ESLint 9 flat config
├── public/                     # favicons, images, site.webmanifest
│   ├── _headers                # Cloudflare Pages headers (moved from root)
│   ├── _redirects              # Cloudflare Pages redirects (moved from root)
│   └── ...
├── src/
│   ├── main.tsx                # ViteReactSSG bootstrap; imports @fontsource
│   ├── routes.tsx              # Explicit route array (home + 28 questionnaires + 404)
│   ├── App.tsx                 # Shared layout; header, footer, <Outlet/>
│   ├── globals.css             # @import "tailwindcss"; @theme {...}; print CSS
│   ├── pages/
│   │   ├── home.tsx
│   │   ├── not-found.tsx
│   │   └── [28 questionnaire files, one per current app/[name]/page.tsx]
│   ├── components/             # moved from /components; unchanged except Link import
│   ├── hooks/                  # moved as-is
│   └── lib/                    # moved as-is
└── scripts/
    └── build-sitemap.ts        # writes dist/sitemap.xml + dist/robots.txt
```

## Routing + SSG flow

**`src/routes.tsx`** is the single source of truth:

```tsx
import { lazy } from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import App from './App';

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: lazy(() => import('./pages/home')) },
      { path: 'phq-9', Component: lazy(() => import('./pages/phq-9')) },
      { path: 'gad',   Component: lazy(() => import('./pages/gad')) },
      // ... 26 more questionnaires
      { path: '*', Component: lazy(() => import('./pages/not-found')) },
    ],
  },
];
```

**Build-time flow:**

1. `vite build` compiles the JS/CSS bundle.
2. `vite-react-ssg` walks the route tree, renders each route with React + `HelmetProvider`, and emits `dist/<slug>/index.html` per route. Trailing-slash URL structure preserved (e.g., `/phq-9/`).
3. `scripts/build-sitemap.ts` runs post-build: reads `lib/seo-config.ts` keys and writes `dist/sitemap.xml` + `dist/robots.txt`.
4. Deploy `dist/` directly to Cloudflare Pages — no wrangler/next-on-pages shim.

**Runtime flow (client):**

- Cloudflare serves the route's prerendered `index.html` (meta tags + JSON-LD structured data already in markup).
- React hydrates; `react-router-dom` takes over for SPA navigation between routes (no full reloads).
- Each questionnaire's hooks (`useQuestionnaireForm`, `useResponsiveDialog`, `useMediaQuery`), scoring logic, Radix UI, vaul drawers, and print CSS work unchanged.

## Per-page migration pattern

Each `app/<name>/page.tsx` → `src/pages/<name>.tsx` with three mechanical changes:

1. Remove `'use client'` directive (meaningless in Vite).
2. `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`; `href=` → `to=`.
3. Nothing else. Hooks, scoring, Radix, vaul, print CSS port verbatim.

## SEOHead rewrite

Replace `next/head` with `react-helmet-async`. Same props, same rendered tags — but Helmet's output is collected by `vite-react-ssg` and injected into the prerendered HTML of every route.

```tsx
import { Helmet } from 'react-helmet-async';
export default function SEOHead({ config, path, customTitle, customDescription }) {
  // identical body, <Head> → <Helmet>
}
```

`App.tsx` wraps the route outlet in `<HelmetProvider>` so SSG captures every page's tags.

## Layout migration

`app/layout.tsx` → `src/App.tsx` with these changes:

- `children` prop → `<Outlet />` from `react-router-dom`.
- `next/font/google` removed; replaced by `import '@fontsource-variable/inter'` at the top of `src/main.tsx`.
- `<html>` / `<body>` tags live in `index.html`, not in App.
- Cloudflare Web Analytics `<script>` moved into `index.html` `<head>` (static, no hydration needed).
- Sticky header, navbar, footer, medical disclaimer — JSX preserved.

## Tailwind v4 migration

- `tailwind.config.ts` deleted. Theme tokens moved to `src/globals.css`:
  ```css
  @import "tailwindcss";
  @theme {
    --color-warm-primary: ...;
    --font-sans: "Inter Variable", sans-serif;
    /* ... */
  }
  ```
- `postcss.config.js` deleted. v4 uses `@tailwindcss/vite` plugin directly.
- `@tailwind base/components/utilities` → single `@import "tailwindcss";`.
- `tailwindcss-animate` → `tw-animate-css` (drop-in v4-compatible).
- Custom utilities (`warm-text-primary`, brand colors) audited via grep and ported 1:1 to `@theme` variables.
- `@media print` rules for Radix / vaul portals kept verbatim (same selectors: `[data-radix-dialog-content]`, `[vaul-drawer]`, `.print-header`, `.print-footer`, `.print-section-label`, `[data-print-root]`).

## Sitemap + robots

`app/sitemap.ts` and `app/robots.ts` become `scripts/build-sitemap.ts`, executed as part of `npm run build`. It reads `lib/seo-config.ts` (single source of truth for questionnaire slugs) and writes `dist/sitemap.xml` + `dist/robots.txt`. Behavior identical to current Next.js output.

## JS obfuscation — dropped

Removed per scope B. Rationale:

- All questionnaire scoring is client-side and visible in the DOM regardless of bundle obfuscation.
- Obfuscation inflates bundle size 2–3×, hurting mobile LCP — a real SEO and UX cost.
- No maintained Vite/Rollup plugin for `javascript-obfuscator`; keeping it would require a custom plugin.
- esbuild's default minification (applied by Vite) provides normal production-grade minification.

## Scripts (package.json)

```json
{
  "dev": "vite",
  "build": "vite-react-ssg build && tsx scripts/build-sitemap.ts",
  "preview": "vite preview",
  "serve": "vite preview --outDir dist",
  "lint": "eslint ."
}
```

`build:cloudflare` removed — `build` now produces the deploy-ready `dist/` directly.

## Verification strategy

No test framework exists; verification is manual + build-gate.

1. **Build gate.** `npm run build` must emit 30 HTML files (home + 28 questionnaires + 404). Each must contain `<title>`, `<meta name="description">`, and JSON-LD `<script>` tags in raw HTML — verified before hydration.
2. **SEO spot-check.** `curl https://.../phq-9/ | grep -c '<meta'` on 3 routes (PHQ-9, fibromyalgia, PSQI). Confirms SEO fix vs current `next/head` behavior.
3. **Smoke test via `/qa`.** Run gstack `/qa` against `npm run dev`: home → navbar → each category → one questionnaire per implementation pattern:
   - Pattern A: PHQ-9
   - Pattern B: SAS
   - Pattern C: PSQI, fibromyalgia (also verifies print layout)
   - Verify scoring, result Dialog on desktop, Drawer on mobile, print layout on fibromyalgia + MIDAS.
4. **Route parity check.** Script compares current `out/` file list vs new `dist/` file list. Must match 1:1 on paths.
5. **Bundle size check.** New `dist/` JS total must be ≤ current `out/` JS total. Expected: significantly smaller without Next runtime + obfuscation.

## Rollout

Done in a git worktree (`superpowers:using-git-worktrees`), single branch `migration/vite`. Not incremental — Vite and Next can't coexist cleanly in one repo.

Broken into verifiable chunks (detailed by `writing-plans`):

1. Scaffold Vite + config + Tailwind v4 + SSG in empty `src/`. Port home page only. Verify build produces correct prerendered HTML with meta tags.
2. Port shared code (`components/`, `hooks/`, `lib/`) with mechanical import fixes only.
3. Rewrite `SEOHead` + `App.tsx` + sitemap build script.
4. Port all 28 questionnaire pages (mechanical; suitable for parallel dispatch via `subagent-driven-development`).
5. Delete Next.js artifacts (`app/`, `next.config.mjs`, `next-env.d.ts`, `tailwind.config.ts`, `postcss.config.js`, root `_headers` + `_redirects` moved to `public/`).
6. Build, verify, `/qa`, `/review`.

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| `react-helmet-async` stale for React 19 | Fallback to `@dr.pogodin/react-helmet` (active fork) or `vite-react-ssg`'s `documentHead` hook. Primary choice verified against latest React 19. |
| Radix / vaul latest break portal print CSS | Print CSS selectors preserved. Verified explicitly on fibromyalgia + MIDAS result pages before merge. |
| Tailwind v4 token drift (`warm-text-primary` etc.) | Grep every custom utility class before switching; port each to `@theme` explicitly in step 1. |
| React 19 ref changes break Radix | All Radix packages ship React 19 support in latest versions. |
| Cloudflare Pages expects `out/`, new build writes `dist/` | One-time Cloudflare Pages project settings update (build output dir). Documented in plan. |
| URL drift breaks indexed links | Trailing-slash preserved. Route parity check at build time catches any drift. |
| JS obfuscation removal reveals proprietary logic | Accepted. All scoring logic is inherently client-visible; obfuscation was security theater. |

## Out of scope

Deferred to follow-up work:

- Questionnaire pattern consolidation (scope C — refactor the A/B/C patterns into shared primitives).
- Introducing a test framework (Vitest + Playwright E2E).
- Migrating `research-papers/` or `scripts/` workflow changes beyond the sitemap script.
- Visual redesign.

## Success criteria

- All 29 routes (home + 28 questionnaires) build and render identically to current production.
- Meta tags, Open Graph, and JSON-LD structured data appear in prerendered HTML (verified by `curl`, not just post-hydration DevTools).
- No console errors on any page.
- Result dialogs/drawers, scoring, and print output work unchanged on all pattern A/B/C questionnaires.
- Cloudflare Pages deploy succeeds from `dist/` with no build shims.
- Bundle size reduced vs current baseline.
- `npm run build` completes without warnings in under 60 seconds on a typical dev machine.
