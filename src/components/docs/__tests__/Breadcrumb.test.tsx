import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Breadcrumb } from "../Breadcrumb";

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

describe("Breadcrumb", () => {
  it("renders navigation with breadcrumb label", () => {
    render(
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Docs" }]} />
    );
    expect(screen.getByLabelText("Breadcrumb")).toBeInTheDocument();
  });

  it("renders items as links when href is provided", () => {
    render(
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Docs" }]} />
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/"
    );
  });

  it("renders last item as non-link with aria-current", () => {
    render(
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Docs" }]} />
    );
    const current = screen.getByText("Docs");
    expect(current).toHaveAttribute("aria-current", "page");
  });

  it("renders separator between items", () => {
    const { container } = render(
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Docs" }]} />
    );
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    expect(separators.length).toBeGreaterThanOrEqual(1);
  });
});
