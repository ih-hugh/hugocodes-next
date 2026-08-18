"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";
import { WebGLBackground } from "@/components/visuals/webgl-background";
import { ScanIntroOverlay } from "@/components/visuals/scan-intro-overlay";
import { IntroProvider, useIntro } from "@/components/motion/intro-context";
import { cn } from "@/lib/utils";

interface AnimatedPageShellProps {
  children: React.ReactNode;
}

function IntroGatedContent({ children }: { children: React.ReactNode }) {
  const { introDone } = useIntro();

  return (
    <div
      className={cn(
        "relative z-10 transition-opacity duration-700",
        introDone ? "opacity-100" : "opacity-0"
      )}
    >
      {children}
    </div>
  );
}

function AnimatedPageShell({ children }: AnimatedPageShellProps) {
  return (
    <IntroProvider>
      <MotionConfig reducedMotion="user">
        <main className="relative min-h-screen overflow-x-hidden bg-[var(--cyber-dark)] text-foreground">
        <WebGLBackground />
        <div
          className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(5,5,8,0.12)_42%,rgba(5,5,8,0.72)_100%)]"
          aria-hidden="true"
        />
          <IntroGatedContent>{children}</IntroGatedContent>
          <ScanIntroOverlay />
        </main>
      </MotionConfig>
    </IntroProvider>
  );
}

export { AnimatedPageShell };
