import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import Markdoc from "@markdoc/markdoc";
import { DocRenderer } from "../DocRenderer";

function makeDocument(markdown: string) {
  const ast = Markdoc.parse(markdown);
  return { node: ast };
}

describe("DocRenderer", () => {
  it("renders paragraph content", () => {
    const document = makeDocument("Hello world");
    render(<DocRenderer document={document} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders heading with id attribute", () => {
    const document = makeDocument("## Test Heading");
    render(<DocRenderer document={document} />);
    const heading = screen.getByText("Test Heading");
    expect(heading.tagName).toBe("H2");
    expect(heading).toHaveAttribute("id", "test-heading");
  });

  it("wraps content in doc-content class", () => {
    const document = makeDocument("Content");
    const { container } = render(<DocRenderer document={document} />);
    expect(container.querySelector(".doc-content")).toBeInTheDocument();
  });

  it("renders code blocks with language", () => {
    const document = makeDocument("```js\nconsole.log('hi');\n```");
    const { container } = render(<DocRenderer document={document} />);
    // CodeBlock is a client component, check it renders
    expect(container.querySelector(".doc-content")).toBeInTheDocument();
  });

  it("renders external links with target _blank", () => {
    const document = makeDocument("[example](https://example.com)");
    render(<DocRenderer document={document} />);
    const link = screen.getByText("example");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders internal links without target _blank", () => {
    const document = makeDocument("[docs](/docs/intro)");
    render(<DocRenderer document={document} />);
    const link = screen.getByText("docs");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders image with src and alt", () => {
    const doc = makeDocument("![テスト画像](/images/content/docs/test.png)");
    render(<DocRenderer document={doc} />);
    const img = screen.getByAltText("テスト画像");
    expect(img).toHaveAttribute("src", "/images/content/docs/test.png");
  });

  it("renders image without alt text", () => {
    const doc = makeDocument("![](/images/content/docs/test.png)");
    const { container } = render(<DocRenderer document={doc} />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "/images/content/docs/test.png");
    expect(img).toHaveAttribute("alt", "");
  });

  it("renders GIF image correctly", () => {
    const doc = makeDocument("![demo](/images/content/docs/demo.gif)");
    render(<DocRenderer document={doc} />);
    const img = screen.getByAltText("demo");
    expect(img).toHaveAttribute("src", "/images/content/docs/demo.gif");
  });

  it("renders image with title as figure with caption", () => {
    const doc = makeDocument('![alt](/images/test.png "キャプション")');
    render(<DocRenderer document={doc} />);
    expect(screen.getByText("キャプション")).toBeInTheDocument();
    const figure = screen.getByRole("figure");
    expect(figure).toBeInTheDocument();
  });

  it("applies lazy loading to images", () => {
    const doc = makeDocument("![test](/images/test.png)");
    render(<DocRenderer document={doc} />);
    const img = screen.getByAltText("test");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });
});
