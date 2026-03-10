import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReleaseEntry, RoadmapEntry } from "@/types/releases";

// Mock the reader
vi.mock("../reader", () => ({
  reader: {
    collections: {
      releases: {
        all: vi.fn(),
        read: vi.fn(),
      },
      roadmap: {
        all: vi.fn(),
      },
    },
  },
}));

import { reader } from "../reader";
import { getReleases, getReleaseBySlug, getRoadmapByLocale } from "../releases";

const mockReleasesAll = vi.mocked(reader.collections.releases.all);
const mockReleasesRead = vi.mocked(
  reader.collections.releases.read as (
    slug: string,
    opts?: { resolveLinkedFiles: boolean }
  ) => Promise<Record<string, unknown> | null>
);
const mockRoadmapAll = vi.mocked(reader.collections.roadmap.all);

describe("getReleases", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns all releases sorted by date descending", async () => {
    mockReleasesAll.mockResolvedValue([
      {
        slug: "v0-9-0",
        entry: {
          version: "v0.9.0",
          date: "2025-12-01",
          summary: "Beta release",
          changes: [{ type: "feature", description: "Initial beta" }],
          knownIssues: [],
        },
      },
      {
        slug: "v1-0-0",
        entry: {
          version: "v1.0.0",
          date: "2026-01-15",
          summary: "First stable release",
          changes: [
            { type: "feature", description: "Stable release" },
            { type: "improvement", description: "Better perf" },
          ],
          knownIssues: [{ description: "Known bug #1" }],
        },
      },
    ] as never);

    const releases = await getReleases();

    expect(releases).toHaveLength(2);
    // Most recent first
    expect(releases[0].version).toBe("v1.0.0");
    expect(releases[1].version).toBe("v0.9.0");
    // Verify structure
    expect(releases[0].slug).toBe("v1-0-0");
    expect(releases[0].changes).toHaveLength(2);
    expect(releases[0].knownIssues).toHaveLength(1);
    expect(releases[0].knownIssues[0].description).toBe("Known bug #1");
  });

  it("returns empty array when no releases exist", async () => {
    mockReleasesAll.mockResolvedValue([]);

    const releases = await getReleases();
    expect(releases).toEqual([]);
  });
});

describe("getReleaseBySlug", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns release detail with content when slug exists", async () => {
    const mockContent = { node: { type: "document" } };
    mockReleasesRead.mockResolvedValue({
      version: "v1-0-0",
      date: "2026-01-15",
      summary: "First stable release",
      changes: [
        { type: "feature", description: "Realtime earthquake display" },
      ],
      knownIssues: [{ description: "Known bug" }],
      content: mockContent,
    } as never);

    const release = await getReleaseBySlug("v1-0-0");

    expect(release).not.toBeNull();
    expect(release!.slug).toBe("v1-0-0");
    expect(release!.version).toBe("v1.0.0");
    expect(release!.date).toBe("2026-01-15");
    expect(release!.summary).toBe("First stable release");
    expect(release!.changes).toHaveLength(1);
    expect(release!.changes[0].type).toBe("feature");
    expect(release!.knownIssues).toHaveLength(1);
    expect(release!.content).toBe(mockContent);
  });

  it("returns null when slug does not exist", async () => {
    mockReleasesRead.mockResolvedValue(null as never);

    const release = await getReleaseBySlug("nonexistent");
    expect(release).toBeNull();
  });

  it("handles release without knownIssues", async () => {
    mockReleasesRead.mockResolvedValue({
      version: "v0-9-0",
      date: "2025-12-01",
      summary: "Beta",
      changes: [{ type: "feature", description: "Beta feature" }],
      content: { node: {} },
    } as never);

    const release = await getReleaseBySlug("v0-9-0");

    expect(release).not.toBeNull();
    expect(release!.knownIssues).toEqual([]);
  });
});

describe("getRoadmapByLocale", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters by locale and sorts by status order", async () => {
    mockRoadmapAll.mockResolvedValue([
      {
        slug: "planned-feature",
        entry: {
          title: "Planned Feature",
          description: "A planned item",
          status: "planned",
          targetVersion: "v1.2.0",
          locale: "ja",
        },
      },
      {
        slug: "in-progress-feature",
        entry: {
          title: "In Progress",
          description: "An in-progress item",
          status: "in-progress",
          targetVersion: "v1.1.0",
          locale: "ja",
        },
      },
      {
        slug: "english-only",
        entry: {
          title: "English Only",
          description: "EN item",
          status: "planned",
          targetVersion: "v2.0.0",
          locale: "en",
        },
      },
    ] as never);

    const roadmap = await getRoadmapByLocale("ja");

    expect(roadmap).toHaveLength(2);
    // in-progress comes first, then planned
    expect(roadmap[0].status).toBe("in-progress");
    expect(roadmap[1].status).toBe("planned");
  });

  it("returns empty array when no items match locale", async () => {
    mockRoadmapAll.mockResolvedValue([
      {
        slug: "ja-only",
        entry: {
          title: "Japanese Only",
          description: "JA item",
          status: "planned",
          targetVersion: "v1.0.0",
          locale: "ja",
        },
      },
    ] as never);

    const roadmap = await getRoadmapByLocale("ko");
    expect(roadmap).toEqual([]);
  });
});
