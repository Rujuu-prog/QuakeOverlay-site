export const ANIMATION = {
  scrollThreshold: 0.15,
  fadeInDuration: 600,
  staggerDelay: 100,
  easing: "cubic-bezier(0.16, 1, 0.3, 1)",
  rootMargin: "0px 0px -50px 0px",
} as const;

export const SPLASH_SCREEN = {
  displayDuration: 3500,
  fadeDuration: 500,
  sessionKey: "quake-overlay-splash-shown",
} as const;

export const SPLASH_CONTENT = {
  rippleCount: 3,
  rippleSize: 80,
  rippleStaggerDelay: 0.6,
  rippleDuration: "2s",
  iconSize: 40,
} as const;

export const LOADING_ANIMATION = {
  rippleCount: 3,
  rippleDuration: "2s",
  rippleStaggerDelay: 0.4,
  seismographDuration: "2.5s",
  dotPulseDuration: "1.5s",
  shimmerDuration: "1.8s",
} as const;
