"use client";

import { useTranslations } from "next-intl";
import { RoadmapCard } from "./RoadmapCard";
import type { RoadmapEntry } from "@/types/releases";

type RoadmapSectionProps = {
  items: RoadmapEntry[];
};

export function RoadmapSection({ items }: RoadmapSectionProps) {
  const t = useTranslations("releases.roadmap");

  return (
    <section>
      <h2
        className="font-heading font-semibold text-text-primary mb-2"
        style={{ fontSize: "var(--text-h2)" }}
      >
        {t("title")}
      </h2>
      <p className="text-text-secondary mb-6">{t("subtitle")}</p>

      {items.length === 0 ? (
        <p className="text-text-secondary text-center py-8">{t("noItems")}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <RoadmapCard key={item.slug} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
