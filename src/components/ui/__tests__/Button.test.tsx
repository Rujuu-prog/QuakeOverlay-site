import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Button } from "../Button";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders as a button by default", () => {
    render(<Button>Test</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders as a link when href is provided", () => {
    render(<Button href="/about">Go</Button>);
    expect(screen.getByRole("link", { name: "Go" })).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-accent");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border-border-accent");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("text-text-secondary");
  });

  it("applies default size", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("px-6");
  });

  it("applies sm size", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("px-4");
  });

  it("applies lg size", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("px-8");
  });

  it("forwards additional props to the element", () => {
    render(<Button aria-label="custom">Test</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-label", "custom");
  });

  it("applies additional className", () => {
    render(<Button className="custom-class">Test</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("custom-class");
  });
});
