# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a mental health questionnaire platform built for 文心樂丞診所 (Wenxin Lecheng Clinic). It's a Next.js application that provides psychological assessment questionnaires with automatic scoring and result interpretation.

## Common Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production (exports static files)
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

### Core Structure
- **Next.js 14** with App Router and static export configuration
- **TypeScript** with strict mode enabled
- **Tailwind CSS** for styling with shadcn/ui components
- **Radix UI** primitives for accessible components

### Key Directories
- `app/` - Next.js App Router pages (each questionnaire has its own route)
- `components/` - Reusable UI components including shadcn/ui components
- `hooks/` - Custom React hooks for questionnaire logic
- `lib/` - Utility functions
- `public/` - Static assets

### Questionnaire System
Each questionnaire follows a consistent pattern:
- Route: `app/[questionnaire-name]/page.tsx`
- Uses `useQuestionnaireForm` hook for state management
- Uses `useResponsiveDialog` for results display
- Implements scoring logic and severity interpretation

### Available Questionnaires
- PHQ-9 (Patient Health Questionnaire)
- GAD-7 (Generalized Anxiety Disorder)
- PSQI (Pittsburgh Sleep Quality Index)  
- TDQ (Taiwan Depression Questionnaire)
- SNAP-4 (ADHD parent questionnaire)
- ASRS (Adult ADHD Self-Report Scale)
- AD-8 (Dementia screening)
- Big-5 (Personality assessment)

### Custom Hooks
- `useQuestionnaireForm<TScoreType>` - Manages questionnaire state, scoring, and validation
- `useResponsiveDialog` - Provides responsive dialog/drawer components
- `useMediaQuery` - Media query hook for responsive behavior

### Component Architecture
- **Navbar**: Categorized menu system with responsive design (desktop menubar, mobile dropdown)
- **ShareButton**: Social sharing functionality with clipboard fallback
- **Responsive dialogs**: Automatically switches between Dialog (desktop) and Drawer (mobile)

### Styling Approach
- Uses Tailwind CSS with CSS variables for theming
- shadcn/ui components with customizable styling
- Responsive design with mobile-first approach
- Chinese language support

### Static Export Configuration
The app is configured for static export (`output: 'export'`) with:
- Unoptimized images for static hosting
- JavaScript obfuscation in production builds
- Static HTML generation for all routes

### Development Notes
- All questionnaires use similar patterns - when adding new ones, follow existing structure
- Scoring logic is implemented per questionnaire with severity interpretation
- Results are displayed in responsive dialogs with sharing functionality
- Navigation is categorized by psychological domain (emotion, sleep, attention, etc.)
- Form validation ensures all questions are answered before submission

### Key Dependencies
- Next.js 14 for framework
- Radix UI for accessible components
- Tailwind CSS for styling
- Lucide React for icons
- TypeScript for type safety