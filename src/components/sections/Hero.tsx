"use client";

import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/constants/site";
import { getScreenshotPath } from "@/lib/screenshots";
import Image from "next/image";

export function Hero() {
  const t = useTranslations("home");
  const locale = useLocale();

  return (
    <section className="relative overflow-hidden py-16 md:py-20 lg:py-24">
      {/* Seismic wave background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          className="absolute bottom-0 left-0 w-[200%] h-32 opacity-10 seismic-flow"
          viewBox="0 0 1600 80"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 Q50,10 100,40 T200,40 T300,40 T400,40 T500,40 T600,40 T700,40 T800,40 T900,40 T1000,40 T1100,40 T1200,40 T1300,40 T1400,40 T1500,40 T1600,40"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Text content */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium text-accent bg-accent/10 border border-border-accent rounded-full">
              {t("hero.badge")}
            </span>

            <h1
              className="text-text-primary font-bold text-glow-accent"
              style={{
                fontSize: "var(--text-hero)",
                lineHeight: "var(--leading-tight)",
                fontFamily: "var(--font-var-heading)",
              }}
            >
              {t("heroTitle")}
            </h1>

            <p
              className="mt-4 text-text-secondary max-w-2xl whitespace-pre-line"
              style={{ fontSize: "var(--text-h4)", lineHeight: "var(--leading-snug)" }}
            >
              {t("heroSubtitle")}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button
                href={EXTERNAL_LINKS.booth}
                variant="primary"
                size="lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("ctaDownload")}
              </Button>
              <Button href="/docs" variant="secondary" size="lg">
                {t("ctaDocs")}
              </Button>
            </div>
          </div>

          {/* Screenshot */}
          <div className="flex-1 max-w-2xl">
            <div className="relative rounded-xl border border-border-accent overflow-hidden glow-accent">
              <Image
                src={getScreenshotPath("main", locale)}
                alt={t("hero.screenshotAlt")}
                width={1920}
                height={1080}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
