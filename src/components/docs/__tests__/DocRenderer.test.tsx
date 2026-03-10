import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test/utils";
import { DocRenderer } from "../DocRenderer";

// Mock DocumentRenderer to avoid Keystatic internal structure issues
vi.mock("@keystatic/core/renderer", () => ({
  DocumentRenderer: ({
    document: doc,
    renderers,
  }: {
    document: Array<{
      name: string;
      attributes?: Record<string, unknown>;
      children: unknown[];
    }>;
    renderers: {
      block: Record<
        string,
        (props: Record<string, unknown>) => React.ReactNode
      >;
      inline: Record<
        string,
        (props: Record<string, unknown>) => React.ReactNode
      >;
    };
  }) => {
    return (
      <div data-testid="document-renderer">
        {doc.map((node, i) => {
          if (node.name === "paragraph") {
            return <p key={i}>{node.children[0] as string}</p>;
          }
          if (node.name === "heading" && renderers?.block?.heading) {
            return renderers.block.heading({
              level: (node.attributes?.level as number) ?? 2,
              children: node.children[0] as string,
            });
          }
          return null;
        })}
      </div>
    );
  },
}));

describe("DocRenderer", () => {
  it("renders paragraph content", () => {
    const document = [
      {
        name: "paragraph" as const,
        children: ["Hello world"],
      },
    ];
    render(<DocRenderer document={document as never} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders heading with id attribute", () => {
    const document = [
      {
        name: "heading" as const,
        attributes: { level: 2 },
        children: ["Test Heading"],
      },
    ];
    render(<DocRenderer document={document as never} />);
    const heading = screen.getByText("Test Heading");
    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveAttribute("id", "test-heading");
  });

  it("wraps content in doc-content class", () => {
    const document = [
      {
        name: "paragraph" as const,
        children: ["Content"],
      },
    ];
    const { container } = render(
      <DocRenderer document={document as never} />
    );
    expect(container.querySelector(".doc-content")).toBeInTheDocument();
  });
});
