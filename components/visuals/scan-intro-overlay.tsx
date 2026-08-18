"use client";

import * as React from "react";
import { INTRO_TOTAL_MS } from "@/lib/ascent/ascent";
import { useIntro } from "@/components/motion/intro-context";
import { cn } from "@/lib/utils";

const HUD_LINES = [
  { at: 150, text: "ODRADEK ARRAY ONLINE" },
  { at: 750, text: "SCANNING STRUCTURE" },
  { at: 1450, text: "MAPPING 7 FLOORS // 7 SHIPPED" },
  { at: 2450, text: "CONNECTION ESTABLISHED" },
] as const;

function CornerBracket({ className }: { className: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute size-10 border-[var(--neon-cyan)]/60 sm:size-14",
        className
      )}
    />
  );
}

function ScanIntroOverlay() {
  const { phase, introDone, skip } = useIntro();
  const [elapsed, setElapsed] = React.useState(0);
  const [mounted, setMounted] = React.useState(true);

  React.useEffect(() => {
    if (introDone) return;

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      setElapsed(now - start);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [introDone]);

  React.useEffect(() => {
    if (!introDone) return;

    const fadeMs = elapsed < 400 ? 220 : 750;
    const timer = setTimeout(() => setMounted(false), fadeMs + 50);
    return () => clearTimeout(timer);
  }, [introDone, elapsed]);

  if (!mounted) return null;

  const skippedInstantly = introDone && elapsed < 400;
  const percent = introDone
    ? 100
    : Math.min(99, Math.floor((elapsed / INTRO_TOTAL_MS) * 100));

  return (
    <div
      role="presentation"
      onClick={skip}
      className={cn(
        "fixed inset-0 z-[60] cursor-pointer select-none font-mono transition-opacity",
        introDone && "pointer-events-none opacity-0",
        skippedInstantly ? "duration-200" : "duration-700"
      )}
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(5,5,8,0.22) 0%, rgba(5,5,8,0.55) 62%, rgba(5,5,8,0.9) 100%)",
      }}
    >
      <CornerBracket className="left-4 top-4 border-l-2 border-t-2 sm:left-8 sm:top-8" />
      <CornerBracket className="right-4 top-4 border-r-2 border-t-2 sm:right-8 sm:top-8" />
      <CornerBracket className="bottom-4 left-4 border-b-2 border-l-2 sm:bottom-8 sm:left-8" />
      <CornerBracket className="bottom-4 right-4 border-b-2 border-r-2 sm:bottom-8 sm:right-8" />

      {phase === "scanning" && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 h-px animate-[intro-sweep_2.4s_linear_forwards] bg-gradient-to-r from-transparent via-[var(--neon-cyan)]/70 to-transparent"
        />
      )}

      <div className="absolute left-5 top-5 space-y-2 text-[11px] uppercase tracking-[0.3em] text-[var(--neon-cyan)]/85 sm:left-10 sm:top-10 sm:text-xs">
        {HUD_LINES.map((line) => {
          const shown = introDone || elapsed >= line.at;
          return (
            <div
              key={line.text}
              className={cn(
                "flex items-center gap-3 transition-opacity duration-300",
                shown ? "opacity-100" : "opacity-0"
              )}
            >
              <span className="text-[var(--neon-orange)]">▸</span>
              <span>{line.text}</span>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center sm:bottom-20">
        <div className="text-4xl font-bold tabular-nums text-[var(--neon-cyan)] [text-shadow:0_0_24px_rgba(0,255,255,0.45)] sm:text-5xl">
          {percent}
          <span className="text-xl sm:text-2xl">%</span>
        </div>
        <div className="mt-2 text-[10px] uppercase tracking-[0.34em] text-white/40">
          chiral density
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/35 sm:bottom-8">
        click or esc to skip
      </div>
    </div>
  );
}

export { ScanIntroOverlay };
