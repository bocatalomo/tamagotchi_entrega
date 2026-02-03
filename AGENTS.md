# AGENTS.md - Tamagotchi App Development Guide

## Overview
This is a React 19 + TypeScript + Vite PWA project for a virtual pet game. The app features a pixel-art retro aesthetic, persistence via localStorage, and Firebase authentication.

## Build Commands

```bash
# Development server with hot reload
npm run dev

# Build for production (outputs to /dist)
npm run build

# Type check + build combined
npm run build:check

# Preview production build locally
npm run preview

# Run linter on all files
npm run lint

# TypeScript type checking only
npm run typecheck

# Run tests (uses Vitest with jsdom)
npm run test

# Run tests with UI dashboard
npm run test:ui

# Run tests with coverage report
npm run test:coverage

# Run a single test file
npm run test -- <file-pattern>
```

**Single test example:**
```bash
npm run test -- src/components/PixelPet.test.tsx
npm run test -- --run src/hooks/usePetState.test.ts
```

## Project Structure

```
src/
├── components/     # React components (TSX)
├── contexts/       # React Context providers
├── hooks/          # Custom React hooks
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── firebase/       # Firebase configuration
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── styles/         # Global styles
```

## Code Style Guidelines

### TypeScript
- Use explicit types for function parameters and return values
- Interfaces for objects (use `interface` not `type` for objects)
- Use `as const` for literal type assertions
- Strict mode is disabled in tsconfig - noUnusedLocals/params are allowed
- Path alias: `@/*` maps to `src/*` (e.g., `@/components/Button`)

### React Components
- Use functional components with TypeScript
- Default export for page-level components
- Named exports for reusable components
- Use `.tsx` extension for all component files
- Props interfaces should be named `<ComponentName>Props`

### Hooks
- Prefix custom hooks with `use` (e.g., `usePetState`, `useGameLoop`)
- Extract reusable logic into hooks
- Group related hooks in `src/hooks/index.ts`
- Use `useCallback` for functions passed as props
- Use `useMemo` for expensive computations

### State Management
- Local state with `useState` for component-level state
- `useReducer` for complex state logic (see GameContext)
- Context API for app-wide state (AuthContext, GameContext)
- Always handle `null` in context consumers (throw error or provide defaults)

### Imports
```typescript
// React imports (alphabetical)
import { useCallback, useEffect, useMemo, useState } from 'react';

// Relative imports (ordered by depth, then alphabetical)
import './Component.css';
import { SomeType } from '../types';
import { helperFunc } from '../../utils';

// Absolute imports (alphabetical)
import Navigation from './components/Navigation';
import { PetState } from './types';
```

### Naming Conventions
- **Components**: PascalCase (e.g., `HomeScreen`, `PixelPet`)
- **Hooks**: camelCase with `use` prefix (e.g., `usePetSleep`)
- **Variables/functions**: camelCase (e.g., `handleNameSubmit`, `isSleeping`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_ENERGY`, `DECAY_RATE`)
- **Types**: PascalCase (e.g., `PetState`, `GameReward`)
- **Files**: kebab-case for non-components, PascalCase for components/hooks

### CSS/Styling
- Use CSS modules or component-scoped CSS
- Classes follow BEM-like naming: `block__element--modifier`
- Pixel-art aesthetic: 4px borders, blocky shadows
- Use CSS variables for theme colors
- Mobile-first responsive design

### Error Handling
- Use `console.error` with descriptive messages for async errors
- Wrap `JSON.parse` in try-catch blocks (see GameContext:151-162)
- Validate localStorage data on load with fallbacks
- Display user-friendly error messages via the `message` state

### Spanish UI Text
- UI strings are in Spanish (user-facing text)
- Code comments can be in Spanish or English
- Error messages should be user-friendly in Spanish
- Console logs for debugging can be in English

### File Organization
- One component per file (except very small helpers)
- Co-locate styles with components (e.g., `Button.tsx` + `Button.css`)
- Index files for barrel exports (hooks/index.ts, types/index.ts)
- Keep large files under 1000 lines when possible

### Performance
- Memoize expensive computations with `useMemo`
- Memoize callback functions with `useCallback`
- Clean up intervals/timeouts in `useEffect` cleanup functions
- Use `React.memo` for components that receive same props frequently

### Testing
- Tests use Vitest + React Testing Library
- Setup file: `./src/test/setup.ts` (configured in vitest.config.ts)
- Test files: `<component>.test.tsx` or `<hook>.test.ts`
- Pattern: `describe('ComponentName', () => { it('should...', ...); })`

### PWA Configuration
- Configured in `vite.config.js` with `vite-plugin-pwa`
- Icons: `icon-192.png` and `icon-512.png` in `/public`
- Manifest generated automatically with PWA plugin
- Workbox caching for fonts and static assets

### Firebase
- Config in `src/firebase/config.ts`
- Currently used for authentication only
- AuthContext manages user session state

### Key Constants
- Decay interval: 30 seconds
- Sleep duration: 5 minutes (300000ms)
- Energy recovery: gradual during sleep
- Max stat value: 100
- Coins per poop cleaned: 1

### Development Tips
- The app uses localStorage - clear it to reset progress
- Run `npm run lint` before committing
- TypeScript errors won't block dev server but will show in console
- Use `npm run build` to catch production issues early
