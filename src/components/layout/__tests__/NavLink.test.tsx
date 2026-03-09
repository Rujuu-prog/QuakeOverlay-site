import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { NavLink } from "../NavLink";

// Mock next-intl navigation
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
  usePathname: () => "/",
}));

describe("NavLink", () => {
  it("renders a link with text", () => {
    render(<NavLink href="/">Home</NavLink>);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
  });

  it("renders with correct href", () => {
    render(<NavLink href="/docs">Docs</NavLink>);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/docs");
  });

  it("applies active styles when pathname matches href", () => {
    render(<NavLink href="/">Home</NavLink>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("text-accent");
  });

  it("applies inactive styles when pathname does not match", () => {
    render(<NavLink href="/docs">Docs</NavLink>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("text-text-secondary");
  });

  it("has aria-current when active", () => {
    render(<NavLink href="/">Home</NavLink>);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("does not have aria-current when inactive", () => {
    render(<NavLink href="/docs">Docs</NavLink>);
    const link = screen.getByRole("link");
    expect(link).not.toHaveAttribute("aria-current");
  });
});
