# Animated Three.js Redesign Plan

## Branch

- Branch: `redesign/animated-threejs`
- Base: `origin/main`
- Goal: redesign the portfolio into a highly animated, spatial, WebGL-backed one-page experience while preserving accessibility, SEO, resume content, and deploy reliability.

## Current Baseline

- App is a single-page Next.js 16 App Router site rendered by `app/page.tsx`.
- Sections are already modular: `Hero`, `About`, `Projects`, `Timeline`, `Skills`, `Education`, `Contact`.
- Resume/project content is centralized in `lib/resume-data.ts`.
- Styling is Tailwind CSS 4 plus cyberpunk CSS variables and custom keyframes in `app/globals.css`.
- Animation runtime is currently `framer-motion` plus CSS keyframes.
- No Three.js, React Three Fiber, shader, or WebGL dependencies are installed yet.
- `origin/main` has been moving the Projects section toward a product-house hierarchy; use `BytFrontier` as the flagship card, then nest `Iris`, `MacroCrafter`, and `Frontier Terminal` under it. `package.json` declares `pnpm@9.15.4`; use `pnpm` unless we intentionally migrate package managers.

## Creative Direction

Build a spatial AI-terminal portfolio: a living system that feels like a neural workbench, market terminal, and cyberpunk circuit board at once.

The portfolio content remains real DOM text. Three.js provides the ambient spatial layer, depth, scroll-reactive motion, and interactive visuals. Framer Motion handles UI choreography, section reveals, card transitions, hover/tap states, and reduced-motion fallbacks.

## Design Principles

- DOM-first content: readable, selectable, accessible, and indexable.
- WebGL as atmosphere, not as the only UI layer.
- Motion should explain hierarchy and progression, not just decorate.
- Mobile performance must be designed up front, not patched later.
- Reduced motion gets a polished static experience, not a broken one.
- Preserve existing content data contracts unless a redesign need justifies a schema addition.

## Target Experience

### Hero

- Full-screen command-center entrance.
- Client-only Three.js scene with a glowing neural/circuit core behind the name.
- Scroll-reactive camera drift and pointer parallax.
- Name reveal uses kinetic type, glitch accents, and a terminal-style status line.
- Primary CTAs: projects, contact, resume.

### About

- Dossier panel layout with glass surface, animated borders, and subtle depth.
- Summary text stays readable, with optional cursor-reactive typography as a later enhancement.
- Contact/resume badges become compact terminal chips.

### Projects

- Featured project hierarchy:
  - `BytFrontier` as the wide flagship card and user-facing brand for Frontier Tech Solutions LLC.
  - `Iris`, `MacroCrafter`, and `Frontier Terminal` as BytFrontier product modules.
  - `TheWay` as a separate faith project in development.
- Cards should have animated scanlines, light sweep, hover tilt, and deep-link affordances.
- Tech stacks become animated chips or grouped system tags.

### Experience

- Timeline becomes a scroll route through the system.
- Active job cards receive energy pulses and section-synced color states.
- Long descriptions should be easier to scan than the current dense list.

### Skills

- Replace basic progress bars with a radar/constellation/grid treatment.
- Categories appear as clusters with animated node links.
- Keep proficiency data available, but avoid making the UI feel like generic resume bars.

### Education

- Compact credential nodes with subtle orbiting or grid-snapping motion.

### Contact

- Final transmission panel.
- Animated social/contact links with clear focus states.
- Footer copy becomes more intentional and less throwaway.

## Technical Architecture

### New Dependencies

Install after branch setup:

```bash
pnpm add three @react-three/fiber @react-three/drei
pnpm add -D @types/three
```

Optional later, only if needed:

```bash
pnpm add postprocessing @react-three/postprocessing
```

Do not add postprocessing until the base scene is performant and useful without it.

### Proposed File Structure

```text
components/
  layout/
    animated-page-shell.tsx
    section-frame.tsx
    scroll-progress-rail.tsx
  visuals/
    webgl-background.tsx
    webgl-scene.tsx
    neural-field.tsx
    circuit-plane.tsx
    energy-core.tsx
    reduced-motion-background.tsx
  motion/
    variants.ts
    use-prefers-reduced-motion.ts
    use-section-progress.ts
  sections/
    hero.tsx
    about.tsx
    projects.tsx
    timeline.tsx
    skills.tsx
    education.tsx
    contact.tsx
```

### Rendering Strategy

- Load WebGL with `next/dynamic` and `ssr: false`.
- Keep one persistent canvas behind all sections.
- Drive scene state from scroll progress, pointer position, and active section.
- Clamp device pixel ratio, likely `[1, 1.5]` on desktop and `1` on mobile.
- Pause or simplify animation when the tab is hidden.
- Disable expensive effects for `prefers-reduced-motion`, low viewport widths, or poor performance.

### Motion Strategy

- Keep `framer-motion`; do not introduce a second UI animation library.
- Centralize repeated variants in `components/motion/variants.ts`.
- Replace repeated per-section `useInView` boilerplate with a shared `SectionFrame` where practical.
- Use scroll-linked transforms for major composition shifts.
- Use hover/tap motion only where it improves affordance.

### Styling Strategy

- Keep the current neon token system, but refine it into a more premium palette.
- Add semantic visual tokens for surfaces, glow, grid, glass, and terminal accents.
- Reduce inline styles where possible; keep dynamic styles only for truly variable effects.
- Keep Tailwind v4 layer rules intact. Avoid unlayered global resets that could override utilities.

## Implementation Phases

### Phase 1: Foundation

- Add Three.js dependencies.
- Add reduced-motion hook and page shell.
- Add client-only `WebGLBackground` with a minimal scene.
- Replace current fixed `CircuitBoard` background in `app/page.tsx` with the new shell.
- Keep current sections visually intact until the shell is stable.

Acceptance checks:

- `pnpm lint` passes.
- `pnpm build` passes.
- Page renders without hydration errors.
- Site remains usable if WebGL fails or reduced motion is enabled.

### Phase 2: Hero Redesign

- Build hero around the WebGL core.
- Add kinetic name/title sequence.
- Add terminal status line and primary CTAs.
- Improve mobile hero layout.

Acceptance checks:

- Hero has clear visual impact within first viewport.
- Text remains readable over the scene.
- No layout shift from dynamic canvas loading.

### Phase 3: Shared Section System

- Add `SectionFrame` for common spacing, heading animation, section IDs, and active section tracking.
- Refactor About, Projects, Timeline, Skills, Education, and Contact to use shared motion primitives.
- Preserve content imports from `lib/resume-data.ts`.

Acceptance checks:

- Sections remain linkable by ID.
- Keyboard and screen-reader flow remains logical.
- Repeated motion code is reduced.

### Phase 4: Project Showcase

- Redesign `Projects` with `BytFrontier` as the featured wide card and the LLC-centered flagship effort.
- Add animated product modules and better project hierarchy.
- Add hover/focus affordances for external links.

Acceptance checks:

- External links are obvious and accessible.
- `BytFrontier` reads as the flagship build, with Iris, MacroCrafter, and Frontier Terminal clearly nested under it and TheWay marked as a separate faith project.
- Tech tags do not overwhelm the card copy.

### Phase 5: Experience And Skills

- Convert experience timeline into a more cinematic scroll route.
- Improve long job description scanning.
- Replace skill bars with a constellation/radar-style system.

Acceptance checks:

- Work history is still easy to parse for recruiters.
- Skills are more visual without becoming vague.
- Mobile timeline is not cramped.

### Phase 6: Interaction Polish

- Add pointer parallax, hover tilt, light sweeps, and active-section color sync.
- Consider the existing `.superpowers` Force Field Text concept for selected text blocks only.
- Add reduced-motion alternatives for every major animated interaction.

Acceptance checks:

- No interaction blocks reading or navigation.
- Effects degrade cleanly on touch devices.
- Animations feel intentional rather than noisy.

### Phase 7: Performance And QA

- Test desktop and mobile viewport sizes.
- Profile animation performance in browser devtools.
- Tune DPR, particle counts, and animation loops.
- Run lint and production build.

Acceptance checks:

- `pnpm lint` passes.
- `pnpm build` passes.
- No obvious hydration/runtime errors.
- Usable on mobile Safari/Chrome.
- Reduced-motion experience is polished.

## Risk Register

- WebGL bundle size can grow quickly. Keep scene modular and avoid postprocessing until needed.
- React Three Fiber must remain client-only in Next App Router.
- Heavy text effects can hurt readability. Use them sparingly.
- Per-frame DOM updates should be avoided outside controlled interactive typography experiments.
- The repository currently has both `pnpm` config and a `bun.lock` on `origin/main`; avoid mixing install workflows until the package-manager decision is explicit.

## Initial Build Order

1. Install Three.js dependencies.
2. Add `WebGLBackground` with reduced-motion fallback.
3. Add `AnimatedPageShell` and wire it into `app/page.tsx`.
4. Redesign `Hero` against the new visual layer.
5. Refactor Projects with the `Frontier Terminal` feature card.
6. Refactor remaining sections with shared `SectionFrame`.
7. Add polish interactions and performance guards.
8. Run lint/build and tune.

## Open Decisions

- Final aesthetic direction: aggressive cyberpunk versus premium AI-terminal/founder-engineer.
- Whether to keep `bun.lock` or remove it in favor of the declared pnpm workflow.
- Whether Force Field Text should be included in the first redesign pass or treated as a separate experimental enhancement.
- Whether to add project screenshots/assets or keep everything generative and interface-driven.
