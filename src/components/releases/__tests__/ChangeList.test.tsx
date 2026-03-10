import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { ChangeList } from "../ChangeList";
import type { ReleaseChange } from "@/types/releases";

describe("ChangeList", () => {
  const changes: ReleaseChange[] = [
    { type: "feature", description: "Added earthquake alerts" },
    { type: "fix", description: "Fixed overlay position" },
    { type: "improvement", description: "Better performance" },
  ];

  it("renders all change descriptions", () => {
    render(<ChangeList changes={changes} />);
    expect(screen.getByText("Added earthquake alerts")).toBeInTheDocument();
    expect(screen.getByText("Fixed overlay position")).toBeInTheDocument();
    expect(screen.getByText("Better performance")).toBeInTheDocument();
  });

  it("renders a ChangeTypeBadge for each change", () => {
    render(<ChangeList changes={changes} />);
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Fix")).toBeInTheDocument();
    expect(screen.getByText("Improvement")).toBeInTheDocument();
  });

  it("renders nothing when changes is empty", () => {
    const { container } = render(<ChangeList changes={[]} />);
    expect(container.querySelector("ul")).toBeNull();
  });
});
