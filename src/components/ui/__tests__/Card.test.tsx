import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Card } from "../Card";

describe("Card", () => {
  it("renders children content", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("has hover styles by default", () => {
    render(<Card>Hover card</Card>);
    const card = screen.getByText("Hover card").closest("div");
    expect(card?.className).toContain("card-hover");
  });

  it("disables hover when hover=false", () => {
    render(<Card hover={false}>No hover</Card>);
    const card = screen.getByText("No hover").closest("div");
    expect(card?.className).not.toContain("card-hover");
  });

  it("applies base card styling", () => {
    render(<Card>Styled card</Card>);
    const card = screen.getByText("Styled card").closest("div");
    expect(card?.className).toContain("bg-bg-card");
    expect(card?.className).toContain("border");
    expect(card?.className).toContain("rounded-xl");
  });

  it("applies additional className", () => {
    render(<Card className="extra">Content</Card>);
    const card = screen.getByText("Content").closest("div");
    expect(card?.className).toContain("extra");
  });
});
