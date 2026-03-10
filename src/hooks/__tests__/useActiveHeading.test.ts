import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useActiveHeading } from "../useActiveHeading";

describe("useActiveHeading", () => {
  it("returns null when no heading IDs provided", () => {
    const { result } = renderHook(() => useActiveHeading([]));
    expect(result.current).toBeNull();
  });

  it("returns null initially with heading IDs", () => {
    const { result } = renderHook(() =>
      useActiveHeading(["section-1", "section-2"])
    );
    // matchMedia mock returns matches: false, so IntersectionObserver is used
    // No intersection has occurred yet
    expect(result.current).toBeNull();
  });
});
