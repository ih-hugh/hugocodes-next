"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CircuitBoardProps {
  className?: string;
  /** Base opacity of the circuit lines */
  opacity?: number;
  /** Color of the circuit lines */
  color?: "cyan" | "magenta" | "electric";
  /** Whether to show the animated electricity */
  animated?: boolean;
  /** Whether this is for a card (smaller scale) */
  isCard?: boolean;
}

// Custom hook to track scroll progress (0 to 1)
function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? currentScrollY / docHeight : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
      setScrollY(currentScrollY);
    };

    handleScroll(); // Initial call
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollProgress, scrollY };
}

// Hook to track scroll direction
function useScrollDirection() {
  const [scrollY, setScrollY] = React.useState(0);
  const [direction, setDirection] = React.useState<"down" | "up">("down");
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      lastScrollY.current = currentScrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, direction };
}

// Calculate which "section" we're in based on scroll for alternating directions
function useAlternatingDirection() {
  const { scrollY } = useScrollDirection();
  const [flowDirection, setFlowDirection] = React.useState<"left" | "right">("right");

  React.useEffect(() => {
    // Change direction every ~400px of scroll
    const section = Math.floor(scrollY / 400);
    setFlowDirection(section % 2 === 0 ? "right" : "left");
  }, [scrollY]);

  return flowDirection;
}

function CircuitBoard({
  className,
  opacity = 0.15,
  color = "cyan",
  isCard = false,
}: Omit<CircuitBoardProps, "animated">) {
  const colorMap = {
    cyan: {
      line: "var(--neon-cyan)",
      glow: "rgba(0, 255, 255, 0.6)",
      dim: "rgba(0, 255, 255, 0.1)",
    },
    magenta: {
      line: "var(--neon-magenta)",
      glow: "rgba(255, 0, 128, 0.6)",
      dim: "rgba(255, 0, 128, 0.1)",
    },
    electric: {
      line: "var(--neon-electric)",
      glow: "rgba(100, 150, 255, 0.6)",
      dim: "rgba(100, 150, 255, 0.1)",
    },
  };

  const colors = colorMap[color];
  const scale = isCard ? 0.5 : 1;

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      {/* Static circuit pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity }}
      >
        <defs>
          {/* Glow filter */}
          <filter id="circuit-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Pattern for repeating circuit */}
          <pattern
            id="circuit-pattern"
            x="0"
            y="0"
            width={200 * scale}
            height={200 * scale}
            patternUnits="userSpaceOnUse"
          >
            {/* Horizontal lines */}
            <line
              x1="0"
              y1={20 * scale}
              x2={200 * scale}
              y2={20 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />
            <line
              x1="0"
              y1={80 * scale}
              x2={200 * scale}
              y2={80 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />
            <line
              x1="0"
              y1={140 * scale}
              x2={200 * scale}
              y2={140 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />

            {/* Vertical lines */}
            <line
              x1={40 * scale}
              y1="0"
              x2={40 * scale}
              y2={200 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />
            <line
              x1={100 * scale}
              y1="0"
              x2={100 * scale}
              y2={200 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />
            <line
              x1={160 * scale}
              y1="0"
              x2={160 * scale}
              y2={200 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />

            {/* Connection nodes */}
            <circle cx={40 * scale} cy={20 * scale} r={3 * scale} fill={colors.dim} />
            <circle cx={100 * scale} cy={20 * scale} r={3 * scale} fill={colors.dim} />
            <circle cx={160 * scale} cy={20 * scale} r={3 * scale} fill={colors.dim} />
            <circle cx={40 * scale} cy={80 * scale} r={3 * scale} fill={colors.dim} />
            <circle cx={100 * scale} cy={80 * scale} r={4 * scale} fill={colors.dim} />
            <circle cx={160 * scale} cy={80 * scale} r={3 * scale} fill={colors.dim} />
            <circle cx={40 * scale} cy={140 * scale} r={3 * scale} fill={colors.dim} />
            <circle cx={100 * scale} cy={140 * scale} r={3 * scale} fill={colors.dim} />
            <circle cx={160 * scale} cy={140 * scale} r={3 * scale} fill={colors.dim} />

            {/* Diagonal connectors */}
            <line
              x1={40 * scale}
              y1={20 * scale}
              x2={100 * scale}
              y2={80 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />
            <line
              x1={160 * scale}
              y1={20 * scale}
              x2={100 * scale}
              y2={80 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />
            <line
              x1={40 * scale}
              y1={140 * scale}
              x2={100 * scale}
              y2={80 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />
            <line
              x1={160 * scale}
              y1={140 * scale}
              x2={100 * scale}
              y2={80 * scale}
              stroke={colors.dim}
              strokeWidth={1}
            />

            {/* Small IC chip representations */}
            <rect
              x={85 * scale}
              y={65 * scale}
              width={30 * scale}
              height={30 * scale}
              fill="none"
              stroke={colors.dim}
              strokeWidth={1}
              rx={2}
            />
          </pattern>
        </defs>

        {/* Base circuit pattern */}
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>
  );
}

// Smaller version for cards/experience items
function CircuitBoardCard({
  className,
  color = "cyan",
}: {
  className?: string;
  color?: "cyan" | "magenta" | "electric";
}) {
  return (
    <CircuitBoard
      className={className}
      opacity={0.08}
      color={color}
      isCard={true}
    />
  );
}

export { CircuitBoard, CircuitBoardCard, useScrollDirection, useAlternatingDirection, useScrollProgress };
