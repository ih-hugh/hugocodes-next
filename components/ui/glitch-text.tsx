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

  // Decide once on mount whether to run the canvas effect. Flipping `active`
  // mounts the <canvas>; the animation effect below then picks up its ref.
  // Reduced-motion users keep the static neon DOM heading (no canvas).
  React.useEffect(() => {
    if (!prefersReducedMotion()) setActive(true);
  }, []);

  React.useEffect(() => {
    if (!active) return; // canvas only exists in the DOM once active is true
    const container = containerRef.current;
    const sizer = sizerRef.current;
    const canvas = canvasRef.current;
    if (!container || !sizer || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
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
      // letterSpacing is supported in modern canvas contexts
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
    // re-run when the canvas mounts (active) or the heading content changes.
  }, [active, text, color, decode]);

  const neonShadow = `0 0 6px ${colorVar[color]}, 0 0 14px ${colorVar[color]}, 0 0 28px ${colorVar[color]}`;

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Accessible, selectable, SEO-visible heading. Transparent while canvas paints. */}
      {React.createElement(
        Tag,
        {
          ref: sizerRef,
          className: cn(className),
          // When active, keep `color` set (the canvas reads it via getComputedStyle
          // to resolve the CSS var) but hide the real glyphs with a transparent
          // text fill — leaving the canvas as the only visible layer. The heading
          // text stays in the DOM (selectable, SEO, screen-reader friendly).
          style: active
            ? { color: colorVar[color], WebkitTextFillColor: "transparent" }
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
