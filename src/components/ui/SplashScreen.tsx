"use client";

import { useState, useEffect } from "react";
import { SPLASH_SCREEN } from "@/constants/animation";
import { SplashContent } from "./SplashContent";

type SplashPhase = "pending" | "visible" | "fading" | "hidden";

export function SplashScreen() {
  const [phase, setPhase] = useState<SplashPhase>("pending");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
      prefersReducedMotion ||
      sessionStorage.getItem(SPLASH_SCREEN.sessionKey)
    ) {
      if (prefersReducedMotion) {
        sessionStorage.setItem(SPLASH_SCREEN.sessionKey, "true");
      }
      setPhase("hidden");
      return;
    }

    sessionStorage.setItem(SPLASH_SCREEN.sessionKey, "true");
    setPhase("visible");

    const displayTimer = setTimeout(() => {
      setPhase("fading");
    }, SPLASH_SCREEN.displayDuration);

    const hideTimer = setTimeout(() => {
      setPhase("hidden");
    }, SPLASH_SCREEN.displayDuration + SPLASH_SCREEN.fadeDuration);

    return () => {
      clearTimeout(displayTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (phase === "hidden") {
    return null;
  }

  return (
    <div
      className="splash-overlay"
      data-testid="splash-overlay"
      data-phase={phase}
      aria-hidden="true"
    >
      <SplashContent />
    </div>
  );
}
