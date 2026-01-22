"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface HolographicCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  /** Enable hover scale animation */
  hoverEffect?: boolean;
  /** Border gradient colors - defaults to cyan/magenta/purple */
  borderColors?: string[];
}

function HolographicCard({
  children,
  className,
  hoverEffect = true,
  borderColors,
  ...props
}: HolographicCardProps) {
  const defaultGradient = `linear-gradient(
    90deg,
    var(--neon-cyan),
    var(--neon-magenta),
    var(--neon-purple),
    var(--neon-cyan)
  )`;

  const customGradient = borderColors
    ? `linear-gradient(90deg, ${borderColors.join(", ")})`
    : defaultGradient;

  return (
    <motion.div
      className={cn("relative rounded-lg", className)}
      whileHover={hoverEffect ? { scale: 1.02, y: -4 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {/* Animated holographic border */}
      <div
        className="absolute -inset-[2px] rounded-[calc(var(--radius)+2px)] opacity-75 blur-[1px]"
        style={{
          background: customGradient,
          backgroundSize: "300% 100%",
          animation: "holographic-shift 4s ease-in-out infinite",
        }}
      />

      {/* Inner container with frosted glass effect */}
      <div
        className={cn(
          "relative rounded-lg p-6",
          "bg-[var(--cyber-dark)]/80 dark:bg-[var(--cyber-dark)]/90",
          "backdrop-blur-xl",
          "border border-white/10"
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

export { HolographicCard, type HolographicCardProps };
