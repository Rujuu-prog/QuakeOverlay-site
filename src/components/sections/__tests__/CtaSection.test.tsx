import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { CtaSection } from "../CtaSection";

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

describe("CtaSection", () => {
  it("renders the title", () => {
    render(<CtaSection />);
    expect(screen.getByText("Get Started Now")).toBeInTheDocument();
  });

  it("renders the subtitle", () => {
    render(<CtaSection />);
    expect(
      screen.getByText(
        "Download and display earthquake info on your stream"
      )
    ).toBeInTheDocument();
  });

  it("renders download CTA button", () => {
    render(<CtaSection />);
    expect(
      screen.getByRole("link", { name: "Download on Booth" })
    ).toBeInTheDocument();
  });

  it("links download to Booth", () => {
    render(<CtaSection />);
    const link = screen.getByRole("link", { name: "Download on Booth" });
    expect(link).toHaveAttribute("href", "https://rujuu.booth.pm/");
  });

});
