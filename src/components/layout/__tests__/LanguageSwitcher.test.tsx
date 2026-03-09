import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { LanguageSwitcher } from "../LanguageSwitcher";

const mockReplace = vi.fn();

vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => "/",
}));

vi.mock("next-intl", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-intl")>();
  return {
    ...actual,
    useLocale: () => "en",
  };
});

describe("LanguageSwitcher", () => {
  it("renders trigger button", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole("button", { name: /language/i })).toBeInTheDocument();
  });

  it("shows current language label", () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("opens dropdown on click", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByRole("button", { name: /language/i }));
    expect(screen.getByText("日本語")).toBeInTheDocument();
    expect(screen.getByText("한국어")).toBeInTheDocument();
  });

  it("closes dropdown on Escape key", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByRole("button", { name: /language/i }));
    expect(screen.getByText("日本語")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("日本語")).not.toBeInTheDocument();
  });

  it("switches locale on language selection", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    await user.click(screen.getByRole("button", { name: /language/i }));
    await user.click(screen.getByText("日本語"));

    expect(mockReplace).toHaveBeenCalledWith("/", { locale: "ja" });
  });

  it("has aria-expanded attribute", async () => {
    const user = userEvent.setup();
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /language/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
  });
});
