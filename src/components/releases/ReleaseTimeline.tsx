"use client";

import { useTranslations } from "next-intl";
import { ReleaseCard } from "./ReleaseCard";
import type { ChangeType, ReleaseEntry } from "@/types/releases";

type ReleaseTimelineProps = {
  releases: ReleaseEntry[];
  activeFilter: ChangeType | null;
};

export function ReleaseTimeline({
  releases,
  activeFilter,
}: ReleaseTimelineProps) {
  const t = useTranslations("releases");

  if (releases.length === 0) {
    return (
      <p className="text-text-secondary text-center py-8">{t("noReleases")}</p>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border-default" />

      <div className="space-y-6">
        {releases.map((release, index) => (
          <div key={release.slug} className="relative pl-10">
            {/* Timeline dot */}
            <div
              className="absolute left-2.5 top-6 size-3 rounded-full border-2 border-accent bg-bg-primary"
              aria-hidden="true"
            />
            <ReleaseCard
              release={release}
              defaultOpen={index === 0}
              activeFilter={activeFilter}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
