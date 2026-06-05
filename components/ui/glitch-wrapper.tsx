"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type GlitchIntensity = "subtle" | "normal" | "heavy";
type GlitchTrigger = "always" | "hover" | "random";

interface GlitchWrapperProps {
  children: React.ReactNode;
  className?: string;
  /** Intensity of the glitch effect */
  intensity?: GlitchIntensity;
  /** When to trigger the glitch */
  trigger?: GlitchTrigger;
  /** Random delay variant (1-5) for organic feel */
  delayVariant?: 1 | 2 | 3 | 4 | 5;
  /** Enable chromatic aberration effect */
  chromatic?: boolean;
  /** Enable flicker effect */
  flicker?: boolean;
  /** Register this element with the GlitchController for ambient bursts */
  dataGlitch?: boolean;
}

const intensityClasses: Record<GlitchIntensity, string> = {
  subtle: "glitch-subtle",
  normal: "glitch-random",
  heavy: "glitch-heavy",
};

function GlitchWrapper({
  children,
  className,
  intensity = "normal",
  trigger = "always",
  delayVariant,
  chromatic = false,
  flicker = false,
  dataGlitch = false,
}: GlitchWrapperProps) {
  const [randomGlitch, setRandomGlitch] = React.useState(false);

  // Random glitch effect for "random" trigger
  React.useEffect(() => {
    if (trigger !== "random") return;

    const triggerRandomGlitch = () => {
      setRandomGlitch(true);
      setTimeout(() => setRandomGlitch(false), 500 + Math.random() * 500);
    };

    // Random interval between 3-10 seconds
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 7000;
      return setTimeout(() => {
        triggerRandomGlitch();
        scheduleNext();
      }, delay);
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [trigger]);

  const glitchClass = trigger === "hover"
    ? "glitch-on-hover"
    : trigger === "random" && randomGlitch
    ? intensityClasses[intensity]
    : trigger === "always"
    ? intensityClasses[intensity]
    : "";

  const delayClass = delayVariant ? `glitch-delay-${delayVariant}` : "";

  return (
    <div
      data-glitch={dataGlitch ? "" : undefined}
      className={cn(
        "relative",
        glitchClass,
        delayClass,
        chromatic && "chromatic-glitch",
        flicker && "flicker",
        className
      )}
    >
      {children}
    </div>
  );
}

// Glitch text component for inline text glitch effects
interface GlitchTextInlineProps {
  children: React.ReactNode;
  className?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4" | "div";
  intensity?: GlitchIntensity;
  /** Data text for pseudo-element glitch layers */
  dataText?: string;
}

function GlitchTextInline({
  children,
  className,
  as: Component = "span",
  intensity = "normal",
  dataText,
}: GlitchTextInlineProps) {
  const text = typeof children === "string" ? children : dataText;

  return (
    <Component
      className={cn(
        "relative inline-block",
        intensity === "subtle" && "glitch-subtle",
        intensity === "normal" && "glitch-random",
        intensity === "heavy" && "glitch-heavy",
        className
      )}
      data-text={text}
    >
      {children}
    </Component>
  );
}

// Export a hook for programmatic glitch control
function useRandomGlitch(baseInterval = 5000, variance = 3000) {
  const [isGlitching, setIsGlitching] = React.useState(false);

  React.useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 300 + Math.random() * 400);
    };

    const scheduleNext = () => {
      const delay = baseInterval + Math.random() * variance;
      return setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };

    const timeout = scheduleNext();
    return () => clearTimeout(timeout);
  }, [baseInterval, variance]);

  return isGlitching;
}

export {
  GlitchWrapper,
  GlitchTextInline,
  useRandomGlitch,
  type GlitchWrapperProps,
  type GlitchTextInlineProps,
  type GlitchIntensity,
  type GlitchTrigger,
};
