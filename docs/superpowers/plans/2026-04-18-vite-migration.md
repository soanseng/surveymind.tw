# Vite Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate surveymind.tw from Next.js 14 to Vite 6 + React 19 + Tailwind v4 + vite-react-ssg + @unhead/react, preserving all URLs, UX, and features; fix the `next/head` SEO-prerendering bug; remove Cloudflare next-on-pages and webpack-obfuscator.

**Architecture:** Static-export SPA. Routes declared in `src/routes.tsx`, prerendered at build time by `vite-react-ssg` into `dist/<slug>/index.html`. `@unhead/react` injects meta tags/structured data into the prerendered HTML. `react-router-dom` handles client-side navigation after hydration. Deploy `dist/` directly to Cloudflare Pages — no shim.

**Tech Stack:** Vite 6, @vitejs/plugin-react 4, React 19, react-router-dom 7, vite-react-ssg, @unhead/react, Tailwind CSS v4 via @tailwindcss/vite, @fontsource-variable/inter, tw-animate-css, Vitest, TypeScript 5.7, ESLint 9.

**Spec:** `docs/superpowers/specs/2026-04-18-vite-migration-design.md`

**Branch:** `migration/vite` in worktree `.worktrees/vite-migration/`.

---

## Pre-flight

### Task 0: Verify worktree and branch

- [ ] **Step 1:** Confirm worktree
```bash
pwd  # must end with .worktrees/vite-migration
git branch --show-current  # must be migration/vite
```

- [ ] **Step 2:** Confirm baseline builds
```bash
npm install
npm run build
ls out/phq-9/index.html  # baseline static export works
```
Expected: build succeeds; `out/phq-9/index.html` exists. Screenshot the terminal output or copy-paste for comparison later.

- [ ] **Step 3:** Snapshot file list of current `out/` AND the baseline commit SHA
```bash
find out -type f -name 'index.html' | sort > /tmp/out-baseline.txt
wc -l /tmp/out-baseline.txt  # should be 30 (home + 28 + 404)
git rev-parse HEAD > /tmp/baseline-sha.txt
cat /tmp/baseline-sha.txt  # this SHA is what later tasks call "<sha>" — the pre-Phase-1 commit
```

---

## Phase 1 — Clear the deck

### Task 1: Delete Next.js artifacts and regenerate package.json

**Files:**
- Delete: `app/` (entire directory), `next.config.mjs`, `next-env.d.ts`, `tailwind.config.ts`, `postcss.config.js`, `tsconfig.tsbuildinfo`, `out/`, `.next/`
- Keep: `public/` (create if missing and move assets there), `components/`, `hooks/`, `lib/`, `docs/`, `research-papers/`, `scripts/`
- Rewrite: `package.json`, `tsconfig.json`
- Move: root `_headers`, `_redirects`, `favicon.svg`, `robots.txt` (if present), `site.webmanifest`, `favicon*.png`, `apple-touch-icon.png` → `public/`

- [ ] **Step 1:** Create `public/` and move static assets
```bash
mkdir -p public
# Move any existing root-level static files into public/
[ -f _headers ] && mv _headers public/
[ -f _redirects ] && mv _redirects public/
for f in favicon.svg favicon.ico favicon-16x16.png favicon-32x32.png apple-touch-icon.png site.webmanifest robots.txt; do
  [ -f "$f" ] && mv "$f" public/
done
# If there is already a public/ with assets, merge (move any missing)
ls public/
```
Expected: `public/` exists with favicon + manifest + _headers/_redirects.

- [ ] **Step 2:** Delete Next.js scaffolding
```bash
rm -rf app next.config.mjs next-env.d.ts tailwind.config.ts postcss.config.js tsconfig.tsbuildinfo out .next
```

- [ ] **Step 3:** Rewrite `package.json`

```json
{
  "name": "surveymind",
  "version": "0.2.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite-react-ssg build && tsx scripts/build-sitemap.ts",
    "preview": "vite preview",
    "serve": "vite preview --outDir dist",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@fontsource-variable/inter": "^5.1.0",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-icons": "^1.3.2",
    "@radix-ui/react-menubar": "^1.1.4",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@unhead/react": "^2.0.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.0",
    "tailwind-merge": "^2.6.0",
    "tw-animate-css": "^1.0.0",
    "vaul": "^1.1.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "@eslint/js": "^9.17.0",
    "eslint-plugin-react-hooks": "^5.1.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "tailwindcss": "^4.0.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.2",
    "typescript-eslint": "^8.18.0",
    "vite": "^6.0.0",
    "vite-react-ssg": "^0.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 4:** Rewrite `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": false,
    "isolatedModules": true,
    "verbatimModuleSyntax": false,
    "useDefineForClassFields": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vite/client", "vitest/globals"]
  },
  "include": ["src", "scripts", "vite.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 5:** Install
```bash
rm -rf node_modules package-lock.json
npm install
```
Expected: install completes; no peer-dep errors on React 19 / Tailwind v4. If `lucide-react` or a Radix pkg errors on React 19, note the version and upgrade to the React-19-compatible release.

- [ ] **Step 6:** Commit
```bash
git add -A
git commit -m "chore(migration): remove Next.js, install Vite + React 19 toolchain"
```

---

## Phase 2 — Scaffold Vite + Tailwind v4 + SSG

### Task 2: Vite config, entry HTML, main bootstrap

**Files:**
- Create: `vite.config.ts`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`, `eslint.config.js`, `.gitignore` update

- [ ] **Step 1:** Create `vite.config.ts`

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2022',
  },
  ssgOptions: {
    crittersOptions: false,
    onFinished() {
      // sitemap generated by post-build tsx script
    },
  },
});
```

- [ ] **Step 2:** Create `index.html`

```html
<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="#f97316" />
    <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token": "51979ef5cfae49b4afac7518f3e38c73"}'></script>
  </head>
  <body>
    <div id="root"><!--app-html--></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3:** Create `src/vite-env.d.ts`

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 4:** Create `src/main.tsx` (placeholder — filled in Phase 3)

```tsx
import { ViteReactSSG } from 'vite-react-ssg';
import { createHead } from '@unhead/react/client';
import '@fontsource-variable/inter';
import './globals.css';
import { routes } from './routes';

const head = createHead();

export const createRoot = ViteReactSSG(
  { routes },
  ({ app }) => {
    // `head` is also accessible from SSR entry via unhead's shared instance
    app.use?.(head);
  },
);
```

Note: exact Unhead bootstrap syntax depends on `@unhead/react` v2 API. If the plugin expects explicit SSR/client entries, adjust per the vite-react-ssg + unhead example. Placeholder comment left; resolved in Task 6 once tested end-to-end.

- [ ] **Step 5:** Create `eslint.config.js`

```js
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'out'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
```

- [ ] **Step 6:** Update `.gitignore`

Ensure it contains:
```
node_modules
dist
out
.DS_Store
.env.local
*.log
```

- [ ] **Step 7:** Commit
```bash
git add vite.config.ts index.html src/vite-env.d.ts src/main.tsx eslint.config.js .gitignore
git commit -m "feat(migration): add Vite config, entry HTML, ESLint flat config"
```

### Task 3: Tailwind v4 migration in globals.css

**Files:**
- Create: `src/globals.css`
- Source: port from current `app/globals.css`

- [ ] **Step 1:** Read current globals.css

```bash
cat app/globals.css  # only exists if Task 1 was skipped; otherwise use git show
git show HEAD~1:app/globals.css > /tmp/old-globals.css
cat /tmp/old-globals.css
```

- [ ] **Step 2:** Create `src/globals.css` with Tailwind v4 CSS-first config

Replace all `@tailwind base/components/utilities` directives with `@import "tailwindcss";`. Port the existing `:root { --border: ...; --warm-orange: ...; }` block verbatim. Move the custom color names (border, warm-orange, warm-coral, etc.) into `@theme` mapped to the same CSS vars. Port the `@media print` rules verbatim. Port any `.warm-text-primary`, `.print-header`, `.print-footer`, `.print-section-label` utility classes verbatim.

```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  /* Port every HSL CSS var from old globals.css :root here verbatim */
  /* --border, --input, --ring, --background, --foreground, --primary, ... */
  /* --warm-orange, --warm-coral, --warm-peach, --warm-cream, --warm-gold, --soft-brown */
  /* --radius */
}

@theme {
  --font-sans: var(--font-sans);
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-warm-orange: hsl(var(--warm-orange));
  --color-warm-coral: hsl(var(--warm-coral));
  --color-warm-peach: hsl(var(--warm-peach));
  --color-warm-cream: hsl(var(--warm-cream));
  --color-warm-gold: hsl(var(--warm-gold));
  --color-warm-brown: hsl(var(--soft-brown));
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
  --animate-accordion-down: accordion-down 0.2s ease-out;
  --animate-accordion-up: accordion-up 0.2s ease-out;
}

@keyframes accordion-down {
  from { height: 0; }
  to   { height: var(--radix-accordion-content-height); }
}
@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to   { height: 0; }
}

body {
  font-family: var(--font-sans);
}

/* Port every custom class from old globals.css verbatim: */
/* .warm-text-primary, .warm-text-secondary, .print-header, .print-footer, */
/* .print-section-label, [data-print-root] etc. */

/* Port every @media print rule verbatim, including: */
/* [data-radix-dialog-content] { all: unset !important; ... } */
/* [vaul-drawer] { ... } */
```

- [ ] **Step 3:** Update `components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "src/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

- [ ] **Step 4:** Audit every custom class/CSS var used in the codebase

```bash
grep -rhE "warm-(orange|coral|peach|cream|gold|brown)|warm-text|print-(header|footer|section-label)|data-print-root" components hooks lib | sort -u
```
Expected: every match is backed by a corresponding class or variable in `src/globals.css`. Fix any missing ones before continuing.

- [ ] **Step 5:** Commit
```bash
git add src/globals.css components.json
git commit -m "feat(migration): port Tailwind v4 theme + print CSS to src/globals.css"
```

---

## Phase 3 — Shared code, layout, SSG plumbing

### Task 4: Move shared code into `src/`

**Files:**
- Move: `components/` → `src/components/`
- Move: `hooks/` → `src/hooks/`
- Move: `lib/` → `src/lib/`

- [ ] **Step 1:** Move directories
```bash
git mv components src/components
git mv hooks src/hooks
git mv lib src/lib
```

- [ ] **Step 2:** Grep for stale imports that no longer resolve
```bash
grep -rnE "from ['\"](\.\./\.\./|\.\./)(components|hooks|lib)" src
```
Expected: zero hits. Any remaining relative imports out of src/ indicate file-depth changes — convert to `@/...`.

- [ ] **Step 3:** Grep for `'use client'` directives and delete
```bash
grep -rln "^'use client'" src
# for each file:
sed -i "/^'use client'$/d" $(grep -rln "^'use client'" src)
```
Expected: `grep -rln "^'use client'" src` returns empty.

- [ ] **Step 4:** Commit
```bash
git add -A
git commit -m "refactor(migration): move shared code into src/, drop 'use client' directives"
```

### Task 5: Rewrite SEOHead to use @unhead/react

**Files:**
- Modify: `src/components/SEOHead.tsx`

- [ ] **Step 1:** Replace the component body

```tsx
import { useHead } from '@unhead/react';
import { baseSEO, SEOConfig, organizationStructuredData } from '@/lib/seo-config';

interface SEOHeadProps {
  config: SEOConfig;
  path?: string;
  customTitle?: string;
  customDescription?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  config,
  path = '',
  customTitle,
  customDescription,
}) => {
  const title = customTitle || config.title;
  const description = customDescription || config.description;
  const url = `${baseSEO.siteUrl}${path}`;
  const imageUrl = `${baseSEO.siteUrl}${baseSEO.defaultImage}`;

  const webPageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url,
    inLanguage: 'zh-TW',
    isPartOf: {
      '@type': 'WebSite',
      name: baseSEO.siteName,
      url: baseSEO.siteUrl,
    },
    about: { '@type': 'MedicalCondition', name: 'Mental Health Assessment' },
    publisher: organizationStructuredData,
  };

  const medicalRiskEstimatorData = config.structuredData
    ? {
        '@context': 'https://schema.org',
        '@type': 'MedicalRiskEstimator',
        name: config.structuredData.name,
        description: config.structuredData.description,
        url,
        estimatesRiskOf: { '@type': 'MedicalCondition', name: config.structuredData.category },
        includedRiskFactor: { '@type': 'MedicalRiskFactor', name: 'Psychological Symptoms' },
        guidelineDate: new Date().toISOString().split('T')[0],
        riskFactor: 'Self-reported symptoms',
      }
    : null;

  useHead({
    title,
    htmlAttrs: { lang: 'zh-TW' },
    meta: [
      { name: 'description', content: description },
      { name: 'keywords', content: config.keywords.join(', ') },
      { httpEquiv: 'content-language', content: 'zh-TW' },
      { name: 'language', content: 'zh-TW' },
      { property: 'og:title', content: config.openGraph.title },
      { property: 'og:description', content: config.openGraph.description },
      { property: 'og:type', content: config.openGraph.type },
      { property: 'og:url', content: url },
      { property: 'og:locale', content: config.openGraph.locale },
      { property: 'og:site_name', content: baseSEO.siteName },
      { property: 'og:image', content: imageUrl },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:image:alt', content: title },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: config.openGraph.title },
      { name: 'twitter:description', content: config.openGraph.description },
      { name: 'twitter:image', content: imageUrl },
      { name: 'twitter:site', content: '@anxiety_tw' },
      { name: 'author', content: '陳璿丞醫師 - 台中文心樂丞、理解身心診所' },
      { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'health:category', content: 'Mental Health' },
      { name: 'health:specialty', content: 'Psychiatry' },
      { property: 'article:publisher', content: baseSEO.siteUrl },
      { property: 'article:author', content: '陳璿丞醫師' },
      { property: 'article:section', content: 'Mental Health' },
      { property: 'article:tag', content: config.keywords.slice(0, 5).join(', ') },
      { name: 'theme-color', content: '#f97316' },
      { name: 'msapplication-TileColor', content: '#f97316' },
      { name: 'rating', content: 'general' },
      { name: 'geo.country', content: 'TW' },
      { name: 'geo.region', content: 'TW' },
      { name: 'ICBM', content: '23.8, 121.0' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
      { name: 'apple-mobile-web-app-title', content: '心理健康評估' },
      ...(config.alternativeTitle
        ? [{ name: 'alternative-title', content: config.alternativeTitle }]
        : []),
    ],
    link: [
      { rel: 'canonical', href: url },
      { rel: 'alternate', hreflang: 'zh-TW', href: url },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    ],
    script: [
      { type: 'application/ld+json', innerHTML: JSON.stringify(webPageStructuredData) },
      ...(medicalRiskEstimatorData
        ? [{ type: 'application/ld+json', innerHTML: JSON.stringify(medicalRiskEstimatorData) }]
        : []),
      { type: 'application/ld+json', innerHTML: JSON.stringify(organizationStructuredData) },
    ],
  });

  return null;
};

export default SEOHead;
```

- [ ] **Step 2:** Commit
```bash
git add src/components/SEOHead.tsx
git commit -m "feat(migration): port SEOHead from next/head to @unhead/react"
```

### Task 6: App shell (`src/App.tsx`) + routes (`src/routes.tsx`)

**Files:**
- Create: `src/App.tsx`, `src/routes.tsx`
- Copy existing JSX from: `app/layout.tsx` (baseline committed before Task 1)

- [ ] **Step 1:** Create `src/App.tsx`

```tsx
import { Outlet, Link } from 'react-router-dom';
import Navbar from '@/components/navbar';
import { cn } from '@/lib/utils';

export default function App() {
  return (
    <div className={cn('min-h-screen bg-background font-sans antialiased')}>
      <div className="relative min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-2 md:py-4">
            <div className="flex items-center justify-between">
              <Link to="/" aria-label="回到首頁" className="flex items-center space-x-2 min-w-0 hover:opacity-80 transition-opacity">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold warm-text-primary truncate">
                  台中文心樂丞、理解身心診所
                </h1>
                <span className="text-sm text-muted-foreground hidden lg:inline whitespace-nowrap">
                  心理健康評估平台
                </span>
              </Link>
              <Navbar />
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>

        <footer className="border-t bg-muted/30 py-8 px-4 mt-16">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-3 text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()}{' '}
                <a href="https://anxiety.com.tw" target="_blank" rel="noopener noreferrer" className="warm-text-primary hover:underline">
                  台中文心樂丞、理解身心診所
                </a>
                {' '}— 專業心理健康評估服務
              </p>
              <p className="text-xs">
                平台由{' '}
                <a href="https://anatomind.com" target="_blank" rel="noopener noreferrer" className="warm-text-secondary hover:underline">
                  陳璿丞醫師（Anatomind）
                </a>
                {' '}設計與維護
              </p>
              <p className="text-xs">
                本平台提供的評估工具僅供參考，不能取代專業醫學診斷
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** Create `src/routes.tsx`

```tsx
import { lazy } from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import App from './App';

const SLUGS = [
  'ad-8', 'asrs', 'audit', 'bes', 'big-5', 'cdr', 'ede-q', 'fast',
  'fibromyalgia', 'ftnd', 'gad', 'hcl-32', 'igds9-sf', 'isi', 'midas',
  'msi-bpd', 'oci-r', 'pcl-5', 'pc-ptsd-5', 'pgsi', 'phq-9', 'psqi',
  'sas', 'sast', 'scoff', 'slums', 'snap-4', 'spmsq', 'tdq',
] as const;

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: App,
    children: [
      { index: true, Component: lazy(() => import('./pages/home')) },
      ...SLUGS.map((slug) => ({
        path: slug,
        Component: lazy(() => import(`./pages/${slug}`)),
      })),
      { path: '*', Component: lazy(() => import('./pages/not-found')) },
    ],
  },
];
```

- [ ] **Step 3:** Verify slug list matches `lib/seo-config.ts`

```bash
# Extract slugs from seo-config
grep -oE "^  '[a-z0-9-]+':" src/lib/seo-config.ts | sort -u
# Compare with SLUGS list above
```
Expected: 28 identical slugs in both. If mismatch, update `SLUGS` to match seo-config (single source of truth).

- [ ] **Step 4:** Commit
```bash
git add src/App.tsx src/routes.tsx
git commit -m "feat(migration): add App shell and route table"
```

### Task 7: Finalize `src/main.tsx` with Unhead + vite-react-ssg

**Files:**
- Modify: `src/main.tsx`

- [ ] **Step 1:** Replace with tested Unhead wiring

Per the `@unhead/react` v2 SSR docs + `vite-react-ssg` conventions, the client entry uses `createHead` from `@unhead/react/client`, and the server render (invoked internally by `vite-react-ssg`) uses `createHead` from `@unhead/react/server`. `vite-react-ssg` exposes an `onSSRAppRendered` / setup callback; use it to install the head instance.

```tsx
import { ViteReactSSG } from 'vite-react-ssg';
import { createHead as createClientHead } from '@unhead/react/client';
import { createHead as createServerHead } from '@unhead/react/server';
import { UnheadProvider, transformHtmlTemplate } from '@unhead/react';
import '@fontsource-variable/inter';
import './globals.css';
import { routes } from './routes';

export const createRoot = ViteReactSSG(
  { routes },
  ({ router, isClient, initialState }) => {
    const head = isClient ? createClientHead() : createServerHead();
    // Store on context so the root can wrap children with <UnheadProvider value={head}>
    initialState.head = head;
  },
);
```

Then update `src/App.tsx` to wrap output in `<UnheadProvider>`:

```tsx
// at top of App.tsx
import { UnheadProvider } from '@unhead/react';
// ... modify the component to accept head from context and wrap:
// Actually: vite-react-ssg passes initialState; Unhead v2 has a simpler API —
// use the package's documented Vite SSR integration (see @unhead/react/vite)
// if it exists. Prefer the canonical path from @unhead/react docs.
```

Build and test this wiring iteratively. The goal is: `npm run build` emits HTML files that contain `<title>` and `<meta name="description">` in raw HTML (verified by `grep` in Step 2).

- [ ] **Step 2:** Verify Unhead output in the prerendered HTML via a minimal placeholder home page

Create a temporary `src/pages/home.tsx` stub just for this test:
```tsx
import SEOHead from '@/components/SEOHead';
import { baseSEO } from '@/lib/seo-config';

export default function Home() {
  return (
    <>
      <SEOHead
        config={{
          title: 'TEST TITLE',
          description: 'TEST DESC',
          keywords: ['test'],
          openGraph: { title: 'TEST', description: 'TEST', type: 'website', locale: 'zh-TW' },
        }}
        path="/"
      />
      <div>home placeholder</div>
    </>
  );
}
```

Build and assert:
```bash
npm run build
grep -c "TEST TITLE" dist/index.html  # must be >= 1
grep -c 'content="TEST DESC"' dist/index.html  # must be >= 1
grep -c "application/ld+json" dist/index.html  # must be >= 1
```
Expected: all three counts ≥ 1. If any count is 0, Unhead SSR integration is broken — fix before proceeding. Reference: https://unhead.unjs.io/integrations/vite.

- [ ] **Step 3:** Commit
```bash
git add src/main.tsx src/App.tsx src/pages/home.tsx
git commit -m "feat(migration): wire @unhead/react SSR with vite-react-ssg"
```

---

## Phase 4 — Smoke tests for scoring logic

### Task 8: Vitest setup and fibromyalgia logic tests

**Files:**
- Create: `vitest.config.ts`, `src/pages/fibromyalgia/logic.test.ts`
- Reference: `src/pages/fibromyalgia/logic.ts` (moved in Task 11)

For ordering: we add the Vitest config and the test skeletons now, against the pre-move file paths. The tests will be finalized once `fibromyalgia/logic.ts` lives under `src/pages/fibromyalgia/`.

- [ ] **Step 1:** Create `vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 2:** Install `jsdom`
```bash
npm install -D jsdom@^25.0.0
```

- [ ] **Step 3:** Commit (tests added in Task 11 once logic.ts is in place)
```bash
git add vitest.config.ts package.json package-lock.json
git commit -m "chore(migration): add Vitest + jsdom for smoke tests"
```

---

## Phase 5 — Port pages

### Task 9: Port home page (`app/page.tsx` → `src/pages/home.tsx`)

**Files:**
- Source: `app/page.tsx` from commit before Task 1 (use `git show HEAD~N:app/page.tsx`)
- Target: `src/pages/home.tsx`

- [ ] **Step 1:** Retrieve old home page content

```bash
git log --all --oneline -- app/page.tsx | head -5
# Use the SHA before Phase 1 cleanup
git show <sha>:app/page.tsx > /tmp/home-source.tsx
```

- [ ] **Step 2:** Port to `src/pages/home.tsx`

Apply the three mechanical changes to `/tmp/home-source.tsx`:
1. Remove `'use client'` directive.
2. `import Link from 'next/link'` → `import { Link } from 'react-router-dom'`.
3. Change every `<Link href="...">` to `<Link to="...">`.

Write result to `src/pages/home.tsx`.

- [ ] **Step 3:** Build and smoke-check

```bash
npm run build
# Home page exists and has meta tags
grep -c "<title>" dist/index.html
grep -c 'content="description"' dist/index.html || true
```
Expected: `<title>` present. If build fails, fix import or syntax error before proceeding.

- [ ] **Step 4:** Commit
```bash
git add src/pages/home.tsx
git commit -m "feat(migration): port home page"
```

### Task 10: Port `not-found` page

**Files:**
- Target: `src/pages/not-found.tsx`
- Source: `app/not-found.tsx`

- [ ] **Step 1:** Retrieve and port
```bash
git show <sha>:app/not-found.tsx > /tmp/nf.tsx
# Apply three mechanical changes (see Task 9 Step 2)
# Write to src/pages/not-found.tsx
```

- [ ] **Step 2:** Commit
```bash
git add src/pages/not-found.tsx
git commit -m "feat(migration): port not-found page"
```

### Task 11: Port Pattern C pages (one per subagent dispatch)

Pattern C pages have custom state — these are the riskiest. Port one at a time with a full build smoke check.

**Slugs (Pattern C):** `audit`, `psqi`, `asrs`, `ede-q`, `fibromyalgia`.

**Special:** `fibromyalgia` ships with a sibling `logic.ts`. Target path: `src/pages/fibromyalgia/index.tsx` + `src/pages/fibromyalgia/logic.ts` + `src/pages/fibromyalgia/logic.test.ts`. Update the dynamic `import(\`./pages/${slug}\`)` in `routes.tsx` to resolve either a `.tsx` file or a folder's `index.tsx` (Vite handles both by default via `resolve.extensions`; add `.tsx` and index-resolution if needed).

For each slug in the list above:

- [ ] **Step 1:** Retrieve old page
```bash
git show <sha>:app/<slug>/page.tsx > /tmp/<slug>.tsx
# For fibromyalgia:
git show <sha>:app/fibromyalgia/logic.ts > /tmp/fibromyalgia-logic.ts
```

- [ ] **Step 2:** Apply three mechanical changes + write

For non-folder pages: `src/pages/<slug>.tsx`.

For fibromyalgia: `src/pages/fibromyalgia/index.tsx` + `src/pages/fibromyalgia/logic.ts` (verbatim copy).

- [ ] **Step 3:** For fibromyalgia only — add smoke tests

Create `src/pages/fibromyalgia/logic.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { computeScore } from './logic';

describe('fibromyalgia computeScore', () => {
  it('returns positive when WPI>=7 AND SSS>=5 AND duration>=3mo', () => {
    const result = computeScore({
      wpiRegions: new Array(7).fill(true).concat(new Array(12).fill(false)),
      sssCore: [2, 2, 1], // sums to 5
      sssSomatic: [false, false, false],
      durationMonths: 3,
      nrs: 5,
    });
    expect(result.meetsAcr2016).toBe(true);
  });

  it('returns positive when WPI 4-6 AND SSS>=9 AND duration>=3mo', () => {
    const result = computeScore({
      wpiRegions: new Array(5).fill(true).concat(new Array(14).fill(false)),
      sssCore: [3, 3, 3], // sums to 9
      sssSomatic: [false, false, false],
      durationMonths: 3,
      nrs: 5,
    });
    expect(result.meetsAcr2016).toBe(true);
  });

  it('returns negative when duration < 3 months even if WPI/SSS met', () => {
    const result = computeScore({
      wpiRegions: new Array(8).fill(true).concat(new Array(11).fill(false)),
      sssCore: [3, 3, 2],
      sssSomatic: [false, false, false],
      durationMonths: 2,
      nrs: 5,
    });
    expect(result.meetsAcr2016).toBe(false);
  });

  it('returns negative when WPI<4 regardless of SSS', () => {
    const result = computeScore({
      wpiRegions: new Array(3).fill(true).concat(new Array(16).fill(false)),
      sssCore: [3, 3, 3],
      sssSomatic: [true, true, true],
      durationMonths: 6,
      nrs: 5,
    });
    expect(result.meetsAcr2016).toBe(false);
  });
});
```

Note: before writing, open `src/pages/fibromyalgia/logic.ts` and adjust field names in the test (`wpiRegions`, `sssCore`, `sssSomatic`, `durationMonths`, `nrs`, `meetsAcr2016`) to match the actual exported types. The test names describe the intent — field names come from the actual module.

- [ ] **Step 4:** Run test
```bash
npm test -- src/pages/fibromyalgia/logic.test.ts
```
Expected: 4 tests pass.

- [ ] **Step 5:** Build smoke check
```bash
npm run build
ls dist/<slug>/index.html
grep -c "<title>" dist/<slug>/index.html
```
Expected: file exists, `<title>` present.

- [ ] **Step 6:** Commit per page
```bash
git add src/pages/<slug>*
git commit -m "feat(migration): port <slug> page"
```

### Task 12: Port Pattern B pages

**Slugs (Pattern B — custom scoring on top of useQuestionnaireForm):** `sas`, `bes`, `big-5`.

For each slug:

- [ ] **Step 1:** `git show <sha>:app/<slug>/page.tsx > /tmp/<slug>.tsx`
- [ ] **Step 2:** Apply three mechanical changes, write to `src/pages/<slug>.tsx`
- [ ] **Step 3:** `npm run build` — must emit `dist/<slug>/index.html` with `<title>`
- [ ] **Step 4:** Commit: `git commit -m "feat(migration): port <slug> page"`

### Task 13: Port Pattern A pages

**Slugs (Pattern A — standard):** `ad-8`, `cdr`, `fast`, `ftnd`, `gad`, `hcl-32`, `igds9-sf`, `isi`, `midas`, `msi-bpd`, `oci-r`, `pcl-5`, `pc-ptsd-5`, `pgsi`, `phq-9`, `sast`, `scoff`, `slums`, `snap-4`, `spmsq`, `tdq`.

For each slug (batched in groups of 5 per commit to avoid 21 tiny commits):

- [ ] **Step 1:** For each slug in the group: `git show <sha>:app/<slug>/page.tsx`, apply three mechanical changes, write to `src/pages/<slug>.tsx`.
- [ ] **Step 2:** `npm run build` — all 5 must emit HTML with `<title>`.
- [ ] **Step 3:** Commit the group: `git commit -m "feat(migration): port Pattern A pages (group N)"`.

Recommended groups:
1. `ad-8`, `cdr`, `fast`, `ftnd`, `gad`
2. `hcl-32`, `igds9-sf`, `isi`, `midas`, `msi-bpd`
3. `oci-r`, `pcl-5`, `pc-ptsd-5`, `pgsi`, `phq-9`
4. `sast`, `scoff`, `slums`, `snap-4`, `spmsq`
5. `tdq`

### Task 14: Add PHQ-9 smoke test

**Files:**
- Create: `src/hooks/useQuestionnaireForm.test.ts`

- [ ] **Step 1:** Add a smoke test for the sum-scoring behavior

```ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useQuestionnaireForm from './useQuestionnaireForm';

describe('useQuestionnaireForm sum scoring', () => {
  it('sums answers into score on submit', () => {
    const { result } = renderHook(() => useQuestionnaireForm<number>(9));
    act(() => {
      for (let i = 0; i < 9; i++) result.current.setAnswer(i, 2);
    });
    act(() => { result.current.handleSubmit(); });
    expect(result.current.score).toBe(18);
  });

  it('reports isSubmitted false until all answered', () => {
    const { result } = renderHook(() => useQuestionnaireForm<number>(3));
    act(() => { result.current.setAnswer(0, 1); });
    act(() => { result.current.handleSubmit(); });
    expect(result.current.isSubmitted).toBe(false);
  });
});
```

- [ ] **Step 2:** Install `@testing-library/react`
```bash
npm install -D @testing-library/react@^16.1.0 @testing-library/jest-dom@^6.6.3
```

- [ ] **Step 3:** Inspect actual API of `useQuestionnaireForm` before running
```bash
cat src/hooks/useQuestionnaireForm.ts
```
Adjust field names (`setAnswer`, `handleSubmit`, `score`, `isSubmitted`) in the test to match the real hook.

- [ ] **Step 4:** Run
```bash
npm test
```
Expected: all tests pass (fibromyalgia + hook).

- [ ] **Step 5:** Commit
```bash
git add src/hooks/useQuestionnaireForm.test.ts package.json package-lock.json
git commit -m "test(migration): add useQuestionnaireForm sum-scoring smoke test"
```

---

## Phase 6 — Sitemap script and final build

### Task 15: Sitemap + robots build script

**Files:**
- Create: `scripts/build-sitemap.ts`

- [ ] **Step 1:** Write the script

```ts
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { baseSEO, questionnaireSEO } from '../src/lib/seo-config';

const distDir = resolve(process.cwd(), 'dist');
mkdirSync(distDir, { recursive: true });

const lastModified = new Date().toISOString();
const urls = [
  { loc: baseSEO.siteUrl, priority: '1.0', changefreq: 'weekly' },
  ...Object.keys(questionnaireSEO).map((slug) => ({
    loc: `${baseSEO.siteUrl}/${slug}/`,
    priority: '0.8',
    changefreq: 'monthly',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

writeFileSync(resolve(distDir, 'sitemap.xml'), xml, 'utf8');

const robots = `User-agent: *
Allow: /

Sitemap: ${baseSEO.siteUrl}/sitemap.xml
Host: ${baseSEO.siteUrl}
`;
writeFileSync(resolve(distDir, 'robots.txt'), robots, 'utf8');

console.log(`Wrote sitemap.xml (${urls.length} urls) and robots.txt to dist/`);
```

- [ ] **Step 2:** Run via build
```bash
npm run build
cat dist/sitemap.xml | head -20
cat dist/robots.txt
```
Expected: sitemap lists 29 URLs (home + 28 questionnaires). Trailing slashes present on questionnaire URLs.

- [ ] **Step 3:** Commit
```bash
git add scripts/build-sitemap.ts
git commit -m "feat(migration): generate sitemap.xml and robots.txt during build"
```

---

## Phase 7 — Verification

### Task 16: Route parity check

**Files:**
- Create: `scripts/check-route-parity.sh`

- [ ] **Step 1:** Write the script

```bash
#!/usr/bin/env bash
set -euo pipefail

if [ ! -f /tmp/out-baseline.txt ]; then
  echo "No baseline. Run Task 0 Step 3 first." >&2
  exit 1
fi

find dist -type f -name 'index.html' \
  | sed 's|^dist/|out/|' \
  | sort > /tmp/dist-new.txt

diff -u /tmp/out-baseline.txt /tmp/dist-new.txt || {
  echo "ROUTE PARITY FAILED — route set differs from baseline." >&2
  exit 1
}
echo "ROUTE PARITY OK — $(wc -l < /tmp/dist-new.txt | tr -d ' ') routes match baseline."
```

- [ ] **Step 2:** Run
```bash
chmod +x scripts/check-route-parity.sh
./scripts/check-route-parity.sh
```
Expected: "ROUTE PARITY OK — 30 routes match baseline."

- [ ] **Step 3:** Commit
```bash
git add scripts/check-route-parity.sh
git commit -m "test(migration): add route parity check vs pre-migration baseline"
```

### Task 17: SEO prerender verification

- [ ] **Step 1:** Verify meta tags in raw HTML for three representative routes

```bash
for slug in phq-9 fibromyalgia psqi; do
  echo "=== $slug ==="
  grep -c "<title>" dist/$slug/index.html
  grep -c 'name="description"' dist/$slug/index.html
  grep -c "application/ld+json" dist/$slug/index.html
done
```
Expected for each: title ≥ 1, description ≥ 1, ld+json ≥ 2 (WebPage + Organization minimum; questionnaires add MedicalRiskEstimator).

- [ ] **Step 2:** Spot-check a route's actual title matches its seo-config
```bash
grep -oE "<title>[^<]+</title>" dist/phq-9/index.html
# Expected: matches questionnaireSEO['phq-9'].title
```

If any assertion fails: Unhead SSR is not picking up tags. Fix `src/main.tsx` wiring before continuing.

### Task 18: Bundle size and dev server check

- [ ] **Step 1:** Measure bundle
```bash
du -sh dist/assets/*.js | sort -h
du -sh dist | tail -1
```
Expected: smaller than previous Next.js `out/`. Record numbers in PR description.

- [ ] **Step 2:** Run dev server
```bash
npm run dev &
DEVPID=$!
sleep 3
curl -sf http://localhost:5173/ | grep -c "台中文心樂丞"
curl -sf http://localhost:5173/phq-9 | grep -c "PHQ-9" || true
kill $DEVPID
```
Expected: home page returns HTML with clinic name. No server errors.

### Task 19: QA via gstack /qa

- [ ] **Step 1:** Run the QA skill
```bash
# Bring dev server up
npm run dev &
```
Then invoke `/qa` targeting http://localhost:5173. Test paths:
- Home → click each category in Navbar → verify all 28 questionnaires accessible
- Pattern A: PHQ-9 — fill out, submit, verify score and Dialog on desktop, Drawer at <768px
- Pattern B: SAS — submit, verify reverse-scored results
- Pattern C: PSQI — verify multi-page layout, text inputs, 7-component score
- Pattern C: fibromyalgia — fill out, verify ACR 2016 classification, trigger PrintButton, confirm print preview shows only result content (no Dialog overlay)
- MIDAS — same print verification

Fix any bugs found by /qa inside the worktree; commit each fix separately.

### Task 20: Review via gstack /review

- [ ] **Step 1:** Run `/review` on the branch
- [ ] **Step 2:** Address findings with follow-up commits

---

## Phase 8 — Merge preparation

### Task 21: Final parity + docs update

- [ ] **Step 1:** Re-run build + parity + tests
```bash
npm run build
./scripts/check-route-parity.sh
npm test
```

- [ ] **Step 2:** Update `CLAUDE.md` to reflect Vite stack

Replace the "Architecture > Tech Stack" section:
- Next.js 14 with App Router → Vite 6 + react-router-dom 7 + vite-react-ssg
- Static export via `output: 'export'` → prerender via `vite-react-ssg build`
- Path alias `@/*` maps to `src/*` (was project root)

Update the "Adding a New Questionnaire" section:
- `app/[name]/page.tsx` → `src/pages/<name>.tsx`
- Add slug to `SLUGS` in `src/routes.tsx` (not implicit file-based discovery)
- No `'use client'` directive

Update `README-CLOUDFLARE.md`: build output dir changed from `out/` to `dist/`. Commands simplified: `npm run build` produces deploy-ready output, no `@cloudflare/next-on-pages` step.

- [ ] **Step 3:** Commit
```bash
git add CLAUDE.md README-CLOUDFLARE.md
git commit -m "docs(migration): update CLAUDE.md and Cloudflare readme for Vite stack"
```

### Task 22: Cloudflare Pages settings documentation

- [ ] **Step 1:** Add a deploy runbook at `docs/cloudflare-pages-migration.md` describing the one-time dashboard change:

```markdown
# Cloudflare Pages settings — Vite migration

Before merging `migration/vite` to `main`, update the Cloudflare Pages project:

- Build command: `npm run build`  (unchanged)
- Build output directory: `out` → **`dist`**
- Environment variables: unchanged
- Compatibility flags: none required

Rollback: revert the dashboard setting and git revert the merge.

The first deploy after merge should be manual-triggered from a preview URL to confirm:
- All 29 routes resolve
- `/sitemap.xml` and `/robots.txt` are served
- `_headers` and `_redirects` still apply (served from public/)
```

- [ ] **Step 2:** Commit
```bash
git add docs/cloudflare-pages-migration.md
git commit -m "docs(migration): add Cloudflare Pages deploy runbook"
```

### Task 23: PR via gstack /ship

- [ ] **Step 1:** Run `/ship` — generates VERSION bump, CHANGELOG entry, PR.
- [ ] **Step 2:** After PR is green and reviewed: `/land-and-deploy`.

---

## Out of scope (explicit)

- Questionnaire pattern consolidation (A/B/C refactor).
- Introducing Playwright E2E tests.
- Visual redesign.
- Dark mode toggle (was configured but never exposed).
- `research-papers/` directory workflow changes.

## Success criteria

- [ ] All 29 HTML files emitted by build (route parity check green)
- [ ] `<title>` + `<meta name="description">` + JSON-LD present in raw HTML of every route (verified by curl/grep — fixes the `next/head` SEO bug)
- [ ] `/qa` smoke passes for Patterns A, B, C including print output on fibromyalgia + MIDAS
- [ ] `npm test` green (fibromyalgia logic + PHQ-9 hook smoke tests)
- [ ] Bundle size smaller than current Next.js `out/`
- [ ] `npm run build` under 60 seconds
- [ ] Cloudflare Pages preview deploy serves all 29 routes with `_headers`/`_redirects` applied
