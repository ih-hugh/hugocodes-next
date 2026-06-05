# Glitch Effects Revival + Pretext Glitch Text — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the cyberpunk glitch aesthetic back across the whole page (ambient + hover/scroll/random bursts on every element) and add a flagship `<GlitchText>` headline that renders to `<canvas>` using `@chenglou/pretext` for reflow-free RGB-split / slice-displacement / scramble-decode effects.

**Architecture:** Pure, unit-tested logic modules in `lib/glitch/` (scramble engine, glyph layout, viewport/selection math) feed two React client components: `GlitchText` (Pretext → canvas painter, used on headings) and `GlitchController` (one central orchestrator that pulses any `[data-glitch]` element). CSS in `globals.css` provides a `.glitch-burst` primitive that works on any element plus a `prefers-reduced-motion` kill-switch. Both JS paths and the CSS respect reduced motion.

**Tech Stack:** Next.js 16 / React 19 / TypeScript 5, Tailwind v4, `@chenglou/pretext@^0.0.7`, vitest (new, pure-logic tests only), pnpm.

---

## File Structure

| File | Responsibility | New/Modify |
|------|----------------|-----------|
| `package.json` | Add `@chenglou/pretext` dep, `vitest` devDep, `test` script | Modify |
| `vitest.config.ts` | Minimal node-env vitest config | New |
| `lib/glitch/scramble.ts` | Deterministic scramble/decode string computation | New |
| `lib/glitch/scramble.test.ts` | Tests for scramble engine | New |
| `lib/glitch/glyph-layout.ts` | Per-glyph x/width from a measure fn | New |
| `lib/glitch/glyph-layout.test.ts` | Tests for glyph layout | New |
| `lib/glitch/viewport.ts` | `isInViewport`, `pickRandom` selection math | New |
| `lib/glitch/viewport.test.ts` | Tests for viewport/selection | New |
| `lib/glitch/reduced-motion.ts` | `prefersReducedMotion()` SSR-safe wrapper | New |
| `components/ui/glitch-text.tsx` | Flagship Pretext→canvas glitch headline | New |
| `components/ui/glitch-controller.tsx` | Central `[data-glitch]` burst orchestrator | New |
| `components/ui/glitch-wrapper.tsx` | Add `data-glitch` passthrough; rename old inline `GlitchText`→`GlitchTextInline` | Modify |
| `app/globals.css` | `.glitch-burst` primitive, retune ambient, reduced-motion block | Modify |
| `app/page.tsx` | Mount `<GlitchController />` | Modify |
| `components/sections/*.tsx` | Headings → `GlitchText`; cards/badges → `data-glitch` | Modify |

---

## Task 1: Add dependencies and vitest setup

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install Pretext + vitest**

Run:
```bash
pnpm add @chenglou/pretext
pnpm add -D vitest
```
Expected: both resolve; `@chenglou/pretext` at `^0.0.7` appears under `dependencies`, `vitest` under `devDependencies`.

- [ ] **Step 2: Add a `test` script**

In `package.json`, add to the `"scripts"` block (alongside `dev`/`build`/`start`/`lint`):
```json
"test": "vitest run"
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Verify the runner starts (no tests yet is fine)**

Run: `pnpm test`
Expected: vitest runs and reports "No test files found" OR exits 0. Either is acceptable — it confirms the runner is wired.

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts
git commit -m "chore: add pretext dep and minimal vitest setup"
```

---

## Task 2: Scramble/decode engine (pure, TDD)

A deterministic function that, given a target string and a progress value `0..1`, returns the partially-decoded display string. Used by `GlitchText` for the Matrix-style scramble-in.

**Files:**
- Create: `lib/glitch/scramble.ts`
- Test: `lib/glitch/scramble.test.ts`

- [ ] **Step 1: Write the failing test**

`lib/glitch/scramble.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { computeScrambledText, revealThresholds, mulberry32 } from "./scramble";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it("returns values in [0, 1)", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 50; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("revealThresholds", () => {
  it("returns one threshold per character, all within [0, 1]", () => {
    const t = revealThresholds("HELLO", 42);
    expect(t).toHaveLength(5);
    for (const v of t) {
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThanOrEqual(1);
    }
  });
  it("is deterministic for a given seed", () => {
    expect(revealThresholds("HELLO", 42)).toEqual(revealThresholds("HELLO", 42));
  });
});

describe("computeScrambledText", () => {
  it("returns the exact target at progress >= 1", () => {
    expect(computeScrambledText("HELLO WORLD", 1, 42)).toBe("HELLO WORLD");
  });
  it("preserves length at any progress", () => {
    expect(computeScrambledText("HELLO", 0, 42)).toHaveLength(5);
    expect(computeScrambledText("HELLO", 0.5, 42)).toHaveLength(5);
  });
  it("always keeps spaces as spaces", () => {
    for (const p of [0, 0.3, 0.7, 1]) {
      const out = computeScrambledText("A B C", p, 9);
      expect(out[1]).toBe(" ");
      expect(out[3]).toBe(" ");
    }
  });
  it("reveals monotonically: revealed-at-0.5 is a subset of revealed-at-0.8", () => {
    const target = "DECODE ME";
    const thresholds = revealThresholds(target, 5);
    const revealedAt = (p: number) =>
      thresholds.map((t, i) => (t <= p ? i : -1)).filter((i) => i >= 0);
    const lo = new Set(revealedAt(0.5));
    const hi = new Set(revealedAt(0.8));
    for (const i of lo) expect(hi.has(i)).toBe(true);
  });
  it("is deterministic for identical inputs", () => {
    expect(computeScrambledText("GLITCH", 0.4, 11)).toBe(
      computeScrambledText("GLITCH", 0.4, 11),
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./scramble` (module not found).

- [ ] **Step 3: Write minimal implementation**

`lib/glitch/scramble.ts`:
```ts
/** Charset of glyphs used while a character is still "scrambling". */
export const GLITCH_CHARSET =
  "!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Small deterministic PRNG (mulberry32). Returns a function producing [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Per-character reveal thresholds in [0, 1]. A character is "revealed" (shows its
 * real glyph) once `progress >= threshold[i]`. Thresholds ramp left-to-right with
 * a little seeded jitter so the decode feels organic but stays deterministic.
 */
export function revealThresholds(target: string, seed: number): number[] {
  const chars = Array.from(target);
  const rng = mulberry32(seed);
  const n = Math.max(1, chars.length);
  return chars.map((_, i) => {
    const base = (i / n) * 0.7; // left-to-right sweep over the first 70% of progress
    const jitter = rng() * 0.3;
    return Math.min(1, base + jitter);
  });
}

/**
 * Compute the display string for a scramble/decode effect.
 * - progress <= 0: fully scrambled (spaces preserved)
 * - progress >= 1: exactly `target`
 * - in between: revealed chars show real glyphs; the rest show seeded glitch glyphs.
 */
export function computeScrambledText(
  target: string,
  progress: number,
  seed: number,
): string {
  if (progress >= 1) return target;
  const chars = Array.from(target);
  const thresholds = revealThresholds(target, seed);
  // Quantize progress so the glitch glyphs only change a few times per second,
  // keeping the scramble readable rather than a blur. Deterministic per frame bucket.
  const bucket = Math.floor(Math.max(0, progress) * 24);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (ch === " " || ch === "\n" || ch === "\t") {
      out += ch;
      continue;
    }
    if (progress >= thresholds[i]) {
      out += ch;
    } else {
      const pick = mulberry32(seed + i * 101 + bucket)();
      out += GLITCH_CHARSET[Math.floor(pick * GLITCH_CHARSET.length)];
    }
  }
  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS — all `scramble.test.ts` cases green.

- [ ] **Step 5: Commit**

```bash
git add lib/glitch/scramble.ts lib/glitch/scramble.test.ts
git commit -m "feat(glitch): deterministic scramble/decode engine"
```

---

## Task 3: Glyph layout helper (pure, TDD)

Given a line of text and a `measure(text) => width` function (canvas `measureText` in production), return per-glyph x positions and widths. Pretext does the hard line-breaking; this places glyphs within a line for slice/scramble effects.

**Files:**
- Create: `lib/glitch/glyph-layout.ts`
- Test: `lib/glitch/glyph-layout.test.ts`

- [ ] **Step 1: Write the failing test**

`lib/glitch/glyph-layout.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { layoutGlyphs } from "./glyph-layout";

const fixed = (text: string) => Array.from(text).length * 10;

describe("layoutGlyphs", () => {
  it("returns empty array for empty string", () => {
    expect(layoutGlyphs("", fixed)).toEqual([]);
  });
  it("places each glyph at the cumulative measured x with correct width", () => {
    expect(layoutGlyphs("AB", fixed)).toEqual([
      { char: "A", x: 0, width: 10 },
      { char: "B", x: 10, width: 10 },
    ]);
  });
  it("is grapheme/codepoint aware (counts characters, not UTF-16 units)", () => {
    const out = layoutGlyphs("A🚀B", fixed);
    expect(out.map((g) => g.char)).toEqual(["A", "🚀", "B"]);
    expect(out[2].x).toBe(20);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./glyph-layout`.

- [ ] **Step 3: Write minimal implementation**

`lib/glitch/glyph-layout.ts`:
```ts
export type MeasureFn = (text: string) => number;

export interface GlyphPos {
  char: string;
  x: number;
  width: number;
}

/**
 * Compute per-glyph x offset and width within a single line, using cumulative
 * prefix measurement so kerning/letter-spacing baked into `measure` is respected.
 * Operates on code points (Array.from) so emoji/astral chars stay intact.
 */
export function layoutGlyphs(lineText: string, measure: MeasureFn): GlyphPos[] {
  const chars = Array.from(lineText);
  const out: GlyphPos[] = [];
  let prevWidth = 0;
  let prefix = "";
  for (let i = 0; i < chars.length; i++) {
    const x = prevWidth;
    prefix += chars[i];
    const nextWidth = measure(prefix);
    out.push({ char: chars[i], x, width: nextWidth - prevWidth });
    prevWidth = nextWidth;
  }
  return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS — `glyph-layout.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add lib/glitch/glyph-layout.ts lib/glitch/glyph-layout.test.ts
git commit -m "feat(glitch): per-glyph layout helper"
```

---

## Task 4: Viewport + selection helpers (pure, TDD)

Math the orchestrator uses to decide which elements are on-screen and which to pulse — kept pure so it's testable without a DOM.

**Files:**
- Create: `lib/glitch/viewport.ts`
- Test: `lib/glitch/viewport.test.ts`

- [ ] **Step 1: Write the failing test**

`lib/glitch/viewport.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { isInViewport, pickRandom } from "./viewport";

describe("isInViewport", () => {
  const vh = 800;
  it("is false when fully above the viewport", () => {
    expect(isInViewport({ top: -200, bottom: -50 }, vh)).toBe(false);
  });
  it("is false when fully below the viewport", () => {
    expect(isInViewport({ top: 900, bottom: 1000 }, vh)).toBe(false);
  });
  it("is true when overlapping the viewport", () => {
    expect(isInViewport({ top: 100, bottom: 300 }, vh)).toBe(true);
  });
  it("respects a margin", () => {
    expect(isInViewport({ top: 820, bottom: 900 }, vh, 50)).toBe(true);
  });
});

describe("pickRandom", () => {
  it("returns at most `count` items", () => {
    const rng = () => 0;
    expect(pickRandom([1, 2, 3, 4], 2, rng)).toHaveLength(2);
  });
  it("returns all items when count exceeds length", () => {
    const rng = () => 0;
    expect(pickRandom([1, 2], 5, rng).sort()).toEqual([1, 2]);
  });
  it("returns distinct items (no duplicates)", () => {
    let calls = 0;
    const rng = () => [0.99, 0.01, 0.5][calls++ % 3];
    const out = pickRandom(["a", "b", "c", "d"], 3, rng);
    expect(new Set(out).size).toBe(out.length);
  });
  it("returns an empty array when count <= 0", () => {
    expect(pickRandom([1, 2, 3], 0, () => 0)).toEqual([]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test`
Expected: FAIL — cannot resolve `./viewport`.

- [ ] **Step 3: Write minimal implementation**

`lib/glitch/viewport.ts`:
```ts
export interface Rectish {
  top: number;
  bottom: number;
}

/** True if [top, bottom] overlaps [-margin, viewportHeight + margin]. */
export function isInViewport(
  rect: Rectish,
  viewportHeight: number,
  margin = 0,
): boolean {
  return rect.bottom > -margin && rect.top < viewportHeight + margin;
}

/**
 * Pick up to `count` distinct items using an injected RNG (Fisher–Yates partial
 * shuffle on a copy). Deterministic given a deterministic `rng`.
 */
export function pickRandom<T>(items: T[], count: number, rng: () => number): T[] {
  if (count <= 0 || items.length === 0) return [];
  const pool = items.slice();
  const n = Math.min(count, pool.length);
  for (let i = 0; i < n; i++) {
    const j = i + Math.floor(rng() * (pool.length - i));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.slice(0, n);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test`
Expected: PASS — `viewport.test.ts` green.

- [ ] **Step 5: Commit**

```bash
git add lib/glitch/viewport.ts lib/glitch/viewport.test.ts
git commit -m "feat(glitch): viewport + selection helpers"
```

---

## Task 5: Reduced-motion utility

SSR-safe wrapper around the `prefers-reduced-motion` media query. Trivial env glue — no unit test (cannot meaningfully test `matchMedia` in node env without mocking the whole API; covered by manual verification in Task 11).

**Files:**
- Create: `lib/glitch/reduced-motion.ts`

- [ ] **Step 1: Write the implementation**

`lib/glitch/reduced-motion.ts`:
```ts
/** True if the user has requested reduced motion. SSR-safe (returns false on server). */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 2: Verify it type-checks via the production build path (deferred)**

No standalone command here; this file is exercised by `pnpm build` in Task 6 and later. Proceed.

- [ ] **Step 3: Commit**

```bash
git add lib/glitch/reduced-motion.ts
git commit -m "feat(glitch): reduced-motion media-query helper"
```

---

## Task 6: `GlitchText` — Pretext → canvas glitch headline

The flagship. Renders the real heading text in the DOM (transparent, for SEO/a11y/selection) and paints a glitch version onto an overlay `<canvas>`. Pretext provides reflow-free line breaking; canvas provides RGB split, slice displacement, and scramble decode. Reduced-motion users see the static neon DOM heading and no canvas.

**Files:**
- Create: `components/ui/glitch-text.tsx`

- [ ] **Step 1: Write the component**

`components/ui/glitch-text.tsx`:
```tsx
"use client";

import * as React from "react";
import {
  prepareWithSegments,
  layoutWithLines,
  type PreparedTextWithSegments,
} from "@chenglou/pretext";
import { cn } from "@/lib/utils";
import { computeScrambledText } from "@/lib/glitch/scramble";
import { prefersReducedMotion } from "@/lib/glitch/reduced-motion";

type GlitchColor =
  | "cyan"
  | "magenta"
  | "purple"
  | "green"
  | "orange"
  | "ice"
  | "electric"
  | "red";

type GlitchTag = "h1" | "h2" | "h3" | "p" | "span";

interface GlitchTextProps {
  text: string;
  color?: GlitchColor;
  as?: GlitchTag;
  /** Scramble-decode the text in on first paint / when it scrolls into view. */
  decode?: boolean;
  /** Tailwind classes for typography (size, weight, tracking). Drives canvas font. */
  className?: string;
}

const colorVar: Record<GlitchColor, string> = {
  cyan: "var(--neon-cyan)",
  magenta: "var(--neon-magenta)",
  purple: "var(--neon-purple)",
  green: "var(--neon-green)",
  orange: "var(--neon-orange)",
  ice: "var(--neon-ice)",
  electric: "var(--neon-electric)",
  red: "var(--neon-red)",
};

// Module-level cache so prepareWithSegments runs once per (text, font, letterSpacing).
const prepCache = new Map<string, PreparedTextWithSegments>();
function getPrepared(text: string, font: string, letterSpacing: number) {
  const key = `${text}|${font}|${letterSpacing}`;
  let p = prepCache.get(key);
  if (!p) {
    p = prepareWithSegments(text, font, { letterSpacing });
    prepCache.set(key, p);
  }
  return p;
}

interface Metrics {
  font: string;
  lineHeight: number;
  letterSpacing: number;
}

/** Read the rendered font metrics off the (transparent) DOM heading. */
function readMetrics(el: HTMLElement): Metrics {
  const cs = getComputedStyle(el);
  const fontSize = parseFloat(cs.fontSize) || 16;
  const weight = cs.fontWeight || "400";
  const family = cs.fontFamily || "sans-serif";
  const lhRaw = cs.lineHeight;
  const lineHeight =
    lhRaw === "normal" ? fontSize * 1.1 : parseFloat(lhRaw) || fontSize * 1.1;
  const letterSpacing =
    cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing) || 0;
  return { font: `${weight} ${fontSize}px ${family}`, lineHeight, letterSpacing };
}

function GlitchText({
  text,
  color = "cyan",
  as: Tag = "span",
  decode = false,
  className,
}: GlitchTextProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sizerRef = React.useRef<HTMLElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    if (prefersReducedMotion()) return; // static neon DOM heading only
    const container = containerRef.current;
    const sizer = sizerRef.current;
    const canvas = canvasRef.current;
    if (!container || !sizer || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setActive(true);

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const css = colorVar[color];
    const resolvedColor = getComputedStyle(sizer).color || "#5ff";

    let lines: { text: string }[] = [];
    let metrics: Metrics = { font: "700 48px sans-serif", lineHeight: 56, letterSpacing: 0 };
    let widthPx = 0;
    let heightPx = 0;

    // decode state
    let decoding = decode;
    let decodeStart = 0;
    const DECODE_MS = 1100;

    // burst state
    let burstUntil = 0;
    let nextBurst = 600;

    const relayout = (w: number, h: number) => {
      widthPx = Math.max(1, w);
      heightPx = Math.max(1, h);
      metrics = readMetrics(sizer);
      const prepared = getPrepared(text, metrics.font, metrics.letterSpacing);
      const res = layoutWithLines(prepared, widthPx, metrics.lineHeight);
      lines = res.lines;
      canvas.width = Math.round(widthPx * dpr);
      canvas.height = Math.round(heightPx * dpr);
      canvas.style.width = `${widthPx}px`;
      canvas.style.height = `${heightPx}px`;
    };

    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      relayout(r.width, r.height);
    });
    ro.observe(sizer);
    relayout(sizer.clientWidth, sizer.clientHeight);

    const drawLines = (offsetX: number, decodeProgress: number, seed: number) => {
      for (let i = 0; i < lines.length; i++) {
        const raw = lines[i].text;
        const str =
          decodeProgress < 1 ? computeScrambledText(raw, decodeProgress, seed + i) : raw;
        const baseY = i * metrics.lineHeight + metrics.lineHeight * 0.74;
        const j = 1.3;
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = "rgba(255,42,90,0.55)";
        ctx.fillText(str, offsetX - j, baseY);
        ctx.fillStyle = "rgba(0,240,255,0.55)";
        ctx.fillText(str, offsetX + j, baseY);
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = resolvedColor;
        ctx.fillText(str, offsetX, baseY);
      }
    };

    let raf = 0;
    let running = true;
    const start = performance.now();

    const frame = (now: number) => {
      if (!running) return;
      const t = now - start;

      // schedule random bursts
      if (t > nextBurst && now > burstUntil) {
        burstUntil = now + 220 + Math.random() * 180;
        nextBurst = t + 1800 + Math.random() * 2600;
      }
      const bursting = now < burstUntil;

      // decode progress
      let decodeProgress = 1;
      if (decoding) {
        if (decodeStart === 0) decodeStart = now;
        decodeProgress = Math.min(1, (now - decodeStart) / DECODE_MS);
        if (decodeProgress >= 1) decoding = false;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, widthPx, heightPx);
      ctx.font = metrics.font;
      ctx.textBaseline = "alphabetic";
      // @ts-expect-error letterSpacing is supported in modern canvas contexts
      ctx.letterSpacing = `${metrics.letterSpacing}px`;

      // ambient RGB jitter + base text
      const jitter = bursting ? 4 : 0.6;
      const dx = Math.sin(t * 0.012) * jitter + (bursting ? (Math.random() - 0.5) * 6 : 0);
      drawLines(dx, decodeProgress, 1337);

      // slice displacement during bursts (clip + clear + redraw, stays in CSS px)
      if (bursting) {
        const slices = 3;
        for (let k = 0; k < slices; k++) {
          const sy = Math.random() * heightPx;
          const sh = 2 + Math.random() * 10;
          const sdx = (Math.random() * 2 - 1) * (8 + Math.random() * 18);
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, sy, widthPx, sh);
          ctx.clip();
          ctx.clearRect(0, sy, widthPx, sh);
          drawLines(sdx, decodeProgress, 1337);
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(frame);
    };

    // Only animate while on screen; re-trigger decode on re-entry.
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting;
        if (visible && !running) {
          running = true;
          if (decode) {
            decoding = true;
            decodeStart = 0;
          }
          raf = requestAnimationFrame(frame);
        } else if (!visible && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(container);
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
    // text/color/decode are stable for a given heading; re-run if they change.
  }, [text, color, decode]);

  const neonShadow = `0 0 6px ${colorVar[color]}, 0 0 14px ${colorVar[color]}, 0 0 28px ${colorVar[color]}`;

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Accessible, selectable, SEO-visible heading. Transparent while canvas paints. */}
      {React.createElement(
        Tag,
        {
          ref: sizerRef,
          className: cn(className, active ? "text-transparent" : undefined),
          style: active
            ? { color: colorVar[color] } // value used by canvas via getComputedStyle
            : { color: colorVar[color], textShadow: neonShadow },
        },
        text,
      )}
      {active && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        />
      )}
    </div>
  );
}

export { GlitchText, type GlitchTextProps, type GlitchColor };
```

- [ ] **Step 2: Verify it type-checks and builds**

Run: `pnpm build`
Expected: build succeeds (component compiles, Pretext imports resolve). If the build flags `ctx.letterSpacing`, confirm the `@ts-expect-error` line is directly above it.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: no errors in `components/ui/glitch-text.tsx`.

- [ ] **Step 4: Commit**

```bash
git add components/ui/glitch-text.tsx
git commit -m "feat(glitch): Pretext-powered canvas GlitchText headline"
```

---

## Task 7: `GlitchController` — central burst orchestrator

One client component, mounted once. Tracks every `[data-glitch]` element, keeps a live set of on-screen ones via IntersectionObserver, and pulses a random few with the `.glitch-burst` class on a random cadence. Also fires a one-shot burst when an element first enters view. No-ops entirely under reduced motion.

**Files:**
- Create: `components/ui/glitch-controller.tsx`

- [ ] **Step 1: Write the component**

`components/ui/glitch-controller.tsx`:
```tsx
"use client";

import * as React from "react";
import { pickRandom } from "@/lib/glitch/viewport";
import { prefersReducedMotion } from "@/lib/glitch/reduced-motion";

const BURST_CLASS = "glitch-burst";
const BURST_MS = 360;

function burst(el: Element) {
  if (el.classList.contains(BURST_CLASS)) return;
  el.classList.add(BURST_CLASS);
  window.setTimeout(() => el.classList.remove(BURST_CLASS), BURST_MS);
}

/**
 * Drives ambient glitch bursts across all `[data-glitch]` elements.
 * Mount once near the page root. Renders nothing.
 */
function GlitchController() {
  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-glitch]"));
    if (elements.length === 0) return;

    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible.add(e.target);
            burst(e.target); // one-shot on entry
          } else {
            visible.delete(e.target);
          }
        }
      },
      { threshold: 0 },
    );
    elements.forEach((el) => io.observe(el));

    let timer = 0;
    const tick = () => {
      const pool = Array.from(visible);
      if (pool.length > 0) {
        const count = 1 + Math.floor(Math.random() * 2); // 1–2 at a time
        for (const el of pickRandom(pool, count, Math.random)) burst(el);
      }
      timer = window.setTimeout(tick, 1200 + Math.random() * 2200);
    };
    timer = window.setTimeout(tick, 1500);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}

export { GlitchController };
```

- [ ] **Step 2: Build + lint**

Run: `pnpm build && pnpm lint`
Expected: both pass; no errors in `glitch-controller.tsx`.

- [ ] **Step 3: Commit**

```bash
git add components/ui/glitch-controller.tsx
git commit -m "feat(glitch): central data-glitch burst orchestrator"
```

---

## Task 8: Enhance `GlitchWrapper` (data-glitch passthrough; rename inline GlitchText)

Add an opt-in `data-glitch` to `GlitchWrapper`, and rename the existing inline `GlitchText` export to `GlitchTextInline` so it doesn't collide with the new flagship `GlitchText`.

**Files:**
- Modify: `components/ui/glitch-wrapper.tsx`

- [ ] **Step 1: Check for existing importers of the old `GlitchText`**

Run: `grep -rn "GlitchText" components/ app/ --include="*.tsx" | grep -v "glitch-text.tsx"`
Expected: a list (possibly empty) of files importing `GlitchText` from `glitch-wrapper`. Note them for Step 4.

- [ ] **Step 2: Add `dataGlitch` to `GlitchWrapper`**

In `components/ui/glitch-wrapper.tsx`, add `dataGlitch?: boolean;` to `GlitchWrapperProps` (after `flicker`):
```tsx
  /** Enable flicker effect */
  flicker?: boolean;
  /** Register this element with the GlitchController for ambient bursts */
  dataGlitch?: boolean;
```

Update the function signature default and the rendered `<div>` to pass the attribute. Replace the destructure line `flicker = false,` block and the returned `<div>`:
```tsx
function GlitchWrapper({
  children,
  className,
  intensity = "normal",
  trigger = "always",
  delayVariant,
  chromatic = false,
  flicker = false,
  dataGlitch = false,
}: GlitchWrapperProps) {
```
And add the attribute to the `<div>` (after the `className` prop):
```tsx
    <div
      data-glitch={dataGlitch ? "" : undefined}
      className={cn(
        "relative",
        glitchClass,
        delayClass,
        chromatic && "chromatic-glitch",
        flicker && "flicker",
        className
      )}
    >
      {children}
    </div>
```

- [ ] **Step 3: Rename the inline `GlitchText` to `GlitchTextInline`**

In the same file, rename the function `GlitchText` → `GlitchTextInline` and rename `GlitchTextProps` → `GlitchTextInlineProps`. Update the `export { ... }` block at the bottom:
```tsx
export {
  GlitchWrapper,
  GlitchTextInline,
  useRandomGlitch,
  type GlitchWrapperProps,
  type GlitchTextInlineProps,
  type GlitchIntensity,
  type GlitchTrigger,
};
```

- [ ] **Step 4: Update any importers found in Step 1**

For each file that imported `GlitchText`/`GlitchTextProps` from `@/components/ui/glitch-wrapper`, change the identifier to `GlitchTextInline`/`GlitchTextInlineProps`. (If Step 1 found none, skip.)

- [ ] **Step 5: Build + lint**

Run: `pnpm build && pnpm lint`
Expected: both pass — no unresolved `GlitchText` references from `glitch-wrapper`.

- [ ] **Step 6: Commit**

```bash
git add components/ui/glitch-wrapper.tsx
git commit -m "feat(glitch): data-glitch passthrough; rename inline GlitchText"
```

---

## Task 9: CSS — `.glitch-burst` primitive, retune ambient, reduced-motion kill-switch

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add the `.glitch-burst` primitive**

Append after the existing `.glitch-delay-*` block (around line 557 in `app/globals.css`):
```css
/* =================================
   ORCHESTRATED BURST (any element)
   ================================= */

@keyframes glitch-burst-anim {
  0% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
    text-shadow: none;
    filter: none;
  }
  20% {
    transform: translate(-2px, 1px);
    clip-path: inset(20% 0 40% 0);
    text-shadow: 2px 0 var(--neon-cyan), -2px 0 var(--neon-red);
    filter: brightness(1.15);
  }
  40% {
    transform: translate(2px, -1px);
    clip-path: inset(58% 0 12% 0);
    text-shadow: -3px 0 var(--neon-magenta), 3px 0 var(--neon-electric);
  }
  60% {
    transform: translate(-1px, 0);
    clip-path: inset(34% 0 36% 0);
    text-shadow: 2px 0 var(--neon-cyan), -2px 0 var(--neon-red);
  }
  80% {
    transform: translate(1px, 1px);
    clip-path: inset(8% 0 62% 0);
    text-shadow: none;
  }
  100% {
    transform: translate(0);
    clip-path: inset(0 0 0 0);
    text-shadow: none;
    filter: none;
  }
}

/* Transient class toggled by GlitchController on [data-glitch] elements. */
.glitch-burst {
  animation: glitch-burst-anim 0.36s ease-in-out;
  will-change: transform, clip-path, filter;
}

/* Gentle always-on hint so [data-glitch] elements feel "live" between bursts. */
[data-glitch] {
  position: relative;
}
```

- [ ] **Step 2: Retune the ambient always-on glitch so it actually shows**

In `app/globals.css`, change the `.glitch-random` rule (currently `glitch-intense 8s infinite, flicker 12s infinite`) to fire more frequently:
```css
.glitch-random {
  animation:
    glitch-intense 4s infinite,
    flicker 9s infinite;
}
```
(Leave `.glitch-subtle` and `.glitch-heavy` as-is.)

- [ ] **Step 3: Add the reduced-motion kill-switch**

Append at the very end of `app/globals.css`:
```css
/* =================================
   ACCESSIBILITY: REDUCED MOTION
   ================================= */
@media (prefers-reduced-motion: reduce) {
  .glitch-random,
  .glitch-subtle,
  .glitch-heavy,
  .glitch-on-hover:hover,
  .chromatic-glitch,
  .flicker,
  .glitch-burst {
    animation: none !important;
    text-shadow: none !important;
    filter: none !important;
    clip-path: none !important;
    transform: none !important;
  }
}
```

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: build succeeds; CSS compiles with no syntax errors.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat(glitch): glitch-burst primitive, retuned ambient, reduced-motion kill-switch"
```

---

## Task 10: Wire glitch across the page

Mount the controller, upgrade the hero name to the flagship `GlitchText` with decode, convert section headings to `GlitchText`, and sprinkle `data-glitch` on cards/badges/links.

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/sections/hero.tsx`
- Modify: `components/sections/about.tsx`, `projects.tsx`, `timeline.tsx`, `skills.tsx`, `education.tsx`, `contact.tsx`

- [ ] **Step 1: Mount `GlitchController` in `app/page.tsx`**

Import and render it once (it renders `null`, so placement is not visually significant — put it at the top of the page fragment):
```tsx
import { GlitchController } from "@/components/ui/glitch-controller";
```
Add `<GlitchController />` as the first child inside the page's root wrapper.

- [ ] **Step 2: Hero name → `GlitchText` with decode**

In `components/sections/hero.tsx`:
- Add import: `import { GlitchText } from "@/components/ui/glitch-text";`
- Replace the `GlitchWrapper` + `NeonText` h1 block (the one wrapping `{personalInfo.name}`, around lines 254–274) with:
```tsx
          <motion.div variants={itemVariants}>
            <GlitchText
              as="h1"
              text={personalInfo.name}
              color="cyan"
              decode
              className="block max-w-5xl text-5xl font-black uppercase tracking-[-0.08em] sm:text-7xl md:text-8xl lg:text-9xl"
            />
          </motion.div>
```
- Remove the now-unused `isInitialGlitching` state and its two `useEffect` timers (the decode replaces that intro effect). Remove the `NeonText` import if it is no longer referenced anywhere else in the file (check first).

- [ ] **Step 3: Add `data-glitch` to hero ambient elements**

In `components/sections/hero.tsx`, add `data-glitch` to:
- the "System online" badge `motion.div` (around line 246),
- each `HeroStat` outer `div` (in the `HeroStat` component, add `data-glitch` to its root `div`),
- the stat tiles inside `TerminalPanel` (the `.map((stat) => ...)` root `div`),
- each `HeroLink` `motion.a` (add `data-glitch` attribute to the `motion.a`).

Example for `HeroStat`:
```tsx
function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div
      data-glitch=""
      className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-md"
    >
```

- [ ] **Step 4: Convert each section heading to `GlitchText`**

For each of `about.tsx`, `projects.tsx`, `timeline.tsx`, `skills.tsx`, `education.tsx`, `contact.tsx`:
1. Read the file and locate the main section title (the primary `<h2>`, often rendered via `NeonText` or a styled heading).
2. Add `import { GlitchText } from "@/components/ui/glitch-text";`.
3. Replace the heading element with `GlitchText`, preserving the existing typography classes in `className` and the heading's text in `text`. Choose `color` to match the section's existing accent (default `cyan`). Example pattern:
```tsx
// before:
// <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">About</h2>
// after:
<GlitchText
  as="h2"
  text="About"
  color="cyan"
  className="block text-4xl font-black uppercase tracking-tight sm:text-5xl"
/>
```
Keep the surrounding layout wrappers unchanged. Use `decode` only on the hero (Step 2), not section headings, to avoid overuse.

- [ ] **Step 5: Add `data-glitch` to section cards/badges**

In each section file, add `data-glitch=""` to the repeated card/badge/list-item root elements (e.g. project cards in `projects.tsx`, skill rows/badges in `skills.tsx`, timeline items in `timeline.tsx`/`timeline-item.tsx`, education cards in `education.tsx`, contact links in `contact.tsx`). One attribute per repeated root element. Do not add it to large section containers — target the small repeated items so bursts read as discrete glitches.

- [ ] **Step 6: Build + lint**

Run: `pnpm build && pnpm lint`
Expected: both pass; no unused-import or unresolved-reference errors. If `NeonText` became unused in any file, remove its import.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx components/sections
git commit -m "feat(glitch): wire GlitchText headings, decode hero, data-glitch ambient"
```

---

## Task 11: Final verification (build, lint, tests, browser, reduced-motion)

**Files:** none (verification only).

- [ ] **Step 1: Full test + lint + build gate**

Run: `pnpm test && pnpm lint && pnpm build`
Expected: tests green, lint clean, build succeeds.

- [ ] **Step 2: Visual check via the dev server + Playwright**

Start the dev server (`pnpm dev`) and use the `playwright-skill` (or chrome-devtools MCP) to:
1. Load `http://localhost:3000`.
2. Screenshot the hero — confirm the name scramble-decodes on load and shows RGB-split glitch.
3. Scroll to each section — confirm headings render as glitching canvas text and cards/badges burst as they enter view.
4. Hover elements — confirm hover bursts.
5. Check the browser console — expect **no errors** (no Pretext/canvas/hydration warnings).

- [ ] **Step 3: Reduced-motion check**

Emulate `prefers-reduced-motion: reduce` (Playwright `browser_emulate`/`emulateMedia`, or DevTools Rendering tab) and reload. Confirm:
- Headings render as clean static neon text (no canvas animation).
- No ambient bursts fire.
- Text is fully legible and selectable.

- [ ] **Step 4: SEO/a11y spot-check**

In the page DOM, confirm each `GlitchText` heading's real text is present in the DOM (e.g. the `<h1>`/`<h2>` contains the literal string), and the canvas is `aria-hidden`.

- [ ] **Step 5: Final commit (if any cleanups were needed)**

```bash
git add -A
git commit -m "chore(glitch): final verification cleanups"
```

---

## Self-Review Notes (author)

- **Spec coverage:** Reactive layers → Tasks 7+9+10 (orchestrator + `.glitch-burst` + wiring). Canvas glitch renderer via Pretext → Task 6. RGB split + slice + scramble → Task 6 (paint loop) and Task 2 (scramble). Reduced motion → Tasks 5, 6, 7, 9 (all three layers). SEO/a11y text retention → Task 6 + Task 11 Step 4. `ScanLines` untouched (left as-is, per spec).
- **Type consistency:** `computeScrambledText(target, progress, seed)` signature identical across Task 2 and Task 6. `pickRandom(items, count, rng)` identical across Task 4 and Task 7. `prefersReducedMotion()` identical across Tasks 5/6/7. `.glitch-burst` / `BURST_CLASS` string matches between Task 7 (`"glitch-burst"`) and Task 9 CSS.
- **Known refinement vs spec:** the spec listed an explicit `font`/`lineHeight` prop on `GlitchText`; the implementation instead auto-derives font metrics from the rendered DOM heading via `getComputedStyle` (read only on resize, never per-frame). This is strictly more robust for the responsive Tailwind sizes (`text-5xl … lg:text-9xl`) and keeps canvas perfectly in sync with CSS. Documented here intentionally.
- **Caveat honored:** Pretext warns `system-ui` is inaccurate — the site's headings use a named font stack (Inter), and the canvas font is read from the real element, so whatever font actually renders is what Pretext measures.
