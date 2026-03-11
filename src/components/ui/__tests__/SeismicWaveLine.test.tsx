import { describe, it, expect } from "vitest";
import { render } from "@/test/utils";
import { SeismicWaveLine } from "../SeismicWaveLine";

describe("SeismicWaveLine", () => {
  it("renders an SVG element", () => {
    const { container } = render(<SeismicWaveLine />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("is decorative (aria-hidden)", () => {
    const { container } = render(<SeismicWaveLine />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a path with seismograph-draw class", () => {
    const { container } = render(<SeismicWaveLine />);
    const path = container.querySelector("path.seismograph-draw");
    expect(path).toBeInTheDocument();
  });

  it("path has stroke-dasharray for animation", () => {
    const { container } = render(<SeismicWaveLine />);
    const path = container.querySelector("path.seismograph-draw");
    expect(path).toHaveAttribute("stroke-dasharray");
  });
});
