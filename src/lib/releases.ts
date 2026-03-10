import type { ReleaseDetail, ReleaseEntry, RoadmapEntry, RoadmapStatus } from "@/types/releases";
import { ROADMAP_STATUS_ORDER } from "@/constants/releases";
import { reader } from "./reader";

/**
 * Fetch all releases sorted by date descending (newest first).
 */
export async function getReleases(): Promise<ReleaseEntry[]> {
  const allReleases = await reader.collections.releases.all();

  const releases: ReleaseEntry[] = allReleases.map((release) => ({
    slug: release.slug,
    version: release.entry.version.replace(/-/g, "."),
    date: release.entry.date,
    summary: release.entry.summary,
    changes: release.entry.changes.map((c) => ({
      type: c.type as ReleaseEntry["changes"][number]["type"],
      description: c.description,
    })),
    knownIssues: release.entry.knownIssues
      ? release.entry.knownIssues.map((issue) => ({
          description: issue.description,
        }))
      : [],
  }));

  return releases.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Fetch a single release by slug with its Markdoc content.
 */
export async function getReleaseBySlug(
  slug: string
): Promise<ReleaseDetail | null> {
  const entry = await reader.collections.releases.read(slug, {
    resolveLinkedFiles: true,
  });

  if (!entry) return null;

  const raw = entry as Record<string, unknown>;
  const changes = (raw.changes as Array<{ type: string; description: string }>).map(
    (c) => ({
      type: c.type as ReleaseEntry["changes"][number]["type"],
      description: c.description,
    })
  );

  const knownIssues = raw.knownIssues
    ? (raw.knownIssues as Array<{ description: string }>).map((issue) => ({
        description: issue.description,
      }))
    : [];

  return {
    slug,
    version: (raw.version as string).replace(/-/g, "."),
    date: raw.date as string,
    summary: raw.summary as string,
    changes,
    knownIssues,
    content: raw.content as { node: unknown } | undefined,
  };
}

/**
 * Fetch roadmap items for a specific locale, sorted by status order.
 */
export async function getRoadmapByLocale(
  locale: string
): Promise<RoadmapEntry[]> {
  const allRoadmap = await reader.collections.roadmap.all();

  const filtered: RoadmapEntry[] = allRoadmap
    .filter((item) => item.entry.locale === locale)
    .map((item) => ({
      slug: item.slug,
      title: item.entry.title,
      description: item.entry.description,
      status: item.entry.status as RoadmapStatus,
      targetVersion: item.entry.targetVersion,
      locale: item.entry.locale,
    }));

  return filtered.sort(
    (a, b) =>
      ROADMAP_STATUS_ORDER.indexOf(a.status) -
      ROADMAP_STATUS_ORDER.indexOf(b.status)
  );
}
