"use client";

import * as React from "react";
import {
  INTRO_TOTAL_MS,
  SCANNING_MS,
  type IntroPhase,
} from "@/lib/ascent/ascent";
import { hasWebGLSupport, isTouchPhone } from "@/components/visuals/webgl-support";

const STORAGE_KEY = "hugocodes:intro-seen";

interface IntroContextValue {
  phase: IntroPhase;
  introDone: boolean;
  skip: () => void;
}

const IntroContext = React.createContext<IntroContextValue>({
  phase: "live",
  introDone: true,
  skip: () => {},
});

function readIntroSeen() {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Private mode — the intro simply replays next load.
  }
}

function IntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = React.useState<IntroPhase>("scanning");

  const skip = React.useCallback(() => {
    markIntroSeen();
    setPhase("live");
  }, []);

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      readIntroSeen() ||
      prefersReducedMotion ||
      isTouchPhone() ||
      !hasWebGLSupport()
    ) {
      setPhase("live");
      return;
    }

    const revealTimer = setTimeout(() => setPhase("revealing"), SCANNING_MS);
    const liveTimer = setTimeout(() => {
      markIntroSeen();
      setPhase("live");
    }, INTRO_TOTAL_MS);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(liveTimer);
    };
  }, []);

  React.useEffect(() => {
    if (phase === "live") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [phase, skip]);

  const value = React.useMemo(
    () => ({ phase, introDone: phase === "live", skip }),
    [phase, skip]
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

function useIntro() {
  return React.useContext(IntroContext);
}

export { IntroProvider, useIntro };
export type { IntroPhase };
