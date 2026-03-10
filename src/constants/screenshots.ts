export const SCREENSHOT_KEYS = {
  main: "app-screenshot-main",
  overlay: "app-screenshot-overlay",
  settings: "app-screenshot-settings",
} as const;

export type ScreenshotKey = keyof typeof SCREENSHOT_KEYS;

export const SCREENSHOT_PATHS = {
  dummy: "/images/dummy",
  localized: "/images/screenshots",
} as const;

export const DUMMY_EXTENSION = ".svg";
export const SCREENSHOT_EXTENSION = ".png";
export const LOCALES_WITH_SCREENSHOTS: readonly string[] = [];
export const DEFAULT_SCREENSHOT_LOCALE = "ja";
