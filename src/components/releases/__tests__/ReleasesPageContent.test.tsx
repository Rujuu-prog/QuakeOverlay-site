import { describe, it, expect, vi } from "vitest";
import { render, screen, within, userEvent } from "@/test/utils";
import { ReleasesPageContent } from "../ReleasesPageContent";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));
import type { ReleaseEntry, RoadmapEntry } from "@/types/releases";

const releases: ReleaseEntry[] = [
  {
    slug: "v1-0-0",
    version: "v1.0.0",
    date: "2026-01-15",
    summary: "First stable",
    changes: [
      { type: "feature", description: "Feature A" },
      { type: "fix", description: "Fix B" },
    ],
    knownIssues: [],
  },
];

const roadmapItems: RoadmapEntry[] = [
  {
    slug: "custom-themes",
    title: "Custom Themes",
    description: "Theme support",
    status: "in-progress",
    targetVersion: "v1.1.0",
    locale: "ja",
  },
];

describe("ReleasesPageContent", () => {
  it("renders filter, timeline, and roadmap sections", () => {
    render(
      <ReleasesPageContent releases={releases} roadmapItems={roadmapItems} />
    );
    // Filter buttons
    expect(screen.getByText("All")).toBeInTheDocument();
    // Timeline
    expect(screen.getByText("v1.0.0")).toBeInTheDocument();
    // Roadmap
    expect(screen.getByText("Roadmap")).toBeInTheDocument();
    expect(screen.getByText("Custom Themes")).toBeInTheDocument();
  });

  it("filters changes when a filter button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ReleasesPageContent releases={releases} roadmapItems={roadmapItems} />
    );

    // Initially both changes visible
    expect(screen.getByText("Feature A")).toBeInTheDocument();
    expect(screen.getByText("Fix B")).toBeInTheDocument();

    // Click "Feature" filter button (use role to distinguish from badge)
    const filterGroup = screen.getByRole("group", { name: "Filter" });
    const featureButton = within(filterGroup).getByText("Feature");
    await user.click(featureButton);
    expect(screen.getByText("Feature A")).toBeInTheDocument();
    expect(screen.queryByText("Fix B")).not.toBeInTheDocument();

    // Click "All" to reset
    await user.click(within(filterGroup).getByText("All"));
    expect(screen.getByText("Feature A")).toBeInTheDocument();
    expect(screen.getByText("Fix B")).toBeInTheDocument();
  });
});
