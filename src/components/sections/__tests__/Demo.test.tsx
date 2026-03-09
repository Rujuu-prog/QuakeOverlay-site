import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { Demo } from "../Demo";

vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
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
    expect(
      screen.getByText("Main screen - Earthquake information display")
    ).toBeInTheDocument();
  });

  it("renders navigation buttons", () => {
    render(<Demo />);
    const prevButton = screen.getByRole("button", { name: /previous/i });
    const nextButton = screen.getByRole("button", { name: /next/i });
    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
