"use client";

import { useState } from "react";
import { ChangeTypeFilter } from "./ChangeTypeFilter";
import { ReleaseTimeline } from "./ReleaseTimeline";
import { RoadmapSection } from "./RoadmapSection";
import { SeismicDivider } from "@/components/ui/SeismicDivider";
import type { ChangeType, ReleaseEntry, RoadmapEntry } from "@/types/releases";

type ReleasesPageContentProps = {
  releases: ReleaseEntry[];
  roadmapItems: RoadmapEntry[];
};

export function ReleasesPageContent({
  releases,
  roadmapItems,
}: ReleasesPageContentProps) {
  const [activeFilter, setActiveFilter] = useState<ChangeType | null>(null);

  return (
    <div className="space-y-10">
      <ChangeTypeFilter
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <ReleaseTimeline releases={releases} activeFilter={activeFilter} />

      {roadmapItems.length > 0 && (
        <>
          <SeismicDivider />
          <RoadmapSection items={roadmapItems} />
        </>
      )}
    </div>
  );
}
