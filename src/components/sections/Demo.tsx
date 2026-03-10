"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getScreenshotPath, isAnimatedFormat } from "@/lib/screenshots";
import type { ScreenshotKey } from "@/constants/screenshots";

const DEMO_ITEMS: readonly { key: ScreenshotKey }[] = [
  { key: "dashboard" },
  { key: "overlay" },
  { key: "receiveLog" },
  { key: "overlaySettings" },
  { key: "mapSettings" },
  { key: "settings" },
];

export function Demo() {
  const t = useTranslations("home.demo");
  const locale = useLocale();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? DEMO_ITEMS.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === DEMO_ITEMS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-text-primary font-bold"
            style={{ fontSize: "var(--text-h2)" }}
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-text-secondary" style={{ fontSize: "var(--text-body)" }}>
            {t("subtitle")}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Carousel */}
          <div className="relative rounded-xl border border-border-accent overflow-hidden bg-bg-secondary">
            <Image
              src={getScreenshotPath(DEMO_ITEMS[currentIndex].key, locale)}
              alt={t(`items.${DEMO_ITEMS[currentIndex].key}.caption`)}
              width={1920}
              height={1080}
              className="w-full h-auto"
              unoptimized={isAnimatedFormat(DEMO_ITEMS[currentIndex].key) || undefined}
            />
          </div>

          {/* Caption */}
          <p className="mt-4 text-center text-text-secondary" style={{ fontSize: "var(--text-small)" }}>
            {t(`items.${DEMO_ITEMS[currentIndex].key}.caption`)}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:border-border-accent btn-transition"
              aria-label="Previous"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2">
              {DEMO_ITEMS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-accent"
                      : "bg-text-muted hover:bg-text-secondary"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              className="p-2 rounded-lg border border-border-default text-text-secondary hover:text-text-primary hover:border-border-accent btn-transition"
              aria-label="Next"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
