"use client";

import { useTranslations } from "next-intl";

export function SkipToContent() {
  const t = useTranslations("header");

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-text-inverse focus:font-semibold"
    >
      {t("skipToContent")}
    </a>
  );
}
