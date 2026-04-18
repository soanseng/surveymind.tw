# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mental health questionnaire platform for 台中文心樂丞、理解身心診所 (Taichung Wenxin Lecheng / Liaojie Shenxin Clinic, https://anxiety.com.tw). Next.js 14 app with static export to Cloudflare Pages. All UI is in Traditional Chinese (zh-TW). Provides psychological assessment questionnaires with automatic scoring and result interpretation. Platform designed and maintained by 陳璿丞醫師 (https://anatomind.com).

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build (static export to `out/`)
- `npm run lint` - ESLint
- `npm run serve` - Serve the static `out/` directory locally
- `npm run build:cloudflare` - Build for Cloudflare Pages

No test framework is configured. There are no unit tests.

## Architecture

### Tech Stack
- **Next.js 14** with App Router, static export (`output: 'export'` in production)
- **TypeScript** (strict mode), **Tailwind CSS**, **shadcn/ui** (Radix UI primitives)
- **vaul** for mobile drawer component
- JavaScript obfuscation via `webpack-obfuscator` in production builds
- Path alias: `@/*` maps to project root

### Questionnaire System (28 questionnaires)

Each questionnaire lives at `app/[name]/page.tsx` as a `'use client'` component. There are three implementation patterns:

**Pattern A — Standard (most questionnaires: PHQ-9, GAD-7, TDQ, ISI, etc.)**
- Uses `useQuestionnaireForm(questionsLength)` hook for state management
- Uses `useResponsiveDialog()` for results display (Dialog on desktop, Drawer on mobile)
- Includes `<SEOHead>` for metadata and `<ShareButton>` for sharing
- Defines questions array, option values (typically 0-3 Likert scale), scoring thresholds, and severity interpretation inline
- Progress bar showing completion percentage
- Citation/reference section at bottom

**Pattern B — Custom scoring (SAS, BES, Big-5)**
- Uses `useQuestionnaireForm` but overrides scoring with custom logic (e.g., reverse-scored items, sub-scale calculations)
- Manages a separate `calculatedScore` state via `setScore`

**Pattern C — Fully custom (AUDIT, PSQI, ASRS, EDE-Q, Fibromyalgia)**
- Does NOT use `useQuestionnaireForm` — manages its own state
- Needed when questions have variable option counts/values, multi-page layouts, or complex scoring algorithms
- PSQI is the most complex (~580 lines) with text inputs, sub-questions, and 7-component scoring
- Fibromyalgia keeps pure scoring logic in a sibling `logic.ts` module because Next.js App Router disallows arbitrary named exports from `page.tsx`

### Key Hooks

- **`useQuestionnaireForm<TScoreType>(questionsLength, questionsPerPage?)`** — Generic hook managing answers array, pagination, validation, and simple sum scoring. Default `TScoreType` is `number`; PSQI uses `string`. When questionnaires need custom scoring, call `setScore()` after `handleSubmit`.
- **`useResponsiveDialog()`** — Returns unified component API (`Content`, `TriggerComponent`, `HeaderComponent`, etc.) that renders Dialog (desktop ≥768px) or Drawer (mobile). Used in every questionnaire's results display.
- **`useMediaQuery(query)`** — SSR-safe media query hook used by `useResponsiveDialog`.

### Navigation

The Navbar (`components/navbar.tsx`) hardcodes all categories and questionnaire links. **When adding a new questionnaire, you must also add it to the Navbar categories array.** Categories: 情緒, 睡眠, 注意力不集中, 認知功能, 人格, 創傷評估, 飲食評估, 成癮評估, 疼痛/神經.

The home page (`app/page.tsx`) also lists all questionnaires with time estimates and difficulty — **update it too when adding questionnaires.**

### SEO

`components/SEOHead.tsx` generates comprehensive meta tags and JSON-LD structured data (MedicalWebPage schema). `lib/seo-config.ts` contains centralized SEO configuration. Each questionnaire page uses `<SEOHead>` with questionnaire-specific metadata.

### Layout

`app/layout.tsx` provides the app shell: sticky header with Navbar, clinic branding, footer with medical disclaimers, and Cloudflare Web Analytics script.

### Available shadcn/ui Components

`components/ui/`: alert-dialog, button, card, dialog, drawer, dropdown-menu, input, menubar, scroll-area.

### Supporting Components

- **`ShareButton`** — Web Share API with clipboard fallback
- **`Pagination`** — Previous/Next with AlertDialog validation for unanswered questions
- **`PrintButton`** — Wraps `window.print()` for browser-native Save-as-PDF. Used on fibromyalgia and MIDAS result pages so clinicians can print the scored report. Paired with `@media print` rules in `app/globals.css` that neutralize Radix Dialog / vaul Drawer portal overlays (`[data-radix-dialog-content]`, `[vaul-drawer]`) and expose `.print-header`, `.print-footer`, and `.print-section-label` blocks for A4 output. Result surfaces tag themselves with `data-print-root` so the print rules can find them.
- **`AnswerDetailList`** — Collapsible per-question breakdown shown on result pages. Accepts `AnswerDetailItem[]` (question, answerLabel, score, optional note). Multiple instances can compose on one page for grouped scoring (e.g., fibromyalgia splits WPI / SSS core / SSS somatic / duration / NRS into separate lists).

## Adding a New Questionnaire

1. Create `app/[name]/page.tsx` following Pattern A (or B/C if needed). For Pattern C with shared data/scoring, put the logic in a sibling `logic.ts` module — Next.js App Router disallows arbitrary named exports from `page.tsx`.
2. Add entry to `questionnaires` and `categories` in `lib/seo-config.ts` (sitemap auto-derives from these keys).
3. Add entry to `categories` array in `components/navbar.tsx`.
4. Add entry to the categories section in `app/page.tsx`.
5. Add `<SEOHead>` with appropriate medical metadata.
6. Include academic citation/reference section on the page.
7. If the result page renders a modal surface, wrap content in `<Content>` → `<ContentComponent>` from `useResponsiveDialog()` — skipping `<ContentComponent>` makes Radix render children inline instead of in a portal.
8. Run `npm run build` to verify static export generates the new route.

### Common pitfalls (learned from past incidents)

- **Inline sub-components inside render:** Defining a sub-component inside the page's render body (e.g., `const RegionGroup = (...) => ...`) creates a new component type on every render. React unmounts and remounts its children on every state change, dropping focus and in-flight events. Inline the JSX instead, or define the sub-component outside the page component.
- **Missing `<ContentComponent>` wrapper:** `useResponsiveDialog()` returns both `Content` (Dialog/Drawer root) and `ContentComponent` (DialogContent/DrawerContent). The content surface requires BOTH. Passing children directly to `<Content>` renders them inline instead of in the portal. See PHQ-9 for the reference pattern.
