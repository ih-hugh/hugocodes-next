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
