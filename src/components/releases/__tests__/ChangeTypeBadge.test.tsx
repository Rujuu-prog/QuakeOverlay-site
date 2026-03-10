import { describe, it, expect } from "vitest";
import { render, screen } from "@/test/utils";
import { ChangeTypeBadge } from "../ChangeTypeBadge";
import { CHANGE_TYPE_CONFIGS } from "@/constants/releases";
import type { ChangeType } from "@/types/releases";

describe("ChangeTypeBadge", () => {
  const types: ChangeType[] = ["feature", "improvement", "fix", "breaking"];

  it.each(types)("renders %s badge with correct label", (type) => {
    render(<ChangeTypeBadge type={type} />);
    const expectedLabels: Record<ChangeType, string> = {
      feature: "Feature",
      improvement: "Improvement",
      fix: "Fix",
      breaking: "Breaking",
    };
    expect(screen.getByText(expectedLabels[type])).toBeInTheDocument();
  });

  it.each(types)("applies correct color style for %s", (type) => {
    render(<ChangeTypeBadge type={type} />);
    const config = CHANGE_TYPE_CONFIGS[type];
    const badge = screen.getByText(
      type === "feature"
        ? "Feature"
        : type === "improvement"
          ? "Improvement"
          : type === "fix"
            ? "Fix"
            : "Breaking"
    );
    expect(badge).toHaveStyle({ color: config.color });
    expect(badge).toHaveStyle({ backgroundColor: config.bgColor });
  });
});
