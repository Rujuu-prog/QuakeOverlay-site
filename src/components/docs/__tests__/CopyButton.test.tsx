import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent, waitFor } from "@/test/utils";
import { CopyButton } from "../CopyButton";

vi.stubGlobal("navigator", {
  ...window.navigator,
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(""),
  },
});

describe("CopyButton", () => {
  it("renders copy button with copy label", () => {
    render(<CopyButton text="hello" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByLabelText("Copy code")).toBeInTheDocument();
  });

  it("shows copied feedback after clicking", async () => {
    const user = userEvent.setup();
    render(<CopyButton text="hello world" />);

    await user.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(screen.getByLabelText("Copied")).toBeInTheDocument();
    });
  });
});
