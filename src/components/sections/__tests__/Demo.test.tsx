import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Demo } from "../Demo";

vi.mock("next/image", () => ({
  default: ({ unoptimized, ...props }: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} {...(unoptimized ? { unoptimized: "" } : {})} />;
  },
}));

describe("Demo", () => {
  it("renders the section title", () => {
    render(<Demo />);
    expect(screen.getByText("Demo")).toBeInTheDocument();
  });

  it("renders the section subtitle", () => {
    render(<Demo />);
    expect(screen.getByText("See it in action")).toBeInTheDocument();
  });

  it("renders screenshot images", () => {
    render(<Demo />);
    const images = screen.getAllByRole("img");
    expect(images.length).toBeGreaterThanOrEqual(1);
  });

  it("renders captions", () => {
    render(<Demo />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<Demo />);
    const prevButton = screen.getByRole("button", { name: /previous/i });
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });

  it("renders first screenshot with dashboard path", () => {
    render(<Demo />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/images/screenshots/ja/dashboard.gif");
  });

  it("renders 6 dot indicators", () => {
    render(<Demo />);
    const dots = screen.getAllByRole("button", { name: /go to slide/i });
    expect(dots).toHaveLength(6);
  });

  it("GIF screenshot has unoptimized attribute", () => {
    render(<Demo />);
    const img = screen.getByRole("img");
    // dashboard is .gif, should be unoptimized
    expect(img).toHaveAttribute("unoptimized");
  });
});
