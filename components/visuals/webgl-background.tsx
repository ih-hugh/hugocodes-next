"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/components/motion/use-prefers-reduced-motion";
import { ReducedMotionBackground } from "@/components/visuals/reduced-motion-background";

const WebGLScene = dynamic(
  () => import("@/components/visuals/webgl-scene").then((mod) => mod.WebGLScene),
  {
    ssr: false,
    loading: () => <ReducedMotionBackground />,
  }
);

function hasWebGLSupport() {
  const canvas = document.createElement("canvas");
  return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
}

function WebGLBackground() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [canRenderWebGL, setCanRenderWebGL] = React.useState(false);

  React.useEffect(() => {
    const isTouchPhone =
      window.matchMedia("(pointer: coarse)").matches &&
      window.matchMedia("(max-width: 767px)").matches;

    setCanRenderWebGL(
      !prefersReducedMotion && !isTouchPhone && hasWebGLSupport()
    );
  }, [prefersReducedMotion]);

  if (!canRenderWebGL) {
    return <ReducedMotionBackground />;
  }

  return <WebGLScene />;
}

export { WebGLBackground };
