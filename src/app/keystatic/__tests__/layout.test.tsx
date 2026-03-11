import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import React from "react";

const mockNotFound = vi.fn();
vi.mock("next/navigation", () => ({
  notFound: mockNotFound,
}));

describe("KeystaticLayout", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  it("calls notFound() when NODE_ENV is production", async () => {
    process.env.NODE_ENV = "production";
    const { default: KeystaticLayout } = await import("../layout");
    KeystaticLayout({ children: React.createElement("div", null, "test") });
    expect(mockNotFound).toHaveBeenCalled();
  });

  it("renders children when NODE_ENV is not production", async () => {
    process.env.NODE_ENV = "development";
    const { default: KeystaticLayout } = await import("../layout");
    const result = KeystaticLayout({
      children: React.createElement("div", null, "test"),
    });
    expect(mockNotFound).not.toHaveBeenCalled();
    expect(result).toBeTruthy();
  });
});
