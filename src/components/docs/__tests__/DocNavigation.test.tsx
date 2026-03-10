import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { DocNavigation } from "../DocNavigation";

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

describe("DocNavigation", () => {
  it("renders previous link when prev is provided", () => {
    render(
      <DocNavigation
        prev={{ slug: "getting-started", title: "Getting Started" }}
      />
    );
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
  });

  it("renders next link when next is provided", () => {
    render(
      <DocNavigation next={{ slug: "screens", title: "Screens" }} />
    );
    expect(screen.getByText("Screens")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders both links", () => {
    render(
      <DocNavigation
        prev={{ slug: "a", title: "Prev Doc" }}
        next={{ slug: "b", title: "Next Doc" }}
      />
    );
    expect(screen.getByText("Prev Doc")).toBeInTheDocument();
    expect(screen.getByText("Next Doc")).toBeInTheDocument();
  });

  it("renders nothing when no props", () => {
    const { container } = render(<DocNavigation />);
    expect(container.querySelector("nav")).toBeInTheDocument();
  });
});
