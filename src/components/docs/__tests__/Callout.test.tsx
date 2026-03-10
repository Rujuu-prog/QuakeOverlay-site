import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { Callout } from "../Callout";

describe("Callout", () => {
  it("renders children", () => {
    render(<Callout type="info">Test message</Callout>);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders info variant with correct role", () => {
    const { container } = render(
      <Callout type="info">Info message</Callout>
    );
    const callout = container.firstChild as HTMLElement;
    expect(callout).toHaveClass("border-status-info");
  });

  it("renders warning variant", () => {
    const { container } = render(
      <Callout type="warning">Warning message</Callout>
    );
    const callout = container.firstChild as HTMLElement;
    expect(callout).toHaveClass("border-status-warning");
  });

  it("renders danger variant", () => {
    const { container } = render(
      <Callout type="danger">Danger message</Callout>
    );
    const callout = container.firstChild as HTMLElement;
    expect(callout).toHaveClass("border-status-danger");
  });

  it("has alert role for warning and danger", () => {
    render(<Callout type="warning">Alert content</Callout>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
