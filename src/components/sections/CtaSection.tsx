"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { EXTERNAL_LINKS } from "@/constants/site";

export function CtaSection() {
  const t = useTranslations("home.cta");

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      {/* Glow background effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-text-primary font-bold text-glow-accent"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {t("title")}
        </h2>
        <p
          className="mt-4 text-text-secondary max-w-xl mx-auto"
          style={{ fontSize: "var(--text-body)" }}
        >
          {t("subtitle")}
        </p>

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            href={EXTERNAL_LINKS.booth}
            variant="primary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("download")}
          </Button>
        </div>
      </div>
    </section>
  );
}
