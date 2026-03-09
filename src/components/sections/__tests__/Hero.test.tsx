import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Hero } from "../Hero";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

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

describe("Hero", () => {
  it("renders the hero title", () => {
    render(<Hero />);
    expect(screen.getByText("Never miss earthquake information during your stream.")).toBeInTheDocument();
  });

  it("renders the hero subtitle with line breaks", () => {
    render(<Hero />);
    const subtitle = screen.getByText(/QuakeOverlay automatically fetches earthquake data/);
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveClass("whitespace-pre-line");
    expect(subtitle.textContent).toContain("\n");
  });

  it("renders the badge text", () => {
    render(<Hero />);
    expect(screen.getByText("For OBS Streamers")).toBeInTheDocument();
  });

  it("renders two CTA buttons", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: "Download" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View Docs" })
    ).toBeInTheDocument();
  });

  it("links download button to Booth", () => {
    render(<Hero />);
    const downloadLink = screen.getByRole("link", { name: "Download" });
    expect(downloadLink).toHaveAttribute(
      "href",
      "https://rujuu.booth.pm/"
    );
  });

  it("links docs button to /docs", () => {
    render(<Hero />);
    const docsLink = screen.getByRole("link", { name: "View Docs" });
    expect(docsLink).toHaveAttribute("href", "/docs");
  });

  it("renders screenshot image with alt text", () => {
    render(<Hero />);
    const img = screen.getByAltText("QuakeOverlay main screen");
    expect(img).toBeInTheDocument();
  });
});
