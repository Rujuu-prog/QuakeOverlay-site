export type ChangeType = "feature" | "improvement" | "fix" | "breaking";

export type ReleaseChange = {
  type: ChangeType;
  description: string;
};

export type ReleaseKnownIssue = {
  description: string;
};

export type ReleaseEntry = {
  slug: string;
  version: string;
  date: string;
  summary: string;
  changes: ReleaseChange[];
  knownIssues: ReleaseKnownIssue[];
};

export type ReleaseDetail = ReleaseEntry & {
  content?: { node: unknown };
};

export type RoadmapStatus = "planned" | "in-progress" | "completed";

export type RoadmapEntry = {
  slug: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  targetVersion: string;
  locale: string;
};
