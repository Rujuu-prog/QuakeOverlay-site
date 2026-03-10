import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { TableOfContents } from "../TableOfContents";
import type { DocTocItem } from "@/types/docs";

describe("TableOfContents", () => {
  const items: DocTocItem[] = [
    { id: "getting-started", text: "Getting Started", level: 2 },
    { id: "installation", text: "Installation", level: 3 },
    { id: "configuration", text: "Configuration", level: 2 },
  ];

  it("renders all TOC items", () => {
    render(<TableOfContents items={items} />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Installation")).toBeInTheDocument();
    expect(screen.getByText("Configuration")).toBeInTheDocument();
  });

  it("renders heading text", () => {
    render(<TableOfContents items={items} />);
    expect(screen.getByText("On this page")).toBeInTheDocument();
  });

  it("renders links with correct href", () => {
    render(<TableOfContents items={items} />);
    const link = screen.getByText("Getting Started").closest("a");
    expect(link).toHaveAttribute("href", "#getting-started");
  });

  it("renders nothing when items is empty", () => {
    const { container } = render(<TableOfContents items={[]} />);
    expect(container.querySelector("nav")).toBeNull();
  });
});
