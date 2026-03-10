import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { Sidebar } from "../Sidebar";
import type { SidebarCategory } from "@/types/docs";

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
