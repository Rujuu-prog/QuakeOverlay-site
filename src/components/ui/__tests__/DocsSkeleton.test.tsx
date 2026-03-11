import { describe, it, expect } from "vitest";
import { render } from "@/test/utils";
import { DocsSkeleton } from "../DocsSkeleton";

describe("DocsSkeleton", () => {
  it("renders skeleton structure", () => {
    const { container } = render(<DocsSkeleton />);
    const shimmers = container.querySelectorAll(".skeleton-shimmer");
    expect(shimmers.length).toBeGreaterThan(0);
  });

  it("renders breadcrumb skeleton", () => {
    const { container } = render(<DocsSkeleton />);
    const breadcrumb = container.querySelector("[data-testid='skeleton-breadcrumb']");
    expect(breadcrumb).toBeInTheDocument();
  });

  it("renders title skeleton", () => {
    const { container } = render(<DocsSkeleton />);
    const title = container.querySelector("[data-testid='skeleton-title']");
    expect(title).toBeInTheDocument();
  });

  it("renders paragraph skeletons", () => {
    const { container } = render(<DocsSkeleton />);
    const paragraphs = container.querySelectorAll("[data-testid='skeleton-paragraph']");
    expect(paragraphs.length).toBeGreaterThanOrEqual(3);
  });

  it("renders code block skeleton", () => {
    const { container } = render(<DocsSkeleton />);
    const codeBlock = container.querySelector("[data-testid='skeleton-code']");
    expect(codeBlock).toBeInTheDocument();
  });

  it("does not render ToC by default", () => {
    const { container } = render(<DocsSkeleton />);
    const toc = container.querySelector("[data-testid='skeleton-toc']");
    expect(toc).not.toBeInTheDocument();
  });

  it("renders ToC when showToc is true", () => {
    const { container } = render(<DocsSkeleton showToc />);
    const toc = container.querySelector("[data-testid='skeleton-toc']");
    expect(toc).toBeInTheDocument();
  });

  it("has aria-hidden on decorative elements", () => {
    const { container } = render(<DocsSkeleton />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });
});
