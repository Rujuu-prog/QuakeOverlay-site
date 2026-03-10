import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { ReleaseTimeline } from "../ReleaseTimeline";

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
import type { ReleaseEntry } from "@/types/releases";

const releases: ReleaseEntry[] = [
  {
    slug: "v1-0-0",
    version: "v1.0.0",
    date: "2026-01-15",
    summary: "First stable",
    changes: [{ type: "feature", description: "Feature A" }],
    knownIssues: [],
  },
  {
    slug: "v0-9-0",
    version: "v0.9.0",
    date: "2025-12-01",
    summary: "Beta release",
    changes: [{ type: "fix", description: "Fix B" }],
    knownIssues: [],
  },
];

describe("ReleaseTimeline", () => {
  it("renders multiple releases", () => {
    render(<ReleaseTimeline releases={releases} activeFilter={null} />);
    expect(screen.getByText("v1.0.0")).toBeInTheDocument();
    expect(screen.getByText("v0.9.0")).toBeInTheDocument();
  });

  it("shows first release expanded by default", () => {
    render(<ReleaseTimeline releases={releases} activeFilter={null} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[0]).toHaveAttribute("aria-expanded", "true");
    expect(buttons[1]).toHaveAttribute("aria-expanded", "false");
  });

  it("shows empty message when no releases", () => {
    render(<ReleaseTimeline releases={[]} activeFilter={null} />);
    expect(screen.getByText("No releases yet")).toBeInTheDocument();
  });
});
