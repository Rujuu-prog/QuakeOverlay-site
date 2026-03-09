"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Zap, Monitor, Settings, Globe } from "lucide-react";

const FEATURE_KEYS = ["realtime", "overlay", "customize", "multilang"] as const;

const FEATURE_ICONS = {
  realtime: Zap,
  overlay: Monitor,
  customize: Settings,
  multilang: Globe,
} as const;

export function Features() {
  const t = useTranslations("home.features");
  const { ref, isVisible } = useScrollAnimation();

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

        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 scroll-animate ${isVisible ? "is-visible" : ""}`}
        >
          {FEATURE_KEYS.map((key) => {
            const Icon = FEATURE_ICONS[key];
            return (
              <Card key={key} hover>
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent">
                    <Icon size={28} aria-hidden="true" />
                  </div>
                  <h3
                    className="text-text-primary font-semibold"
                    style={{ fontSize: "var(--text-h4)" }}
                  >
                    {t(`items.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary" style={{ fontSize: "var(--text-small)" }}>
                    {t(`items.${key}.description`)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
