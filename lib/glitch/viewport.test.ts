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
