import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { RoadmapSection } from "../RoadmapSection";
import type { RoadmapEntry } from "@/types/releases";

const items: RoadmapEntry[] = [
  {
    slug: "custom-themes",
    title: "Custom Themes",
    description: "Add custom theme support",
    status: "in-progress",
    targetVersion: "v1.1.0",
    locale: "ja",
  },
  {
    slug: "tsunami-alerts",
    title: "Tsunami Alerts",
    description: "Add tsunami alert support",
    status: "planned",
    targetVersion: "v1.2.0",
    locale: "ja",
  },
];

describe("RoadmapSection", () => {
  it("renders roadmap title", () => {
    render(<RoadmapSection items={items} />);
    expect(screen.getByText("Roadmap")).toBeInTheDocument();
  });

  it("renders all roadmap items", () => {
    render(<RoadmapSection items={items} />);
    expect(screen.getByText("Custom Themes")).toBeInTheDocument();
    expect(screen.getByText("Tsunami Alerts")).toBeInTheDocument();
  });

  it("displays status badges with correct text", () => {
    render(<RoadmapSection items={items} />);
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Planned")).toBeInTheDocument();
  });

  it("displays target version", () => {
    render(<RoadmapSection items={items} />);
    expect(screen.getByText("v1.1.0")).toBeInTheDocument();
    expect(screen.getByText("v1.2.0")).toBeInTheDocument();
  });

  it("shows empty message when no items", () => {
    render(<RoadmapSection items={[]} />);
    expect(screen.getByText("No roadmap items yet")).toBeInTheDocument();
  });
});
