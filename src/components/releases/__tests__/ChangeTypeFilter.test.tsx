import { describe, it, expect, vi } from "vitest";
import { render, screen, userEvent } from "@/test/utils";
import { ChangeTypeFilter } from "../ChangeTypeFilter";

describe("ChangeTypeFilter", () => {
  it("renders all filter buttons including 'All'", () => {
    render(<ChangeTypeFilter activeFilter={null} onFilterChange={() => {}} />);
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByText("Improvement")).toBeInTheDocument();
    expect(screen.getByText("Fix")).toBeInTheDocument();
    expect(screen.getByText("Breaking")).toBeInTheDocument();
  });

  it("highlights 'All' button when no filter is active", () => {
    render(<ChangeTypeFilter activeFilter={null} onFilterChange={() => {}} />);
    const allButton = screen.getByText("All");
    expect(allButton).toHaveAttribute("aria-pressed", "true");
  });

  it("highlights active filter button", () => {
    render(
      <ChangeTypeFilter activeFilter="feature" onFilterChange={() => {}} />
    );
    const featureButton = screen.getByText("Feature");
    expect(featureButton).toHaveAttribute("aria-pressed", "true");
    const allButton = screen.getByText("All");
    expect(allButton).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onFilterChange with null when 'All' is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ChangeTypeFilter activeFilter="feature" onFilterChange={onChange} />
    );
    await user.click(screen.getByText("All"));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("calls onFilterChange with type when a type button is clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ChangeTypeFilter activeFilter={null} onFilterChange={onChange} />);
    await user.click(screen.getByText("Fix"));
    expect(onChange).toHaveBeenCalledWith("fix");
  });
});
