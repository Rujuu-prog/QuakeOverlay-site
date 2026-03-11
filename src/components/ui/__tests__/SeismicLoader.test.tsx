import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { SeismicLoader } from "../SeismicLoader";

describe("SeismicLoader", () => {
  it("renders with role=status", () => {
    render(<SeismicLoader />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has accessible label from translations", () => {
    render(<SeismicLoader />);
    expect(screen.getByLabelText("Loading content")).toBeInTheDocument();
  });

  it("displays loading text from translations", () => {
    render(<SeismicLoader />);
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("renders SeismicPulse component", () => {
    const { container } = render(<SeismicLoader />);
    const pulse = container.querySelector(".epicenter-dot-pulse");
    expect(pulse).toBeInTheDocument();
  });

  it("renders SeismicWaveLine component", () => {
    const { container } = render(<SeismicLoader />);
    const wave = container.querySelector(".seismograph-draw");
    expect(wave).toBeInTheDocument();
  });

  it("renders fullscreen variant by default", () => {
    const { container } = render(<SeismicLoader />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain("fixed");
    expect(wrapper?.className).toContain("inset-0");
  });

  it("renders inline variant", () => {
    const { container } = render(<SeismicLoader variant="inline" />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).not.toContain("fixed");
    expect(wrapper?.className).toContain("py-20");
  });

  it("renders minimal variant without wave line", () => {
    const { container } = render(<SeismicLoader variant="minimal" />);
    const wave = container.querySelector(".seismograph-draw");
    expect(wave).not.toBeInTheDocument();
  });

  it("renders minimal variant without loading text", () => {
    render(<SeismicLoader variant="minimal" />);
    expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
  });
});
