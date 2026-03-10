import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { ReleaseCard } from "../ReleaseCard";
import type { ReleaseEntry } from "@/types/releases";

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

const mockRelease: ReleaseEntry = {
  slug: "v1-0-0",
  version: "v1.0.0",
  date: "2026-01-15",
  summary: "First stable release",
  changes: [
    { type: "feature", description: "Earthquake alerts" },
    { type: "improvement", description: "Better perf" },
  ],
  knownIssues: [{ description: "Known bug #1" }],
};

const releaseNoIssues: ReleaseEntry = {
  ...mockRelease,
  knownIssues: [],
};

describe("ReleaseCard", () => {
  it("displays version and date", () => {
    render(<ReleaseCard release={mockRelease} defaultOpen={false} />);
    expect(screen.getByText("v1.0.0")).toBeInTheDocument();
    expect(screen.getByText("2026-01-15")).toBeInTheDocument();
  });

  it("displays summary", () => {
    render(<ReleaseCard release={mockRelease} defaultOpen={false} />);
    expect(screen.getByText("First stable release")).toBeInTheDocument();
  });

  it("toggles accordion on click", async () => {
    const user = userEvent.setup();
    render(<ReleaseCard release={mockRelease} defaultOpen={false} />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "false");
  });

  it("shows content when defaultOpen is true", () => {
    render(<ReleaseCard release={mockRelease} defaultOpen={true} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Earthquake alerts")).toBeInTheDocument();
  });

  it("displays known issues section when issues exist", () => {
    render(<ReleaseCard release={mockRelease} defaultOpen={true} />);
    expect(screen.getByText("Known Issues")).toBeInTheDocument();
    expect(screen.getByText("Known bug #1")).toBeInTheDocument();
  });

  it("hides known issues section when no issues", () => {
    render(<ReleaseCard release={releaseNoIssues} defaultOpen={true} />);
    expect(screen.queryByText("Known Issues")).not.toBeInTheDocument();
  });

  it("renders a link to the detail page", () => {
    render(<ReleaseCard release={mockRelease} defaultOpen={true} />);
    const link = screen.getByRole("link", { name: "v1.0.0" });
    expect(link).toHaveAttribute("href", "/releases/v1-0-0");
  });

  it("filters changes by activeFilter", () => {
    render(
      <ReleaseCard
        release={mockRelease}
        defaultOpen={true}
        activeFilter="feature"
      />
    );
    expect(screen.getByText("Earthquake alerts")).toBeInTheDocument();
    expect(screen.queryByText("Better perf")).not.toBeInTheDocument();
  });
});
