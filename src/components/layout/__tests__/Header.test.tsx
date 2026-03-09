import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Header } from "../Header";

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
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useLocale: () => "en",
  };
});

describe("Header", () => {
  it("renders site name", () => {
    render(<Header />);
    expect(screen.getByText("QuakeOverlay")).toBeInTheDocument();
  });

  it("renders as a header element", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("has sticky positioning class", () => {
    render(<Header />);
    const header = screen.getByRole("banner");
    expect(header.className).toContain("sticky");
  });

  it("renders desktop navigation links", () => {
    render(<Header />);
    // Desktop nav links are rendered (may be hidden on mobile via CSS)
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("Releases")).toBeInTheDocument();
  });

  it("renders language switcher", () => {
    render(<Header />);
    expect(screen.getByRole("button", { name: /language/i })).toBeInTheDocument();
  });

  it("has backdrop-blur class for frosted effect", () => {
    render(<Header />);
    const header = screen.getByRole("banner");
    expect(header.className).toContain("backdrop-blur");
  });
});
