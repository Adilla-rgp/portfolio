# AGENTS.md

## Project
Premium portfolio built with Next.js, focused on Software Engineering, Artificial Intelligence and Data Engineering.
The objective is to create a production-level portfolio with clean architecture, reusable components and exceptional UI/UX.

The final result should resemble products such as Vercel, Stripe, Linear, Raycast, Clerk, Dub, Magic UI, and Aceternity UI, while maintaining its own identity.

---

# Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons

Future (only if necessary):
- Spline
- Three.js
- GSAP

---

# Commands
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Type check: `npm run type-check` (or `tsc --noEmit` if no script exists)

> Update this section as scripts are added (tests, formatting, etc). Never guess a command — check `package.json` first.

---

# Philosophy
This project prioritizes:
- readability
- maintainability
- scalability
- performance
- accessibility
- animations
- reusable components

Avoid quick fixes. Always prefer reusable abstractions.

---

# Code Style
Always:
- use functional components
- use TypeScript
- avoid `any`
- use named exports
- use interfaces for props
- avoid duplicated code
- avoid inline styles
- keep components small

Comments:
- avoid comments that explain obvious code; prefer self-documenting code
- DO comment non-obvious decisions (library workarounds, non-trivial performance trade-offs, unusual constraints) — don't strip these

---

# Folder Structure
```
src/
  components/
    ui/
    hero/
    layout/
    background/
  sections/
  lib/
  styles/
  hooks/
  types/
```

---

# Component Rules
Every UI component must:
- accept `className`
- use `cn()`
- support composition
- avoid fixed widths
- be responsive

Never create page-specific components inside `ui/`.

Naming:
- Components: PascalCase
- Hooks: camelCase
- Types: PascalCase
- Files: PascalCase.tsx

Imports: always absolute.
```ts
import { Button } from "@/components/ui/Button";
```

---

# Typography
Never use `text-6xl`, `font-bold`, etc. directly inside pages.
Always use: `<Heading>`, `<Text>`, `<Label>`, `<GradientText>`.

---

# Layout
Every page must follow:
```
<Section>
  <Container>
    ...
  </Container>
</Section>
```

---

# Styling
- Colors must come from design tokens — never random colors.
- Spacing must come from the spacing scale — never random spacing.
- Avoid arbitrary Tailwind values.
- Avoid duplicated utility strings — extract if repeated.

---

# Design Direction
- Dark theme
- Purple identity
- Glassmorphism
- Soft glow, subtle gradients
- High-quality spacing and premium typography

The final result should feel like a polished SaaS landing page rather than a traditional personal portfolio — every section should reinforce engineering quality through code organization, visual consistency, and smooth interactions.

---

# Animations
All animations must use Framer Motion.
Animation variants belong inside `lib/motion.ts`. Never duplicate animation objects — reuse variants whenever possible.
Respect `prefers-reduced-motion`.

---

# Hero
The Hero section is the most important area of the application. Its visual quality should be comparable to Vercel, Stripe, Linear, Raycast.

Hero is composed by:
- Background
- HeroContent
- HeroKeyboard
- HeroButtons
- HeroSocials
- AnimatedRole
- FloatingCards
- MouseLight

---

# Background
Background is composed by independent layers:
- MeshGradient
- Grid
- Glow
- Noise
- Particles

---

# Buttons & Cards
- Always use the `Button` component — never create button styles inline.
- Every card must inherit the `Card` component.

---

# State
Prefer local state. Lift state only when necessary. Avoid unnecessary global state.

---

# Performance
- Lazy load heavy components (`dynamic()`)
- Memoize expensive calculations (`React.memo`, `useMemo`)
- Avoid unnecessary re-renders
- Optimize images

---

# Accessibility
- Semantic HTML
- Keyboard navigation
- Proper `aria-label`
- Proper heading hierarchy
- Sufficient color contrast
- Respect `prefers-reduced-motion`

---

# Error Handling
- Never silence TypeScript errors
- Never disable ESLint rules to bypass an issue
- Fix the root cause

---

# Future Features
Prepare the codebase (without requiring major refactoring) for:
- Blog
- CMS
- Projects / Articles
- Internationalization
- Theme switching
- Admin dashboard

---

# Never
- Never use inline styles
- Never duplicate components or abstractions
- Never create magic numbers
- Never hardcode colors or typography
- Never ignore TypeScript errors
- Never move files without justification