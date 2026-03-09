import { describe, it, expect } from "vitest";
import { render } from "@/test/utils";
import { SeismicDivider } from "../SeismicDivider";

describe("SeismicDivider", () => {
  it("renders an SVG element", () => {
    const { container } = render(<SeismicDivider />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders as a separator role", () => {
    const { container } = render(<SeismicDivider />);
    const divider = container.querySelector("[role='separator']");
    expect(divider).toBeInTheDocument();
  });

  it("has animated class when animated is true (default)", () => {
    const { container } = render(<SeismicDivider />);
    const wrapper = container.querySelector(".seismic-flow");
    expect(wrapper).toBeInTheDocument();
  });

  it("does not have animated class when animated is false", () => {
    const { container } = render(<SeismicDivider animated={false} />);
    const wrapper = container.querySelector(".seismic-flow");
    expect(wrapper).not.toBeInTheDocument();
  });

  it("applies custom opacity", () => {
    const { container } = render(<SeismicDivider opacity={0.5} />);
    const divider = container.querySelector("[role='separator']");
    expect(divider).toHaveStyle({ opacity: "0.5" });
  });

  it("has default opacity of 0.3", () => {
    const { container } = render(<SeismicDivider />);
    const divider = container.querySelector("[role='separator']");
    expect(divider).toHaveStyle({ opacity: "0.3" });
  });
});
