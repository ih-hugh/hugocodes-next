"use client";

import * as React from "react";
import { pickRandom } from "@/lib/glitch/viewport";
import { prefersReducedMotion } from "@/lib/glitch/reduced-motion";

const BURST_CLASS = "glitch-burst";
const BURST_MS = 360;

function burst(el: Element) {
  if (el.classList.contains(BURST_CLASS)) return;
  el.classList.add(BURST_CLASS);
  window.setTimeout(() => el.classList.remove(BURST_CLASS), BURST_MS);
}

/**
 * Drives ambient glitch bursts across all `[data-glitch]` elements.
 * Mount once near the page root. Renders nothing.
 */
function GlitchController() {
  React.useEffect(() => {
    if (prefersReducedMotion()) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-glitch]"));
    if (elements.length === 0) return;

    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible.add(e.target);
            burst(e.target); // one-shot on entry
          } else {
            visible.delete(e.target);
          }
        }
      },
      { threshold: 0 },
    );
    elements.forEach((el) => io.observe(el));

    let timer = 0;
    const tick = () => {
      const pool = Array.from(visible);
      if (pool.length > 0) {
        const count = 1 + Math.floor(Math.random() * 2); // 1–2 at a time
        for (const el of pickRandom(pool, count, Math.random)) burst(el);
      }
      timer = window.setTimeout(tick, 2200 + Math.random() * 3000);
    };
    timer = window.setTimeout(tick, 2500);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}

export { GlitchController };
