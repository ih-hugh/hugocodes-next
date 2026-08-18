# The Ascent — WebGL Engagement Overhaul

**Date:** 2026-08-17
**Status:** Approved (intro: once per session; climber: wireframe figure; scene: evolve existing)

## Goal

Turn the existing ambient WebGL background into a narrative centerpiece that
maximizes engagement: a Death Stranding-style wireframe scan intro that hands
off seamlessly into a live scene where a wireframe human climbs an ascending
wireframe building as the visitor scrolls — "a human climbing through
building and shipping solid work." Add pointer-reactive particles and deepen
the mouse-orbit parallax.

## Narrative

- **Scan intro (once per session):** black void → radial odradek-style scan
  pulse expands from center, revealing a topographic wireframe tower floor by
  floor, with a rising scan band and HUD status text. Camera dollies back and
  the intro scene *is* the live background — no swap. ~3s, skippable via
  click/Esc, auto-skipped for reduced motion / no WebGL / touch phones.
- **The Ascent:** the tower has one lit "floor" per page section (7 total).
  Scroll progress drives a procedural wireframe humanoid climbing the tower
  face. Each floor the climber passes ignites ("shipped"). Scrolling down the
  page = climbing up the tower.
- **Alive scene:** pointer particles trail the cursor with additive glow;
  the camera orbits the tower in response to the pointer instead of merely
  translating.

## Architecture

### New components

| Unit | Responsibility |
|---|---|
| `components/motion/intro-context.tsx` | `IntroProvider` + `useIntro()`. Phase machine: `scanning → revealing → live`. Reads `sessionStorage("hugocodes:intro-seen")`; exposes `phase`, `introDone`, `skip()`. |
| `components/visuals/scan-intro-overlay.tsx` | DOM HUD rendered above everything during intro: corner brackets, sequential monospace status lines, progress ticker, skip hint. SSR-rendered opaque to prevent content flash; fades out at `live`. |
| `lib/ascent/ascent.ts` | Pure math, unit-tested: scroll→climber-height mapping, floor ignition thresholds, climb-cycle limb phases, scan-reveal per-floor opacity. |

### Reworked components

- `components/visuals/webgl-scene.tsx`
  - `CameraRig`: true orbit (spherical coords) around the tower; azimuth ←
    pointer.x, elevation ← pointer.y; camera rises with scroll following the
    climber; intro dolly from close-up to resting orbit.
  - `AscentTower` (new): 7 stacked wireframe floors with varied footprints;
    per-floor emissive intensity lerps up when the climber passes.
  - `Climber` (new): procedural low-poly humanoid (box/capsule segments,
    glowing wireframe) with a procedural climb cycle (reach/pull phase
    offsets per limb), positioned on the tower face at scroll height.
  - `ScanPulse` (new): expanding ground ring + rising scan band; drives
    per-floor reveal opacity during `scanning`; subtle ambient re-pulse
    afterwards.
  - `PointerParticles` (new): ~600-particle pool emitted at the pointer
    unprojected onto a fixed-depth plane, velocity + drift + fade, additive.
  - Kept: `NeuralField` (atmosphere), `CircuitPlane` (ground grid).
  - Removed: `EnergyCore`, `DataStreams`.
- `components/layout/animated-page-shell.tsx`: wraps children in
  `IntroProvider`, renders overlay.
- `components/sections/hero.tsx`: entrance animations gate on `introDone`
  (so they play after the reveal, not behind the overlay); terminal panel
  gets subtle pointer tilt.

### Data flow

`pointer/scroll events → refs (no re-render) → useFrame` for scene;
`IntroProvider` phase → overlay (DOM) + scene uniforms (via prop) + hero
variants. No new global state library.

## Error handling / fallbacks

Existing gates stay: `prefers-reduced-motion`, touch-phone, and WebGL-support
checks fall back to `ReducedMotionBackground` and skip the intro entirely
(instant `live`). `dpr` capped at 1.5. Intro is skippable at any time;
sessionStorage failures (private mode) degrade to showing the intro.

## Testing

- Vitest: `lib/ascent/ascent.ts` pure functions (scroll mapping, floor
  thresholds, climb phases, reveal opacity), intro-phase reducer.
- Browser self-verification: dev server + automated screenshots at intro,
  post-intro hero, mid-scroll, and full-scroll; console must be error-free;
  WebGL canvas luma checked to confirm the scene actually renders.
- `pnpm lint`, `pnpm test`, `pnpm build` all green.
