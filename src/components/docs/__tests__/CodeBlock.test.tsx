import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { CodeBlock } from "../CodeBlock";

describe("CodeBlock", () => {
  it("renders code content in pre/code fallback", () => {
    render(<CodeBlock>const x = 1;</CodeBlock>);
    expect(screen.getByText("const x = 1;")).toBeInTheDocument();
  });

  it("displays language label when provided", () => {
    render(<CodeBlock language="typescript">const x = 1;</CodeBlock>);
    expect(screen.getByText("typescript")).toBeInTheDocument();
  });

  it("includes copy button", () => {
    render(<CodeBlock>code</CodeBlock>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
