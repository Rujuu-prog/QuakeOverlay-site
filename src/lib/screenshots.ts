import {
  SCREENSHOT_KEYS,
  SCREENSHOT_PATHS,
  DUMMY_EXTENSION,
  SCREENSHOT_EXTENSION,
  LOCALES_WITH_SCREENSHOTS,
  DEFAULT_SCREENSHOT_LOCALE,
  type ScreenshotKey,
} from "@/constants/screenshots";

export function getScreenshotPath(
  key: ScreenshotKey,
  locale: string,
  availableLocales: readonly string[] = LOCALES_WITH_SCREENSHOTS,
): string {
  const filename = SCREENSHOT_KEYS[key];

  if (availableLocales.includes(locale)) {
    return `${SCREENSHOT_PATHS.localized}/${locale}/${filename}${SCREENSHOT_EXTENSION}`;
  }

  if (availableLocales.includes(DEFAULT_SCREENSHOT_LOCALE)) {
    return `${SCREENSHOT_PATHS.localized}/${DEFAULT_SCREENSHOT_LOCALE}/${filename}${SCREENSHOT_EXTENSION}`;
  }

  return `${SCREENSHOT_PATHS.dummy}/${filename}${DUMMY_EXTENSION}`;
}
