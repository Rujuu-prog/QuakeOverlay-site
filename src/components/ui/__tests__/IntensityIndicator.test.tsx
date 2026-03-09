import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { IntensityIndicator } from "../IntensityIndicator";

describe("IntensityIndicator", () => {
  it("renders correct number of active dots for level 1", () => {
    const { container } = render(<IntensityIndicator level={1} />);
    const activeDots = container.querySelectorAll("[data-active='true']");
    expect(activeDots).toHaveLength(1);
  });

  it("renders correct number of active dots for level 3", () => {
    const { container } = render(<IntensityIndicator level={3} />);
    const activeDots = container.querySelectorAll("[data-active='true']");
    expect(activeDots).toHaveLength(3);
  });

  it("renders correct number of active dots for level 5", () => {
    const { container } = render(<IntensityIndicator level={5} />);
    const activeDots = container.querySelectorAll("[data-active='true']");
    expect(activeDots).toHaveLength(5);
  });

  it("renders 5 total dots always", () => {
    const { container } = render(<IntensityIndicator level={2} />);
    const allDots = container.querySelectorAll("[data-dot]");
    expect(allDots).toHaveLength(5);
  });

  it("shows label when showLabel is true", () => {
    render(<IntensityIndicator level={3} showLabel />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("does not show label by default", () => {
    render(<IntensityIndicator level={3} />);
    expect(screen.queryByText("3")).not.toBeInTheDocument();
  });

  it("shows 5+ label for level 5", () => {
    render(<IntensityIndicator level={5} showLabel />);
    expect(screen.getByText("5+")).toBeInTheDocument();
  });
});
