import { describe, expect, it } from "vitest";
import { pickRandom } from "./viewport";

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
