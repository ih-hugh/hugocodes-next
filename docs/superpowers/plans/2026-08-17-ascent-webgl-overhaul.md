# The Ascent — WebGL Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the ambient WebGL background with a narrative scene — scan intro, wireframe climber ascending a 7-floor wireframe tower driven by scroll, pointer particles, and true orbit parallax.

**Architecture:** Pure math lives in `lib/ascent/ascent.ts` (unit-tested). An `IntroProvider` phase machine (`scanning → revealing → live`) coordinates a DOM HUD overlay, content visibility, and the R3F scene. The scene is reworked in place: `AscentTower` + `Climber` + `ScanPulse` + `PointerParticles` join the kept `NeuralField`/`CircuitPlane`; `EnergyCore`/`DataStreams` are removed.

**Tech Stack:** Next.js 16 App Router, React 19, @react-three/fiber 9, three 0.184, framer-motion 12, Tailwind 4, vitest.

**Spec:** `docs/superpowers/specs/2026-08-17-ascent-webgl-overhaul-design.md`

## Global Constraints

- Intro plays once per session (`sessionStorage["hugocodes:intro-seen"]`), skippable via click/Esc, auto-skipped when reduced motion, touch phone, or no WebGL.
- Existing fallbacks stay intact: `ReducedMotionBackground`, `dpr` `[1, 1.5]`, touch-phone disable.
- Palette: cyan `#00f5ff` / ice `#79fbff` / electric `#1bd7ff` / violet `#7c5cff`; ignition beacons amber `#ffc76a`.
- No new dependencies. No external 3D assets (procedural geometry only).
- Pointer/scroll flow through refs into `useFrame` — no per-frame React state.

---

### Task 1: Ascent math library (TDD)

**Files:**
- Create: `lib/ascent/ascent.ts`
- Test: `lib/ascent/ascent.test.ts`

**Interfaces (Produces):**
```ts
export const FLOOR_COUNT = 7;
export const FLOOR_HEIGHT = 1.1;
export const TOWER_BASE_Y = -2.25;
export const TOWER_TOP_Y: number; // TOWER_BASE_Y + FLOOR_COUNT * FLOOR_HEIGHT
export function clamp01(value: number): number;
export function climberYFor(scrollProgress: number): number; // 0→base, 1→top floor center
export function floorCenterY(index: number): number;
export function floorIgnition(index: number, climberY: number): number; // 0..1 ramp over half a floor
export function scanReveal(objectY: number, scanY: number, softness?: number): number; // 0..1
export function climbPose(cycleTime: number): { leftArm: number; rightArm: number; leftLeg: number; rightLeg: number; bob: number };
export function introPhaseAt(elapsedMs: number): "scanning" | "revealing" | "live";
export const SCANNING_MS = 2400;
export const REVEALING_MS = 800;
```

- [x] **Step 1: Write failing tests** covering: `climberYFor(0)` = TOWER_BASE_Y; `climberYFor(1)` = top floor center; clamping outside [0,1]; `floorIgnition` is 0 below floor bottom, 1 at/above floor center, monotonic between; `scanReveal` 0 far above scanY, 1 well below, smooth between; `climbPose` contralateral (leftArm ≈ rightLeg, phase-opposed to rightArm/leftLeg); `introPhaseAt(0)`="scanning", `(2500)`="revealing", `(3300)`="live".
- [x] **Step 2: Run `pnpm test` — verify FAIL** (module not found).
- [x] **Step 3: Implement** with plain trig/lerp math, no three imports.
- [x] **Step 4: Run `pnpm test` — verify PASS.**
- [x] **Step 5: Commit** `feat(ascent): add ascent math library`.

### Task 2: Intro phase machine + HUD overlay + shell wiring

**Files:**
- Create: `components/motion/intro-context.tsx`, `components/visuals/scan-intro-overlay.tsx`, `components/visuals/webgl-support.ts`
- Modify: `components/layout/animated-page-shell.tsx`, `components/visuals/webgl-background.tsx` (import `hasWebGLSupport` from new module)

**Interfaces (Produces):**
```ts
type IntroPhase = "scanning" | "revealing" | "live";
function useIntro(): { phase: IntroPhase; introDone: boolean; skip(): void };
function IntroProvider(props: { children: React.ReactNode }): JSX.Element;
function hasWebGLSupport(): boolean;
```

Behavior:
- Initial phase `"scanning"` (matches SSR). On mount: if sessionStorage seen ∥ reduced motion ∥ touch phone ∥ no WebGL → `skip()` immediately. Else timers per `SCANNING_MS`/`REVEALING_MS`; mark sessionStorage at `live`. Escape key + overlay click call `skip()`. Body scroll locked until `introDone`.
- Overlay: fixed z-60, translucent dark tint (scene visible beneath), corner brackets, sequential monospace HUD lines ("ODRADEK ARRAY ONLINE" → "SCANNING STRUCTURE" → "MAPPING 7 FLOORS // 7 SHIPPED" → "CONNECTION ESTABLISHED"), percent ticker from elapsed time, "CLICK OR ESC TO SKIP" hint. Fades out over ~700ms at `live`, then unmounts.
- Shell: `IntroProvider` wraps everything; children wrapper fades from `opacity-0` to visible on `introDone`.

- [x] **Step 1: Implement provider + overlay + wiring.**
- [x] **Step 2: `pnpm lint && pnpm test` green; manual smoke via dev server.**
- [x] **Step 3: Commit** `feat(intro): scan intro phase machine and HUD overlay`.

### Task 3: Scene rework — orbit rig, tower, climber, scan pulse

**Files:**
- Modify: `components/visuals/webgl-scene.tsx` (remove `EnergyCore`, `DataStreams`; add `AscentTower`, `Climber`, `ScanPulse`; rework `CameraRig`)

**Interfaces (Consumes):** `useIntro()` from Task 2; all math from Task 1.

Component contracts:
- `SceneContent` owns shared refs: `scrollRef` (progress 0..1), `scanYRef`, `maxScanYRef`, `climberYRef`; drives scanY from intro elapsed (jump-ease to max on skip); ambient re-pulse ring every ~16s after live.
- `CameraRig`: spherical orbit around tower axis — azimuth `pointer.x * 0.45` (+ slow auto-drift during intro), elevation `0.16 − pointer.y * 0.12`, radius `8.2 − scroll * 1.2`, orbit center rises with `climberY * 0.55`; all eased at 0.04/frame; smooth `lookAt` via eased target ref.
- `AscentTower`: 7 floors, tapering widths `2.3→1.25` with per-floor x/z jitter; each floor = wireframe box + `THREE.EdgesGeometry` line overlay + amber corner beacon; per-frame `opacity = base * scanReveal(floorCenterY, maxScanY)` and `color.lerpColors(dim, lit, floorIgnition(i, climberY))`; beacon scale-pulses on ignition.
- `Climber`: procedural humanoid group (torso box 0.16×0.34×0.1, head icosahedron 0.08, limb boxes pivoted at shoulders/hips), wireframe ice material + small additive glow sphere; y eases toward `climberYFor(scroll)`; limbs driven by `climbPose(clock * 2.2)` with amplitude eased from recent scroll velocity (idle = subtle breathing); positioned on the camera-facing tower face, facing the wall.
- `ScanPulse`: flat ground ring expanding during scanning + thin rising additive band at `scanY`; both fade when live; ambient pulse reuses the ring at low opacity.
- Keep `NeuralField` + `CircuitPlane`, fading in with scan progress. Keep fog.

- [x] **Step 1: Implement scene rework.**
- [x] **Step 2: Dev-server visual check + console clean.**
- [x] **Step 3: Commit** `feat(scene): ascent tower, climber, orbit rig, scan pulse`.

### Task 4: Pointer particles

**Files:**
- Modify: `components/visuals/webgl-scene.tsx` (add `PointerParticles` to `SceneContent`)

Contract: 600-particle pool; spawn 4–12/frame at pointer unprojected onto world plane `z = 2.5` when pointer moves, velocity from pointer delta + jitter + upward drift; per-frame integrate (drag 0.96, buoyancy), life 1.2–2s; **fade via vertexColors→black under `AdditiveBlending`** (no shader needed); dead particles recycled from a free list; `pointsMaterial` size 0.06, sizeAttenuation, depthWrite false.

- [x] **Step 1: Implement + visual check (trail visible, no GC churn — typed arrays only).**
- [x] **Step 2: Commit** `feat(scene): pointer particle trail`.

### Task 5: Hero gating + terminal panel tilt

**Files:**
- Modify: `components/sections/hero.tsx`

Changes: entrance `animate={introDone ? "visible" : "hidden"}`; typing-effect timer starts on `introDone`; `TerminalPanel` wrapper gets pointer-tilt (framer `useMotionValue`+`useSpring`, rotateX/rotateY max ±6°, `transformPerspective: 1000`, reset on leave).

- [x] **Step 1: Implement.**
- [x] **Step 2: `pnpm lint && pnpm test` green.**
- [x] **Step 3: Commit** `feat(hero): intro-gated entrance and terminal tilt`.

### Task 6: Self-verification loop

- [x] `pnpm lint`, `pnpm test`, `pnpm build` all green.
- [x] Dev server + headless browser: screenshots at intro mid-scan, post-intro hero, 50% scroll, 100% scroll; assert zero console errors; assert WebGL canvas non-black (luma check); verify skip path (click during intro), reload-in-session path (no intro), and reduced-motion path (fallback background, no intro).
- [x] Iterate on visual quality from screenshots until composition, readability, and pacing are right (multiple rounds expected).
- [x] Final commit + update plan checkboxes.

## Self-Review Notes

- Spec coverage: intro (Tasks 2–3), climber+tower (Task 3), pointer particles (Task 4), orbit parallax (Task 3), hero handoff (Task 5), fallbacks (Task 2 + existing gates), testing (Tasks 1, 6). No gaps.
- Type consistency: all cross-task names declared in Task 1/2 interface blocks; Task 3–5 consume exactly those.
