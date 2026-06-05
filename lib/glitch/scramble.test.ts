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
