"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { CircuitBoardCard } from "@/components/ui/circuit-board";

interface TimelineJob {
  company: string;
  title: string;
  dates: string;
  description: string | string[];
  isCurrent?: boolean;
}

interface TimelineItemProps {
  job: TimelineJob;
  index: number;
  className?: string;
  /** Color for the timeline dot and accent */
  color?: "cyan" | "magenta" | "purple" | "green" | "ice" | "electric" | "red";
}

const colorMap = {
  cyan: {
    dot: "bg-[var(--neon-cyan)]",
    glow: "shadow-[0_0_10px_var(--neon-cyan),0_0_20px_var(--neon-cyan)]",
    line: "bg-[var(--neon-cyan)]/30",
    accent: "border-[var(--neon-cyan)]/50",
  },
  magenta: {
    dot: "bg-[var(--neon-magenta)]",
    glow: "shadow-[0_0_10px_var(--neon-magenta),0_0_20px_var(--neon-magenta)]",
    line: "bg-[var(--neon-magenta)]/30",
    accent: "border-[var(--neon-magenta)]/50",
  },
  purple: {
    dot: "bg-[var(--neon-purple)]",
    glow: "shadow-[0_0_10px_var(--neon-purple),0_0_20px_var(--neon-purple)]",
    line: "bg-[var(--neon-purple)]/30",
    accent: "border-[var(--neon-purple)]/50",
  },
  green: {
    dot: "bg-[var(--neon-green)]",
    glow: "shadow-[0_0_10px_var(--neon-green),0_0_20px_var(--neon-green)]",
    line: "bg-[var(--neon-green)]/30",
    accent: "border-[var(--neon-green)]/50",
  },
  ice: {
    dot: "bg-[var(--neon-ice)]",
    glow: "shadow-[0_0_10px_var(--neon-ice),0_0_20px_var(--neon-ice)]",
    line: "bg-[var(--neon-ice)]/30",
    accent: "border-[var(--neon-ice)]/50",
  },
  electric: {
    dot: "bg-[var(--neon-electric)]",
    glow: "shadow-[0_0_10px_var(--neon-electric),0_0_20px_var(--neon-electric)]",
    line: "bg-[var(--neon-electric)]/30",
    accent: "border-[var(--neon-electric)]/50",
  },
  red: {
    dot: "bg-[var(--neon-red)]",
    glow: "shadow-[0_0_10px_var(--neon-red),0_0_20px_var(--neon-red)]",
    line: "bg-[var(--neon-red)]/30",
    accent: "border-[var(--neon-red)]/50",
  },
};

function TimelineItem({
  job,
  index,
  className,
  color = "cyan",
}: TimelineItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const colors = colorMap[color];

  const descriptions = Array.isArray(job.description)
    ? job.description
    : [job.description];

  return (
    <motion.div
      ref={ref}
      className={cn("relative flex gap-6 pb-8 last:pb-0", className)}
      initial={{ opacity: 0, x: -50 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Timeline line and dot */}
      <div className="flex flex-col items-center">
        {/* Pulsing neon dot */}
        <motion.div
          className={cn(
            "relative z-10 size-4 rounded-full",
            colors.dot,
            colors.glow
          )}
          animate={
            job.isCurrent
              ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.8, 1],
                }
              : undefined
          }
          transition={
            job.isCurrent
              ? {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : undefined
          }
        >
          {job.isCurrent && (
            <span
              className={cn(
                "absolute inset-0 rounded-full animate-ping",
                colors.dot,
                "opacity-75"
              )}
            />
          )}
        </motion.div>

        {/* Connecting line */}
        <div className={cn("w-0.5 flex-1 mt-2", colors.line)} />
      </div>

      {/* Content card with glitch hover and circuit board background */}
      <div
        className={cn(
          "flex-1 rounded-lg p-5 glitch-on-hover relative overflow-hidden",
          "bg-[var(--cyber-dark)]/60 dark:bg-[var(--cyber-dark)]/80",
          "backdrop-blur-sm",
          "border-l-2",
          colors.accent
        )}
      >
        {/* Circuit board background for card */}
        <CircuitBoardCard
          color={color === "purple" || color === "ice" ? "cyan" : color === "magenta" || color === "red" ? "magenta" : "electric"}
          className="z-0"
        />

        {/* Card content - higher z-index to be above circuit board */}
        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {job.title}
              </h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            <div className="flex items-center gap-2">
              {job.isCurrent && (
                <span
                  className={cn(
                    "px-2 py-0.5 text-xs font-medium rounded-full",
                    "bg-[var(--neon-green)]/20 text-[var(--neon-green)]"
                  )}
                >
                  Current
                </span>
              )}
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {job.dates}
              </span>
            </div>
          </div>

          <ul className="space-y-1.5">
            {descriptions.map((desc, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {descriptions.length > 1 && (
                  <span className="text-muted-foreground/60 mr-2">-</span>
                )}
                {desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export { TimelineItem, type TimelineItemProps, type TimelineJob };
