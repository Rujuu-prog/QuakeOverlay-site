import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { ReleaseDetailContent } from "../ReleaseDetailContent";
import type { ReleaseEntry } from "@/types/releases";

const mockRelease: ReleaseEntry = {
  slug: "v1-0-0",
  version: "v1.0.0",
  date: "2026-01-15",
  summary: "First stable release",
  changes: [
    { type: "feature", description: "Realtime earthquake display" },
    { type: "improvement", description: "Performance optimization" },
    { type: "fix", description: "Fixed crash on startup" },
  ],
  knownIssues: [{ description: "Known bug in OBS" }],
};

describe("ReleaseDetailContent", () => {
  it("renders version and date", () => {
    render(<ReleaseDetailContent release={mockRelease} />);

    expect(screen.getByText("v1.0.0")).toBeInTheDocument();
    expect(screen.getByText("2026-01-15")).toBeInTheDocument();
  });

  it("renders summary", () => {
    render(<ReleaseDetailContent release={mockRelease} />);

    expect(screen.getByText("First stable release")).toBeInTheDocument();
  });

  it("renders all change items with badges", () => {
    render(<ReleaseDetailContent release={mockRelease} />);

    expect(screen.getByText("Realtime earthquake display")).toBeInTheDocument();
    expect(screen.getByText("Performance optimization")).toBeInTheDocument();
    expect(screen.getByText("Fixed crash on startup")).toBeInTheDocument();
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Improvement")).toBeInTheDocument();
    expect(screen.getByText("Fix")).toBeInTheDocument();
  });

  it("renders known issues section", () => {
    render(<ReleaseDetailContent release={mockRelease} />);

    expect(screen.getByText("Known Issues")).toBeInTheDocument();
    expect(screen.getByText("Known bug in OBS")).toBeInTheDocument();
  });

  it("does not render known issues section when empty", () => {
    const releaseWithoutIssues = { ...mockRelease, knownIssues: [] };
    render(<ReleaseDetailContent release={releaseWithoutIssues} />);

    expect(screen.queryByText("Known Issues")).not.toBeInTheDocument();
  });

  it("renders children as content section", () => {
    render(
      <ReleaseDetailContent release={mockRelease}>
        <div data-testid="doc-content">Rendered content</div>
      </ReleaseDetailContent>
    );

    expect(screen.getByTestId("doc-content")).toBeInTheDocument();
  });

  it("does not render content section when no children", () => {
    const { container } = render(
      <ReleaseDetailContent release={mockRelease} />
    );

    // Only 3 border-t sections: changes has none, known issues has 1
    // No extra content section border
    const borderSections = container.querySelectorAll(".border-t");
    expect(borderSections).toHaveLength(1); // Only known issues
  });
});
