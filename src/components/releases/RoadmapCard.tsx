"use client";

import { useTranslations } from "next-intl";
import { ROADMAP_STATUS_CONFIGS } from "@/constants/releases";
import type { RoadmapEntry } from "@/types/releases";

type RoadmapCardProps = {
  item: RoadmapEntry;
};

export function RoadmapCard({ item }: RoadmapCardProps) {
  const t = useTranslations("releases.roadmap");
  const statusConfig = ROADMAP_STATUS_CONFIGS[item.status];

  return (
    <div className="bg-bg-card border border-border-default rounded-xl p-5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-medium text-text-primary">{item.title}</h3>
        <span
          className="inline-block shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            color: statusConfig.color,
            backgroundColor: statusConfig.bgColor,
          }}
        >
          {t(`statuses.${item.status}`)}
        </span>
      </div>
      {item.description && (
        <p className="text-sm text-text-secondary mb-3">{item.description}</p>
      )}
      {item.targetVersion && (
        <p className="text-xs text-text-muted">
          {t("targetVersion")}: <span className="text-accent">{item.targetVersion}</span>
        </p>
      )}
    </div>
  );
}
