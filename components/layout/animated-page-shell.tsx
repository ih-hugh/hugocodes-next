"use client";

import * as React from "react";
import { WebGLBackground } from "@/components/visuals/webgl-background";

interface AnimatedPageShellProps {
  children: React.ReactNode;
}

function AnimatedPageShell({ children }: AnimatedPageShellProps) {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[var(--cyber-dark)] text-foreground">
      <WebGLBackground />
      <div
        className="fixed inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(5,5,8,0.12)_42%,rgba(5,5,8,0.72)_100%)]"
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </main>
  );
}

export { AnimatedPageShell };
