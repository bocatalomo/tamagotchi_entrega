# AGENTS.md

## Purpose
Guidance for agentic coding in this repo. Keep changes aligned with existing patterns and the retro, pixel-art game aesthetic.

## Environment
- App: React 19 + TypeScript + Vite PWA
- UI: Framer Motion animations, Tone.js audio
- Storage: localStorage persistence
- Auth: Firebase (auth only)

## Cursor/Copilot Rules
- No .cursor/rules/, .cursorrules, or .github/copilot-instructions.md found in this repo.

## Commands
```bash
# Dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Type check + build (recommended before PRs)
npm run build:check

# Preview production build
npm run preview

# Lint all files (ESLint 9 flat config)
npm run lint

# TypeScript type checking only
npm run typecheck

# Tests (Vitest)
npm run test
npm run test:ui
npm run test:coverage

# Single test file (non-watch)
npm run test -- --run <file-or-glob>

# Tests matching a pattern
npm run test -- <pattern>
```

## Test Examples
```bash
npm run test -- --run src/hooks/usePetState.test.ts
npm run test -- PixelPet
npm run test:coverage -- --reporter=html
```

## Repo Structure
```text
src/
components/     UI components (TSX)
components/minigames/  Minigame components
components/skategame/  Skate game physics
contexts/       Context providers (GameContext, AuthContext)
hooks/          Custom hooks
types/          Shared types
utils/          Utilities (audio, animation, etc.)
constants/      Game constants
reducers/       Reducers (petReducer)
services/       Service layer
firebase/       Firebase config
stateMachine/   State machine logic
App.tsx         App root
main.tsx        Entry point
index.css       Global styles
```

## Code Style

### TypeScript
- Prefer explicit parameter and return types for exported functions.
- Use `interface` for object shapes; `type` for unions and primitives.
- Use `as const` for literal enums and readonly tuples.
- Path alias: `@/*` maps to `src/*`.
- Strict mode is disabled; still avoid `any` and implicit `any`.

### React
- Function components only.
- Default export for page-level components; named exports for reusable components.
- Props interfaces named `<ComponentName>Props`.
- Keep render logic clear and flat; extract large blocks to helpers or subcomponents.

### Hooks
- Custom hooks must start with `use`.
- Favor `useCallback` for prop callbacks and `useMemo` for expensive derived values.
- Clean up timers/intervals in `useEffect` return functions.

### State Management
- `useState` for local UI state.
- `useReducer` for complex state transitions (see GameContext).
- Context consumers must handle `null`/missing providers (throw or guard).

### Imports
- Group imports: react -> third-party -> absolute -> relative -> styles.
- Alphabetize within each group.
- Keep path depth shallow; prefer `@/` alias for app modules.

Example:
```ts
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import { PetState } from '@/types/pet';
import { clamp } from '@/utils/math';

import './PixelPet.css';
```

### Naming
- Components: PascalCase (`PixelPet`).
- Hooks: camelCase with `use` prefix (`usePetState`).
- Functions/vars: camelCase (`handleSleepToggle`).
- Constants: SCREAMING_SNAKE_CASE (`MAX_ENERGY`).
- Types: PascalCase (`GameReward`).
- Files: PascalCase for components/hooks; kebab-case for utilities.

### Styling
- Co-locate styles with components (e.g., `Button.tsx` + `Button.css`).
- Use CSS variables for theme colors.
- Prefer pixel-art cues: 4px borders, blocky shadows, crisp edges.
- Follow BEM-like class naming: `block__element--modifier`.
- Mobile-first layout; verify small screens.

### Error Handling
- Wrap `JSON.parse` in try/catch and provide defaults.
- Log async errors with `console.error` and a descriptive message.
- Surface user-friendly errors via UI state (Spanish, see below).

### Localization
- UI strings are in Spanish.
- Error messages shown to users should be in Spanish.
- Console logs/debugging can be in English.

### File Organization
- One component per file (small helpers ok inline).
- Use `index.ts` barrels sparingly for stable surfaces (hooks, types).
- Keep files under ~1000 lines when possible.

### Performance
- Avoid re-renders with memoization where appropriate.
- Clean up intervals and event listeners.
- Use `React.memo` for stable, frequent components.

## Testing
- Vitest + React Testing Library.
- Setup file: `src/test/setup.ts`.
- Test naming: `<component>.test.tsx` / `<hook>.test.ts`.
- Prefer testing behavior over implementation details.

## PWA Notes
- PWA configured in `vite.config.js` (vite-plugin-pwa).
- Icons in `public/` (`icon-192.png`, `icon-512.png`).
- Workbox caches fonts and static assets.

## Firebase
- Config at `src/firebase/config.ts`.
- Auth only; state stored in AuthContext.

## Game Constants (for context)
- Decay interval: 30s
- Sleep duration: 5 minutes
- Max stat value: 100
- Coins per poop cleaned: 1

## Development Tips
- localStorage stores game state; clear it to reset.
- Lint before commits; build to catch production issues.
- TypeScript errors do not block dev server but show in console.
