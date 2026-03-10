import { describe, it, expect } from "vitest";
import {
  generateHeadingId,
  groupDocsByCategory,
  sortDocs,
  getAdjacentDocs,
} from "../docs-utils";
import type { DocEntry } from "@/types/docs";

describe("generateHeadingId", () => {
  it("converts text to lowercase URL-safe ID", () => {
    expect(generateHeadingId("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(generateHeadingId("What's New?")).toBe("whats-new");
  });

  it("handles Japanese text", () => {
    expect(generateHeadingId("はじめに")).toBe("はじめに");
  });

  it("trims leading and trailing hyphens", () => {
    expect(generateHeadingId("  hello  ")).toBe("hello");
  });

  it("collapses multiple hyphens", () => {
    expect(generateHeadingId("hello   world")).toBe("hello-world");
  });
});

describe("sortDocs", () => {
  const docs: DocEntry[] = [
    {
      slug: "b",
      title: "B",
      description: "",
      category: "screens",
      order: 1,
      locale: "ja",
    },
    {
      slug: "a",
      title: "A",
      description: "",
      category: "getting-started",
      order: 0,
      locale: "ja",
    },
    {
      slug: "c",
      title: "C",
      description: "",
      category: "getting-started",
      order: 1,
      locale: "ja",
    },
  ];

  it("sorts by category order then by order field", () => {
    const sorted = sortDocs(docs);
    expect(sorted.map((d) => d.slug)).toEqual(["a", "c", "b"]);
  });
});

describe("groupDocsByCategory", () => {
  const docs: DocEntry[] = [
    {
      slug: "a",
      title: "A",
      description: "",
      category: "getting-started",
      order: 0,
      locale: "ja",
    },
    {
      slug: "b",
      title: "B",
      description: "",
      category: "screens",
      order: 0,
      locale: "ja",
    },
    {
      slug: "c",
      title: "C",
      description: "",
      category: "getting-started",
      order: 1,
      locale: "ja",
    },
  ];

  it("groups docs by category in order", () => {
    const groups = groupDocsByCategory(docs);
    expect(groups).toHaveLength(2);
    expect(groups[0].category).toBe("getting-started");
    expect(groups[0].items).toHaveLength(2);
    expect(groups[1].category).toBe("screens");
    expect(groups[1].items).toHaveLength(1);
  });

  it("returns empty array for empty input", () => {
    expect(groupDocsByCategory([])).toEqual([]);
  });
});

describe("getAdjacentDocs", () => {
  const docs: DocEntry[] = [
    {
      slug: "a",
      title: "A",
      description: "",
      category: "getting-started",
      order: 0,
      locale: "ja",
    },
    {
      slug: "b",
      title: "B",
      description: "",
      category: "getting-started",
      order: 1,
      locale: "ja",
    },
    {
      slug: "c",
      title: "C",
      description: "",
      category: "screens",
      order: 0,
      locale: "ja",
    },
  ];

  it("returns prev and next for middle item", () => {
    const { prev, next } = getAdjacentDocs("b", docs);
    expect(prev).toEqual({ slug: "a", title: "A" });
    expect(next).toEqual({ slug: "c", title: "C" });
  });

  it("returns no prev for first item", () => {
    const { prev, next } = getAdjacentDocs("a", docs);
    expect(prev).toBeUndefined();
    expect(next).toEqual({ slug: "b", title: "B" });
  });

  it("returns no next for last item", () => {
    const { prev, next } = getAdjacentDocs("c", docs);
    expect(prev).toEqual({ slug: "b", title: "B" });
    expect(next).toBeUndefined();
  });

  it("returns both undefined for unknown slug", () => {
    const { prev, next } = getAdjacentDocs("unknown", docs);
    expect(prev).toBeUndefined();
    expect(next).toBeUndefined();
  });
});
