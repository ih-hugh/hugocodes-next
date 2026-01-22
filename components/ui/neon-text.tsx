"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const neonColors = {
  cyan: {
    color: "var(--neon-cyan)",
    shadow: "var(--neon-cyan)",
  },
  magenta: {
    color: "var(--neon-magenta)",
    shadow: "var(--neon-magenta)",
  },
  purple: {
    color: "var(--neon-purple)",
    shadow: "var(--neon-purple)",
  },
  green: {
    color: "var(--neon-green)",
    shadow: "var(--neon-green)",
  },
  orange: {
    color: "var(--neon-orange)",
    shadow: "var(--neon-orange)",
  },
  ice: {
    color: "var(--neon-ice)",
    shadow: "var(--neon-ice)",
  },
  electric: {
    color: "var(--neon-electric)",
    shadow: "var(--neon-electric)",
  },
  red: {
    color: "var(--neon-red)",
    shadow: "var(--neon-red)",
  },
} as const;

type NeonColor = keyof typeof neonColors;
type NeonElement = "h1" | "h2" | "h3" | "p" | "span";

interface NeonTextProps {
  children: React.ReactNode;
  color?: NeonColor;
  className?: string;
  as?: NeonElement;
  /** Enable or disable the glow pulse animation */
  animate?: boolean;
  /** Intensity of the glow (affects spread of text-shadow) */
  intensity?: "subtle" | "normal" | "intense";
}

function NeonText({
  children,
  color = "cyan",
  className,
  as: Component = "span",
  animate = true,
  intensity = "normal",
}: NeonTextProps) {
  const colorConfig = neonColors[color];

  const glowIntensity = {
    subtle: {
      textShadow: `
        0 0 5px ${colorConfig.shadow},
        0 0 10px ${colorConfig.shadow}
      `,
    },
    normal: {
      textShadow: `
        0 0 5px ${colorConfig.shadow},
        0 0 10px ${colorConfig.shadow},
        0 0 20px ${colorConfig.shadow},
        0 0 40px ${colorConfig.shadow}
      `,
    },
    intense: {
      textShadow: `
        0 0 5px ${colorConfig.shadow},
        0 0 10px ${colorConfig.shadow},
        0 0 20px ${colorConfig.shadow},
        0 0 40px ${colorConfig.shadow},
        0 0 80px ${colorConfig.shadow}
      `,
    },
  };

  return (
    <Component
      className={cn(
        animate && "animate-[glow-pulse_2s_ease-in-out_infinite]",
        className
      )}
      style={{
        color: colorConfig.color,
        ...glowIntensity[intensity],
      }}
    >
      {children}
    </Component>
  );
}

export { NeonText, type NeonTextProps, type NeonColor };
