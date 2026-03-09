import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { SkipToContent } from "../SkipToContent";

describe("SkipToContent", () => {
  it("renders a skip link", () => {
    render(<SkipToContent />);
    const link = screen.getByText("Skip to content");
    expect(link).toBeInTheDocument();
  });

  it("links to #main-content", () => {
    render(<SkipToContent />);
    const link = screen.getByText("Skip to content");
    expect(link).toHaveAttribute("href", "#main-content");
  });

  it("is visually hidden by default (sr-only)", () => {
    render(<SkipToContent />);
    const link = screen.getByText("Skip to content");
    expect(link.className).toContain("sr-only");
  });

  it("becomes visible on focus", () => {
    render(<SkipToContent />);
    const link = screen.getByText("Skip to content");
    expect(link.className).toContain("focus:not-sr-only");
  });
});
