import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@/test/utils";
import { SearchResults } from "../SearchResults";
import type { SearchResult } from "@/types/search";

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

const results: SearchResult[] = [
  {
    slug: "installation",
    title: "Installation Guide",
    description: "How to install QuakeOverlay",
    category: "getting-started",
    snippet: "",
    matchField: "title",
    matchType: "prefix",
  },
  {
    slug: "dashboard",
    title: "Dashboard",
    description: "Dashboard overview",
    category: "screens",
    snippet: "…shows earthquake information in real…",
    matchField: "body",
    matchType: "partial",
  },
];

describe("SearchResults", () => {
  it("renders result titles as links", () => {
    render(<SearchResults results={results} query="install" />);
    const link = screen.getByRole("link", { name: /Installation Guide/i });
    expect(link).toHaveAttribute("href", "/docs/installation");
  });

  it("renders snippet for body matches", () => {
    render(<SearchResults results={results} query="earthquake" />);
    // Snippet text may be split by <mark>, so use a flexible matcher
    expect(screen.getByText(/shows/)).toBeInTheDocument();
    expect(screen.getByText(/information in real/)).toBeInTheDocument();
  });

  it("renders category name", () => {
    render(<SearchResults results={results} query="install" />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
  });

  it("shows body match label for body matches", () => {
    render(<SearchResults results={results} query="earthquake" />);
    expect(screen.getByText(/Match in body/)).toBeInTheDocument();
  });

  it("does not show snippet for title matches", () => {
    render(
      <SearchResults
        results={[results[0]]}
        query="install"
      />
    );
    expect(screen.queryByText(/Match in body/)).not.toBeInTheDocument();
  });

  it("highlights matched text in title with mark element", () => {
    render(<SearchResults results={results} query="install" />);
    const marks = document.querySelectorAll("mark");
    const matchMark = Array.from(marks).find((m) =>
      m.textContent?.toLowerCase().includes("install")
    );
    expect(matchMark).toBeTruthy();
  });

  it("shows no results message with hint when results are empty", () => {
    render(<SearchResults results={[]} query="nonexistent" />);
    expect(screen.getByText("No documents found")).toBeInTheDocument();
    expect(
      screen.getByText(/Try a different or shorter keyword/)
    ).toBeInTheDocument();
  });

  it("does not render anything when query is empty", () => {
    const { container } = render(<SearchResults results={[]} query="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders result count", () => {
    render(<SearchResults results={results} query="install" />);
    expect(screen.getByText("2 results")).toBeInTheDocument();
  });
});
