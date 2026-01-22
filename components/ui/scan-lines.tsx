"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ScanLinesProps {
  className?: string;
  /** Opacity of the scan lines (0-1) */
  opacity?: number;
  /** Speed of the scan line animation in seconds */
  speed?: number;
  /** Whether to show the moving scan line */
  animated?: boolean;
  /** Whether to show the static horizontal lines overlay */
  staticLines?: boolean;
  /** Spacing between static lines in pixels */
  lineSpacing?: number;
}

function ScanLines({
  className,
  opacity = 0.03,
  speed = 8,
  animated = true,
  staticLines = true,
  lineSpacing = 4,
}: ScanLinesProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden z-10",
        className
      )}
      aria-hidden="true"
    >
      {/* Static horizontal scan lines */}
      {staticLines && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent ${lineSpacing - 1}px,
              rgba(255, 255, 255, ${opacity}) ${lineSpacing - 1}px,
              rgba(255, 255, 255, ${opacity}) ${lineSpacing}px
            )`,
          }}
        />
      )}

      {/* Animated moving scan line */}
      {animated && (
        <div
          className="absolute left-0 right-0 h-1"
          style={{
            background: `linear-gradient(
              to bottom,
              transparent,
              rgba(255, 255, 255, ${opacity * 3}),
              transparent
            )`,
            animation: `scan-line ${speed}s linear infinite`,
          }}
        />
      )}
    </div>
  );
}

// A simpler version that uses the CSS class from globals.css
function ScanLinesSimple({ className }: { className?: string }) {
  return (
    <div
      className={cn("scan-lines absolute inset-0 pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}

// CRT flicker effect overlay
interface CRTFlickerProps {
  className?: string;
  intensity?: "subtle" | "normal" | "heavy";
}

function CRTFlicker({ className, intensity = "subtle" }: CRTFlickerProps) {
  const opacityMap = {
    subtle: 0.02,
    normal: 0.04,
    heavy: 0.08,
  };

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none z-10",
        className
      )}
      style={{
        background: `rgba(0, 0, 0, ${opacityMap[intensity]})`,
        animation: "glow-pulse 0.1s infinite",
      }}
      aria-hidden="true"
    />
  );
}

export {
  ScanLines,
  ScanLinesSimple,
  CRTFlicker,
  type ScanLinesProps,
  type CRTFlickerProps,
};
