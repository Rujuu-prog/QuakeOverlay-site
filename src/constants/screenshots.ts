export const SCREENSHOT_KEYS = {
  dashboard: { filename: "dashboard", ext: ".gif" },
  main: { filename: "app-screenshot-main", ext: ".svg" },
  overlay: { filename: "app-screenshot-overlay", ext: ".svg" },
  settings: { filename: "app-screenshot-settings", ext: ".svg" },
  receiveLog: { filename: "log", ext: ".gif" },
  overlaySettings: { filename: "app-screenshot-overlay-settings", ext: ".svg" },
  mapSettings: { filename: "app-screenshot-map-settings", ext: ".svg" },
} as const;

export type ScreenshotKey = keyof typeof SCREENSHOT_KEYS;

export const SCREENSHOTS_BASE_PATH = "/images/screenshots";
export const LOCALES_WITH_SCREENSHOTS: readonly string[] = ["ja"];
export const DEFAULT_SCREENSHOT_LOCALE = "ja";
