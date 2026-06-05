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
