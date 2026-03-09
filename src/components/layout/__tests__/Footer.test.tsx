import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Footer } from "../Footer";

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

describe("Footer", () => {
  it("renders as a footer element", () => {
    render(<Footer />);
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("renders site description", () => {
    render(<Footer />);
    expect(
      screen.getByText("Earthquake information overlay for streaming")
    ).toBeInTheDocument();
  });

  it("renders document section heading", () => {
    render(<Footer />);
    expect(screen.getByText("Documents")).toBeInTheDocument();
  });

  it("renders links section heading", () => {
    render(<Footer />);
    expect(screen.getByText("Links")).toBeInTheDocument();
  });

  it("renders external links with security attributes", () => {
    render(<Footer />);
    const externalLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
      expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
    });
  });

  it("renders copyright text", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(`© ${year} QuakeOverlay`))).toBeInTheDocument();
  });
});
