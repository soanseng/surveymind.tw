# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Mental health questionnaire platform for 文心樂丞診所 (Wenxin Lecheng Clinic). Next.js 14 app with static export to Cloudflare Pages. All UI is in Traditional Chinese (zh-TW). Provides psychological assessment questionnaires with automatic scoring and result interpretation.

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

### Questionnaire System (26 questionnaires)

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

**Pattern C — Fully custom (AUDIT, PSQI, ASRS, EDE-Q)**
- Does NOT use `useQuestionnaireForm` — manages its own state
- Needed when questions have variable option counts/values, multi-page layouts, or complex scoring algorithms
- PSQI is the most complex (~580 lines) with text inputs, sub-questions, and 7-component scoring

### Key Hooks

- **`useQuestionnaireForm<TScoreType>(questionsLength, questionsPerPage?)`** — Generic hook managing answers array, pagination, validation, and simple sum scoring. Default `TScoreType` is `number`; PSQI uses `string`. When questionnaires need custom scoring, call `setScore()` after `handleSubmit`.
- **`useResponsiveDialog()`** — Returns unified component API (`Content`, `TriggerComponent`, `HeaderComponent`, etc.) that renders Dialog (desktop ≥768px) or Drawer (mobile). Used in every questionnaire's results display.
- **`useMediaQuery(query)`** — SSR-safe media query hook used by `useResponsiveDialog`.

### Navigation

The Navbar (`components/navbar.tsx`) hardcodes all categories and questionnaire links. **When adding a new questionnaire, you must also add it to the Navbar categories array.** Categories: 情緒, 睡眠, 注意力不集中, 認知功能, 人格, 創傷評估, 飲食評估, 成癮評估.

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

## Adding a New Questionnaire

1. Create `app/[name]/page.tsx` following Pattern A (or B/C if needed)
2. Add entry to `categories` array in `components/navbar.tsx`
3. Add entry to the categories section in `app/page.tsx`
4. Add `<SEOHead>` with appropriate medical metadata
5. Include academic citation/reference section
6. Run `npm run build` to verify static export generates the new route
