import type { ChangeType, RoadmapStatus } from "@/types/releases";

export type ChangeTypeConfig = {
  key: ChangeType;
  color: string;
  bgColor: string;
};

export const CHANGE_TYPE_CONFIGS: Record<ChangeType, ChangeTypeConfig> = {
  feature: {
    key: "feature",
    color: "var(--color-status-success)",
    bgColor: "rgba(0, 255, 136, 0.1)",
  },
  improvement: {
    key: "improvement",
    color: "var(--color-accent)",
    bgColor: "rgba(0, 212, 255, 0.1)",
  },
  fix: {
    key: "fix",
    color: "var(--color-status-warning)",
    bgColor: "rgba(255, 170, 0, 0.1)",
  },
  breaking: {
    key: "breaking",
    color: "var(--color-status-danger)",
    bgColor: "rgba(255, 51, 85, 0.1)",
  },
};

export type RoadmapStatusConfig = {
  key: RoadmapStatus;
  color: string;
  bgColor: string;
};

export const ROADMAP_STATUS_CONFIGS: Record<RoadmapStatus, RoadmapStatusConfig> = {
  "in-progress": {
    key: "in-progress",
    color: "var(--color-accent)",
    bgColor: "rgba(0, 212, 255, 0.1)",
  },
  planned: {
    key: "planned",
    color: "var(--color-status-info)",
    bgColor: "rgba(123, 104, 238, 0.1)",
  },
  completed: {
    key: "completed",
    color: "var(--color-status-success)",
    bgColor: "rgba(0, 255, 136, 0.1)",
  },
};

export const ROADMAP_STATUS_ORDER: RoadmapStatus[] = [
  "in-progress",
  "planned",
  "completed",
];
