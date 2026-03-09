"use client";

import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Download, Settings, Radio } from "lucide-react";

const STEPS = [
  { key: "download", icon: Download },
  { key: "configure", icon: Settings },
  { key: "stream", icon: Radio },
] as const;

export function HowItWorks() {
  const t = useTranslations("home.howItWorks");
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
          className={`relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 scroll-animate ${isVisible ? "is-visible" : ""}`}
        >
          {/* Connection line (desktop only) */}
          <div
            className="hidden md:block absolute top-16 left-1/6 right-1/6 h-px bg-border-accent opacity-30"
            aria-hidden="true"
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.key} className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-accent text-text-inverse font-bold text-lg mb-6">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="p-3 rounded-lg bg-accent/10 text-accent mb-4">
                  <Icon size={24} aria-hidden="true" />
                </div>

                {/* Content */}
                <h3
                  className="text-text-primary font-semibold mb-2"
                  style={{ fontSize: "var(--text-h4)" }}
                >
                  {t(`steps.${step.key}.title`)}
                </h3>
                <p className="text-text-secondary max-w-xs" style={{ fontSize: "var(--text-small)" }}>
                  {t(`steps.${step.key}.description`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
