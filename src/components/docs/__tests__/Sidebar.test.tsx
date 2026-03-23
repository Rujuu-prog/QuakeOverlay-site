import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { Sidebar } from "../Sidebar";
import type { SidebarCategory } from "@/types/docs";
import type { SearchIndexData } from "@/types/search";

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

const categories: SidebarCategory[] = [
  {
    category: "getting-started",
    items: [
      {
        slug: "installation",
        title: "Installation",
        description: "",
        category: "getting-started",
        order: 0,
        locale: "en",
      },
      {
        slug: "initial-setup",
        title: "Initial Setup",
        description: "",
        category: "getting-started",
        order: 1,
        locale: "en",
      },
    ],
  },
  {
    category: "screens",
    items: [
      {
        slug: "main-screen",
        title: "Main Screen",
        description: "",
        category: "screens",
        order: 0,
        locale: "en",
      },
    ],
  },
];

describe("Sidebar", () => {
  it("renders category headings", () => {
    render(<Sidebar categories={categories} />);
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Screens")).toBeInTheDocument();
  });

  it("renders document links", () => {
    render(<Sidebar categories={categories} />);
    expect(screen.getByText("Installation")).toBeInTheDocument();
    expect(screen.getByText("Main Screen")).toBeInTheDocument();
  });

  it("highlights active page", () => {
    render(<Sidebar categories={categories} currentSlug="installation" />);
    const activeLink = screen.getByText("Installation").closest("a");
    expect(activeLink).toHaveClass("text-accent");
  });

  it("filters by search query", async () => {
    const user = userEvent.setup();
    render(<Sidebar categories={categories} />);

    const searchInput = screen.getByPlaceholderText("Search docs…");
    await user.type(searchInput, "Main");

    expect(screen.getByText("Main Screen")).toBeInTheDocument();
    expect(screen.queryByText("Installation")).not.toBeInTheDocument();
  });

  it("shows no results message when search has no matches", async () => {
    const user = userEvent.setup();
    render(<Sidebar categories={categories} />);

    const searchInput = screen.getByPlaceholderText("Search docs…");
    await user.type(searchInput, "nonexistent");

    expect(screen.getByText("No documents found")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Fulltext search with searchIndex
// ---------------------------------------------------------------------------
const searchIndex: SearchIndexData[] = [
  {
    slug: "installation",
    title: "Installation",
    description: "How to install the app",
    category: "getting-started",
    body: "Download the ZIP file and extract it to a folder on your computer.",
  },
  {
    slug: "main-screen",
    title: "Main Screen",
    description: "Overview of the main screen",
    category: "screens",
    body: "The main screen displays earthquake information in real time.",
  },
];

describe("Sidebar - fulltext search", () => {
  it("shows fulltext search results when searchIndex is provided and query matches body", async () => {
    const user = userEvent.setup();
    render(
      <Sidebar categories={categories} searchIndex={searchIndex} />
    );

    const searchInput = screen.getByPlaceholderText("Search docs…");
    await user.type(searchInput, "earthquake");

    // Should show the result from body match
    expect(
      screen.getByRole("link", { name: /Main Screen/i })
    ).toBeInTheDocument();
    // Should show "Match in body" label
    expect(screen.getByText(/Match in body/)).toBeInTheDocument();
  });

  it("falls back to title filtering when searchIndex is not provided", async () => {
    const user = userEvent.setup();
    render(<Sidebar categories={categories} />);

    const searchInput = screen.getByPlaceholderText("Search docs…");
    await user.type(searchInput, "Main");

    // Title filter should still work
    expect(screen.getByText("Main Screen")).toBeInTheDocument();
    expect(screen.queryByText("Installation")).not.toBeInTheDocument();
  });

  it("shows category list when query is empty with searchIndex", () => {
    render(
      <Sidebar categories={categories} searchIndex={searchIndex} />
    );

    // Should display category headings
    expect(screen.getByText("Getting Started")).toBeInTheDocument();
    expect(screen.getByText("Screens")).toBeInTheDocument();
  });

  it("shows no results with hint when fulltext search finds nothing", async () => {
    const user = userEvent.setup();
    render(
      <Sidebar categories={categories} searchIndex={searchIndex} />
    );

    const searchInput = screen.getByPlaceholderText("Search docs…");
    await user.type(searchInput, "xyznonexistent");

    expect(screen.getByText("No documents found")).toBeInTheDocument();
    expect(
      screen.getByText(/Try a different or shorter keyword/)
    ).toBeInTheDocument();
  });
});
