import {
  SCREENSHOT_KEYS,
  SCREENSHOTS_BASE_PATH,
  LOCALES_WITH_SCREENSHOTS,
  DEFAULT_SCREENSHOT_LOCALE,
  type ScreenshotKey,
} from "@/constants/screenshots";

const ANIMATED_EXTENSIONS = [".gif"] as const;

export function isAnimatedFormat(key: ScreenshotKey): boolean {
  return (ANIMATED_EXTENSIONS as readonly string[]).includes(
    SCREENSHOT_KEYS[key].ext,
  );
}

export function getScreenshotPath(
  key: ScreenshotKey,
  locale: string,
  availableLocales: readonly string[] = LOCALES_WITH_SCREENSHOTS,
): string {
  const { filename, ext } = SCREENSHOT_KEYS[key];
  const resolvedLocale = availableLocales.includes(locale)
    ? locale
    : DEFAULT_SCREENSHOT_LOCALE;
  return `${SCREENSHOTS_BASE_PATH}/${resolvedLocale}/${filename}${ext}`;
}
