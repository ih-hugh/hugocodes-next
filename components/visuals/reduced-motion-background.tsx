"use client";

import { CircuitBoard } from "@/components/ui/circuit-board";
import { cn } from "@/lib/utils";

interface ReducedMotionBackgroundProps {
  className?: string;
}

function ReducedMotionBackground({ className }: ReducedMotionBackgroundProps) {
  return (
    <div
      className={cn("fixed inset-0 z-0 overflow-hidden pointer-events-none", className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[var(--cyber-darker)]" />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background: `
            radial-gradient(circle at 50% 20%, color-mix(in oklch, var(--neon-cyan) 18%, transparent), transparent 34%),
            radial-gradient(circle at 16% 72%, color-mix(in oklch, var(--neon-purple) 16%, transparent), transparent 30%),
            radial-gradient(circle at 86% 64%, color-mix(in oklch, var(--neon-electric) 14%, transparent), transparent 32%)
          `,
        }}
      />
      <CircuitBoard className="absolute inset-0" opacity={0.24} color="cyan" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,8,0.35)_48%,var(--cyber-darker)_100%)]" />
    </div>
  );
}

export { ReducedMotionBackground };
