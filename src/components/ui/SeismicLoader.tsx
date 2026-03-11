"use client";

import { useTranslations } from "next-intl";
import { SeismicPulse } from "./SeismicPulse";
import { SeismicWaveLine } from "./SeismicWaveLine";

type SeismicLoaderVariant = "fullscreen" | "inline" | "minimal";

type SeismicLoaderProps = {
  variant?: SeismicLoaderVariant;
};

const variantStyles: Record<SeismicLoaderVariant, string> = {
  fullscreen:
    "fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-bg-primary/95",
  inline: "flex flex-col items-center justify-center gap-6 py-20",
  minimal: "flex items-center justify-center py-8",
};

export function SeismicLoader({ variant = "fullscreen" }: SeismicLoaderProps) {
  const t = useTranslations("loading");
  const isMinimal = variant === "minimal";

  return (
    <div
      role="status"
      aria-label={t("ariaLabel")}
      className={variantStyles[variant]}
    >
      <SeismicPulse size={isMinimal ? 60 : 120} />

      {!isMinimal && <SeismicWaveLine />}

      {!isMinimal && (
        <p className="text-sm text-text-secondary">{t("text")}</p>
      )}
    </div>
  );
}
