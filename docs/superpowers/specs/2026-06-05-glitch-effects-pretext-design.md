# Glitch Effects Revival + Pretext-Powered Glitch Text — Design

**Date:** 2026-06-05
**Status:** Approved (design), pending implementation plan

## Problem

After the WebGL redesign, the site's glitch aesthetic effectively disappeared. The
glitch CSS still exists in `app/globals.css` (`glitch-intense`, `chromatic-glitch`,
`flicker`, etc.), but:

- The always-on glitches run on very long cycles (`glitch-intense 8s infinite`),
  so the visible glitch frames are only ~6% of each loop — it barely fires.
- The redesign's blur/backdrop layers bury what little does fire.

Goal: bring glitch back **everywhere**, more visibly and creatively, and add a
flagship **glitching text** effect built on the `@chenglou/pretext` layout engine.

## Approved Decisions

- **Glitch scope:** *Reactive layers* — subtle ambient glitch on headings + stronger
  bursts triggered by hover, scroll-into-view, and random timers across all elements.
  Readable, not constant chaos.
- **Pretext role:** *Canvas glitch renderer* — a new reusable component renders large
  headings to `<canvas>` using Pretext's reflow-free line/glyph layout, enabling true
  RGB split, slice displacement, and scramble.
- **Glitch flavors:** RGB channel split, slice displacement, scramble/decode.
  (Heavy CRT/scanline intentionally skipped — `ScanLines` already covers that.)
- **Accessibility:** Respect `prefers-reduced-motion` — disable heavy glitch + scramble
  for those users; keep a clean static neon look.

## Honest framing of Pretext

`@chenglou/pretext` is a **text measurement & layout** library, not a glitch effect.
Its value here: it returns exact line breaks and per-line widths **without** touching
the DOM (`getBoundingClientRect`/reflow). We own the glitch painting on top. This lets
us repaint glitch frames every animation frame with zero layout thrash.

API we rely on:
- `prepareWithSegments(text, font, options?)` — one-time analysis (run once per text+font).
- `layoutWithLines(prepared, maxWidth, lineHeight)` — returns `{ height, lineCount, lines[] }`
  where each line has `{ text, width, start, end }`. Re-run only on width change.
- Per-glyph x positions within a line come from one cheap canvas `measureText` pass
  (Pretext handles the hard part: correct line breaking).

Caveats to honor: `font` and `lineHeight` must be synced with the CSS used for the
accessible fallback; avoid `system-ui` (use a named font); requires `Intl.Segmenter` +
Canvas 2D (both fine in target browsers).

## Architecture — four pieces

### 1. `GlitchText` — flagship canvas headline (Pretext-powered)

**File:** `components/ui/glitch-text.tsx` (new). **Dependency:** `@chenglou/pretext`.

Structure:
- A **real, accessible heading** element (`as`: `h1|h2|h3|p|span`) containing the text,
  visually clipped (not `display:none` — kept for SEO, screen readers, and selection).
- An `aria-hidden` `<canvas>` absolutely positioned over it, painting the visual.

Behavior:
- `prepareWithSegments(text, font)` memoized per `(text, font)`.
- `ResizeObserver` on the container → on width change, `layoutWithLines(prepared, width,
  lineHeight)` → lines. Canvas sized to `lineCount * lineHeight`, DPR-capped at 2.
- `requestAnimationFrame` paint loop:
  - Base: crisp text in the configured neon color.
  - **RGB split:** faint ever-present red/cyan offset copies (jittered), drawn with
    additive compositing.
  - **Slice displacement:** during a burst, pick N horizontal bands (clip rects) and
    redraw the text translated sideways within each band → datamosh bars.
  - **Scramble/decode:** when `decode` is set, each glyph starts as a random charset
    glyph and resolves to the real glyph over a short stagger (on mount and/or inview).
- Animates only while in viewport (`IntersectionObserver`); pauses offscreen.
- **Reduced motion:** canvas never mounts; the accessible DOM heading is shown
  statically with neon styling.

Props:
```
text: string
font: string              // canvas shorthand, synced with CSS, e.g. "900 96px Inter"
color?: NeonColor         // default cyan
as?: "h1"|"h2"|"h3"|"p"|"span"
intensity?: "subtle"|"normal"|"heavy"
trigger?: "always"|"hover"|"inview"
decode?: boolean          // scramble-in
lineHeight?: number       // synced with CSS line-height
className?: string
```

Used on: hero name (with `decode`), every section heading.

### 2. `GlitchController` — central orchestrator for "glitch on everything"

**File:** `components/ui/glitch-controller.tsx` (new). Mounted once in `app/page.tsx`.

- Attribute-driven: any element with `data-glitch` opts in. No per-component timers.
- Random cadence: periodically selects `data-glitch` elements **currently in viewport**
  and adds a transient `glitch-burst` class (~350ms), then removes it.
- One-shot burst when an element first scrolls into view (`IntersectionObserver`).
- **Reduced motion → controller no-ops entirely** (checks the media query, bails).
- No React re-renders for bursts — direct `classList` add/remove on DOM nodes.

### 3. Enhanced `GlitchWrapper`

**File:** `components/ui/glitch-wrapper.tsx` (edit). Keep existing public API and all
current usages working. Additions:
- Optional `data-glitch` opt-in passthrough for orchestrator participation.
- Support `glitch-burst` as the transient target class.
- Proper `hover` / `inview` trigger wiring.

### 4. CSS upgrades — `app/globals.css`

- Make ambient glitch **visibly** fire (shorten/retune the always-on cycles so glitch
  frames actually show, but tastefully).
- New `.glitch-burst` utility: RGB text-shadow split + `clip-path` slice + small
  translate jitter. Works on **any** element (cards, badges, links), not just text.
- `@media (prefers-reduced-motion: reduce)` block that disables the heavy glitch
  animations (`glitch-intense`, `chromatic-glitch`, `flicker`, `.glitch-burst`)
  site-wide.

## Wiring across sections

- Hero name → `GlitchText` with `decode`.
- Each section heading (about, projects, timeline, skills, education, contact) →
  `GlitchText`.
- Cards, badges, nav items, stat tiles, terminal panel chrome → `data-glitch`.
- `ScanLines` stays as-is.

## Component boundaries

| Unit | Purpose | Depends on |
|------|---------|-----------|
| `GlitchText` | Reflow-free animated glitch headline | `@chenglou/pretext`, canvas, reduced-motion check |
| `GlitchController` | Site-wide burst orchestration via `data-glitch` | DOM, IntersectionObserver, reduced-motion check |
| `GlitchWrapper` | Per-element opt-in wrapper + triggers | CSS classes, orchestrator attribute |
| `globals.css` glitch block | Visual glitch primitives, any element | — |

Each can be understood and tested independently. `GlitchText` knows nothing about the
orchestrator; the orchestrator knows nothing about Pretext.

## Accessibility & performance guardrails

- `prefers-reduced-motion: reduce` disables heavy effects in **both** JS paths
  (`GlitchText` static fallback, `GlitchController` no-op) and CSS (media block).
- Canvas work paused when offscreen (IntersectionObserver), DPR capped at 2.
- Orchestrator only pulses in-viewport elements; bursts are class toggles, no re-render.
- Real heading text remains in the DOM for SEO and screen readers.

## Out of scope (YAGNI)

- Server-side / SVG rendering paths from Pretext.
- Per-character DOM clone approach (we chose canvas).
- Heavy CRT/scanline additions beyond existing `ScanLines`.
- Configurable glitch theming UI.

## Verification

- `pnpm build` and `pnpm lint` pass.
- Manual/browser check: glitch visibly fires on headings + ambient elements; hero name
  scramble-decodes; hover and scroll-into-view bursts work; toggling OS reduced-motion
  yields a clean static look; no console errors; no layout shift on resize.
