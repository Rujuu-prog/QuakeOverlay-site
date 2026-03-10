import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { DocsSidebarDrawer } from "../DocsSidebarDrawer";
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
  usePathname: () => "/docs",
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
    ],
  },
];

describe("DocsSidebarDrawer", () => {
  it("renders toggle button", () => {
    render(<DocsSidebarDrawer categories={categories} />);
    expect(screen.getByLabelText("Open sidebar")).toBeInTheDocument();
  });

  it("opens drawer on button click", async () => {
    const user = userEvent.setup();
    render(<DocsSidebarDrawer categories={categories} />);

    await user.click(screen.getByLabelText("Open sidebar"));
    expect(screen.getByText("Installation")).toBeInTheDocument();
  });

  it("closes drawer on escape key", async () => {
    const user = userEvent.setup();
    render(<DocsSidebarDrawer categories={categories} />);

    await user.click(screen.getByLabelText("Open sidebar"));
    expect(screen.getByText("Installation")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.getByLabelText("Open sidebar")).toBeInTheDocument();
  });
});
