"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { ReducedMotionBackground } from "@/components/visuals/reduced-motion-background";
import { hasWebGLSupport, isTouchPhone } from "@/components/visuals/webgl-support";

const WebGLScene = dynamic(
  () => import("@/components/visuals/webgl-scene").then((mod) => mod.WebGLScene),
  {
    ssr: false,
    loading: () => <ReducedMotionBackground />,
  }
);

function WebGLBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [canRenderWebGL, setCanRenderWebGL] = React.useState(false);

  React.useEffect(() => {
    setCanRenderWebGL(
      !prefersReducedMotion && !isTouchPhone() && hasWebGLSupport()
    );
  }, [prefersReducedMotion]);

  if (!canRenderWebGL) {
    return <ReducedMotionBackground />;
  }

  return <WebGLScene />;
}

export { WebGLBackground };
