"use client";

import { useEffect, useRef, useState } from "react";
import { ANIMATION } from "@/constants/animation";

type UseScrollAnimationOptions = {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
};

export function useScrollAnimation({
  threshold = ANIMATION.scrollThreshold,
  once = true,
  rootMargin = ANIMATION.rootMargin,
}: UseScrollAnimationOptions = {}) {
  const ref = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If user prefers reduced motion, show everything immediately
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) {
              observer.unobserve(entry.target);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once, rootMargin]);

  return { ref, isVisible };
}
