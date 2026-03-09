import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { PulseDot } from "../PulseDot";

describe("PulseDot", () => {
  it("renders with default success color", () => {
    render(<PulseDot />);
    const dot = screen.getByRole("status");
    expect(dot).toBeInTheDocument();
  });

  it("renders with accessible label", () => {
    render(<PulseDot label="Active" />);
    expect(screen.getByLabelText("Active")).toBeInTheDocument();
  });

  it("renders with success color", () => {
    const { container } = render(<PulseDot color="success" />);
    const dot = container.querySelector("[data-color='success']");
    expect(dot).toBeInTheDocument();
  });

  it("renders with warning color", () => {
    const { container } = render(<PulseDot color="warning" />);
    const dot = container.querySelector("[data-color='warning']");
    expect(dot).toBeInTheDocument();
  });

  it("renders with danger color", () => {
    const { container } = render(<PulseDot color="danger" />);
    const dot = container.querySelector("[data-color='danger']");
    expect(dot).toBeInTheDocument();
  });

  it("renders with accent color", () => {
    const { container } = render(<PulseDot color="accent" />);
    const dot = container.querySelector("[data-color='accent']");
    expect(dot).toBeInTheDocument();
  });

  it("has pulse animation class", () => {
    const { container } = render(<PulseDot />);
    const dot = container.querySelector(".pulse-dot");
    expect(dot).toBeInTheDocument();
  });
});
