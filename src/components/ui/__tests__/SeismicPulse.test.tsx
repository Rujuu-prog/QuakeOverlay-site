import { describe, it, expect } from "vitest";
import { render } from "@/test/utils";
import { SeismicPulse } from "../SeismicPulse";

describe("SeismicPulse", () => {
  it("renders an SVG element", () => {
    const { container } = render(<SeismicPulse />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("is decorative (aria-hidden)", () => {
    const { container } = render(<SeismicPulse />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders 3 ripple circles", () => {
    const { container } = render(<SeismicPulse />);
    const circles = container.querySelectorAll(".epicenter-ripple");
    expect(circles).toHaveLength(3);
  });

  it("renders a center dot", () => {
    const { container } = render(<SeismicPulse />);
    const dot = container.querySelector(".epicenter-dot-pulse");
    expect(dot).toBeInTheDocument();
  });

  it("accepts custom size", () => {
    const { container } = render(<SeismicPulse size={200} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "200");
    expect(svg).toHaveAttribute("height", "200");
  });

  it("uses default size of 120", () => {
    const { container } = render(<SeismicPulse />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "120");
    expect(svg).toHaveAttribute("height", "120");
  });
});
