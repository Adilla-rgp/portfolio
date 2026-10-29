# AGENTS.md

## Project
Portfolio built with Next.js for Ádilla Gomes: back-end + AI/data in one site.
The objective is a production-level portfolio with clean architecture, reusable components and exceptional UI/UX.
Site language is pt-BR. All copy lives in src/content/, never hardcoded in components.

> **Visual source of truth: [`docs/DESIGN.md`](docs/DESIGN.md).** It defines the concept, tokens, typography,
> layout, primitives, motion, routes, content rules and the implementation roadmap. It overrides anything in this
> file about visual identity. The screens in `docs/design-reference/*.dc.html` are prototypes: use them as the
> spec for layout and behavior only; copy comes from src/content/. Reimplement in React. Never copy their format.

---

# Tech Stack
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4 (tokens in `@theme`)
- class-variance-authority (component variants)
- Framer Motion
- Lucide Icons

Do not add 3D libraries (Three.js, Spline) or theme switching: DESIGN.md specifies a single dark theme and
2D `<canvas>` for particles.

---

# Commands
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Type check: `npm run type-check`
- Tests: `npm test` (Vitest, `src/**/*.test.{ts,tsx}`)

> Update this section as scripts are added (tests, formatting, etc). Never guess a command — check `package.json` first.

---

# Philosophy
This project prioritizes:
- readability
- maintainability
- scalability
- performance
- accessibility
- reusable components

Avoid quick fixes. Always prefer reusable abstractions.

---

# Code Style
Always:
- use functional components
- use TypeScript
- avoid `any`
- use named exports (except where Next.js requires a default export: pages, layouts)
- use interfaces for props
- avoid duplicated code
- avoid inline styles (see "Never" for the runtime-value exception)
- keep components small

Comments:
- avoid comments that explain obvious code; prefer self-documenting code
- DO comment non-obvious decisions (library workarounds, non-trivial performance trade-offs, unusual constraints) — don't strip these

---

# Folder Structure
```
docs/
  DESIGN.md              visual source of truth
  design-reference/      HTML prototypes (spec only, not code)
src/
  app/                   routes; route-private components go in `_components/`
  components/
    ui/                  primitives (see DESIGN.md "Primitivas")
    layout/
  content/               typed site content (`as const`): site, projects, decisions, timeline
  sections/
  lib/                   cn(), motion.ts
  hooks/                 useRafTicker, ...
  styles/                globals.css, tokens.css, animations.css, utilities.css
```

---

# Component Rules
Every UI primitive must:
- use `forwardRef` and forward native props (`...props`)
- accept `className` and merge it with `cn()`
- declare variants with CVA (export the `*Variants` function for reuse, e.g. `buttonVariants` on a Next `<Link>`)
- avoid fixed widths
- be responsive

Never create page-specific components inside `ui/`.

Naming:
- Components: PascalCase
- Hooks: camelCase
- Types: PascalCase
- Files: PascalCase.tsx (hooks: camelCase.ts)

Imports: always absolute.
```ts
import { Button } from "@/components/ui/Button";
```

---

# Typography
Never use raw font-size/weight utilities for headings or body copy inside pages.
Always use `<Heading>`, `<Text>` and `<Kicker>` from `@/components/ui/Typography`, whose sizes come from the
`--text-*` tokens.

---

# Layout
Every page section follows:
```
<Section>
  <Container>
    ...
  </Container>
</Section>
```

---

# Styling
- Colors must come from the tokens in `src/styles/tokens.css` (mirrors DESIGN.md). The default Tailwind palette is disabled.
- Spacing must come from the spacing scale or the layout tokens (`gutter`, `section`, `max-w-page`).
- Avoid arbitrary Tailwind values. If a value is missing, add a token or an `@utility`.
- Avoid duplicated utility strings — extract if repeated.
- When adding a custom token namespace value, register it in `src/lib/cn.ts` so tailwind-merge resolves conflicts.

---

# Animations
- Section entrances (`FadeIn`, `RevealText`) use CSS keyframes and must leave content visible without JS. `src/lib/motion.ts` (Framer Motion) is for interaction transitions. Never duplicate animation objects.
- Infinite CSS loops (marquee, blink): keyframes in `src/styles/animations.css` only.
- Per-frame loops (canvas, SVG): `useRafTicker` (~30fps, pauses off-screen).
- Always respect `prefers-reduced-motion` (rules in DESIGN.md "Movimento").
- Per-frame work must not re-render React trees. Canvas draws imperatively; SVG and DOM updates go through refs or CSS variables. If useRafTicker exposes t as state, keep the subscribing component a small leaf.

---

# Buttons & Cards
- Always use the `Button` component — never create button styles inline.
- Every card must use the `Card` component.

---

# State
Prefer local state. Lift state only when necessary. Avoid unnecessary global state.
The portfolio lens lives in the URL (`?lente=dados`).

---

# Performance
- Lazy load heavy components (`dynamic()`)
- Memoize expensive calculations (`React.memo`, `useMemo`)
- Avoid unnecessary re-renders
- Optimize images

---

# Accessibility
See DESIGN.md "Acessibilidade". In short: real controls, semantic HTML, keyboard navigation, `aria-label` on
groups and charts, 44px touch targets, proper heading hierarchy, AA contrast, `prefers-reduced-motion`.

---

# Git
- Conventional Commits (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`), one logical change per commit, messages in Portuguese.
- Commit messages, code comments, docs and PR descriptions never mention AI tools or code assistants; no co-author trailers. Never commit agent config files (they are excluded locally in `.git/info/exclude`).
- Before each commit, check with `git log -1` that the message has none of these references.

---

# Error Handling
- Never silence TypeScript errors
- Never disable ESLint rules to bypass an issue
- Fix the root cause

---

# Future Features
Prepare the codebase (without requiring major refactoring) for:
- Projects / case studies (one route per real project)
- Blog / Articles
- CMS
- Internationalization

---

# Never
- Never use inline styles for static styling. Exception: runtime values that change continuously (animation progress, chart positions, pointer coordinates) go through CSS custom properties set via style={{ "--x": value }} and consumed by classes, or direct canvas drawing.
- Never duplicate components or abstractions
- Never create magic numbers
- Never hardcode colors or typography
- Never invent metrics (show `—` or hide the field; published pages carry no bracketed placeholders) or present illustrative data as real
- Never ignore TypeScript errors
- Never move files without justification
- Never kill processes by name (taskkill /IM, killall, pkill). Only stop processes you started, by PID or by the port they use.
