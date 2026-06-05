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
