import { describe, it, expect } from "vitest";
import {
  normalizeForSearch,
  buildNormalizedPositionMap,
  searchDocs,
  extractSnippet,
  extractTextFromMarkdocAst,
} from "../search";
import { SNIPPET_CONTEXT_LENGTH } from "@/constants/search";
import type { SearchIndexEntry } from "@/types/search";

// ---------------------------------------------------------------------------
// Helper: create a SearchIndexEntry with normalizeForSearch applied
// ---------------------------------------------------------------------------
function entry(
  overrides: Partial<Omit<SearchIndexEntry, "searchTitle" | "searchDescription" | "searchBody">> & {
    slug: string;
    title: string;
  }
): SearchIndexEntry {
  const {
    slug,
    title,
    description = "",
    category = "getting-started",
    body = "",
  } = overrides;
  return {
    slug,
    title,
    description,
    category,
    body,
    searchTitle: normalizeForSearch(title),
    searchDescription: normalizeForSearch(description),
    searchBody: normalizeForSearch(body),
  };
}

// ===========================================================================
// normalizeForSearch
// ===========================================================================
describe("normalizeForSearch", () => {
  it("trims leading and trailing whitespace", () => {
    expect(normalizeForSearch("  hello  ")).toBe("hello");
  });

  it("converts uppercase to lowercase", () => {
    expect(normalizeForSearch("Hello World")).toBe("hello world");
  });

  it("normalizes full-width spaces to half-width", () => {
    expect(normalizeForSearch("hello\u3000world")).toBe("hello world");
  });

  it("compresses consecutive whitespace", () => {
    expect(normalizeForSearch("hello   world")).toBe("hello world");
  });

  it("handles combined normalization", () => {
    expect(normalizeForSearch("  Hello\u3000\u3000World  ")).toBe("hello world");
  });

  it("returns empty string for empty input", () => {
    expect(normalizeForSearch("")).toBe("");
  });

  it("leaves CJK characters unchanged", () => {
    expect(normalizeForSearch("地震情報")).toBe("地震情報");
  });
});

// ===========================================================================
// searchDocs
// ===========================================================================
describe("searchDocs", () => {
  const index: SearchIndexEntry[] = [
    entry({
      slug: "installation",
      title: "Installation Guide",
      description: "How to install QuakeOverlay",
      category: "getting-started",
      body: "Download the ZIP file and extract it to a folder.",
    }),
    entry({
      slug: "dashboard",
      title: "Dashboard",
      description: "Overview of the dashboard screen",
      category: "screens",
      body: "The dashboard shows earthquake information in real time.",
    }),
    entry({
      slug: "faq",
      title: "FAQ",
      description: "Frequently asked questions",
      category: "faq",
      body: "Q: How do I install QuakeOverlay? A: Download from Booth.",
    }),
    entry({
      slug: "ja-installation",
      title: "インストール方法",
      description: "QuakeOverlayのダウンロードとセットアップ手順",
      category: "getting-started",
      body: "ZIPファイルを任意のフォルダに展開してください。地震情報を表示するためのツールです。",
    }),
    entry({
      slug: "ko-installation",
      title: "설치 방법",
      description: "QuakeOverlay 다운로드 및 설정 절차",
      category: "getting-started",
      body: "ZIP 파일을 원하는 폴더에 압축 해제하세요.",
    }),
  ];

  it("returns empty array for empty query", () => {
    expect(searchDocs(index, "")).toEqual([]);
  });

  it("returns empty array for whitespace-only query", () => {
    expect(searchDocs(index, "   ")).toEqual([]);
  });

  it("matches documents by title", () => {
    const results = searchDocs(index, "Dashboard");
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe("dashboard");
    expect(results[0].matchField).toBe("title");
  });

  it("matches documents by description", () => {
    const results = searchDocs(index, "Frequently asked");
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe("faq");
    expect(results[0].matchField).toBe("description");
  });

  it("matches documents by body", () => {
    const results = searchDocs(index, "earthquake information");
    const bodyMatch = results.find((r) => r.slug === "dashboard");
    expect(bodyMatch).toBeDefined();
    expect(bodyMatch!.matchField).toBe("body");
    expect(bodyMatch!.snippet).not.toBe("");
  });

  it("returns no results for non-matching query", () => {
    expect(searchDocs(index, "xyznonexistent")).toEqual([]);
  });

  // --- Priority ordering ---

  it("ranks title prefix match above title partial match", () => {
    const results = searchDocs(index, "Install");
    // "Installation Guide" starts with "Install" -> prefix
    // "インストール方法" does not start with "install" (CJK)
    const installGuide = results.find((r) => r.slug === "installation");
    expect(installGuide).toBeDefined();
    expect(installGuide!.matchField).toBe("title");
    expect(installGuide!.matchType).toBe("prefix");
  });

  it("ranks title match above description match", () => {
    const results = searchDocs(index, "Dashboard");
    // "Dashboard" is both title match and description includes "dashboard"
    expect(results[0].slug).toBe("dashboard");
    expect(results[0].matchField).toBe("title");
  });

  it("ranks title match above body match", () => {
    const testIndex: SearchIndexEntry[] = [
      entry({
        slug: "doc-body",
        title: "Other Doc",
        description: "",
        body: "This doc mentions earthquake info.",
      }),
      entry({
        slug: "doc-title",
        title: "Earthquake Info",
        description: "",
        body: "Some other content.",
      }),
    ];
    const results = searchDocs(testIndex, "earthquake");
    expect(results[0].slug).toBe("doc-title");
    expect(results[0].matchField).toBe("title");
  });

  it("ranks description match above body match", () => {
    const testIndex: SearchIndexEntry[] = [
      entry({
        slug: "doc-body",
        title: "Doc A",
        description: "No relevant info here",
        body: "Contains the keyword overlay in body.",
      }),
      entry({
        slug: "doc-desc",
        title: "Doc B",
        description: "About the overlay system",
        body: "No relevant info.",
      }),
    ];
    const results = searchDocs(testIndex, "overlay");
    expect(results[0].slug).toBe("doc-desc");
    expect(results[0].matchField).toBe("description");
  });

  it("uses stable sort for same-priority results (category order then doc order)", () => {
    const testIndex: SearchIndexEntry[] = [
      entry({
        slug: "screens-doc",
        title: "Doc Alpha",
        category: "screens",
        body: "Contains keyword test.",
      }),
      entry({
        slug: "start-doc",
        title: "Doc Beta",
        category: "getting-started",
        body: "Contains keyword test.",
      }),
    ];
    const results = searchDocs(testIndex, "test");
    // getting-started comes before screens in category order
    expect(results[0].slug).toBe("start-doc");
    expect(results[1].slug).toBe("screens-doc");
  });

  // --- Case insensitivity ---

  it("is case-insensitive for English queries", () => {
    const results = searchDocs(index, "DASHBOARD");
    expect(results).toHaveLength(1);
    expect(results[0].slug).toBe("dashboard");
  });

  // --- CJK support ---

  it("matches Japanese text by partial match", () => {
    const results = searchDocs(index, "地震");
    const jaDoc = results.find((r) => r.slug === "ja-installation");
    expect(jaDoc).toBeDefined();
  });

  it("matches Korean text by partial match", () => {
    const results = searchDocs(index, "설치");
    const koDoc = results.find((r) => r.slug === "ko-installation");
    expect(koDoc).toBeDefined();
  });

  // --- Full-width / half-width space tolerance ---

  it("treats full-width and half-width spaces equivalently in queries", () => {
    const results1 = searchDocs(index, "Installation Guide");
    const results2 = searchDocs(index, "Installation\u3000Guide");
    expect(results1).toHaveLength(results2.length);
    expect(results1[0].slug).toBe(results2[0].slug);
  });

  // --- snippet only for body matches ---

  it("returns empty snippet for title matches", () => {
    const results = searchDocs(index, "Dashboard");
    expect(results[0].matchField).toBe("title");
    expect(results[0].snippet).toBe("");
  });

  it("returns empty snippet for description matches", () => {
    const results = searchDocs(index, "Frequently asked");
    expect(results[0].matchField).toBe("description");
    expect(results[0].snippet).toBe("");
  });

  it("returns non-empty snippet for body matches", () => {
    const results = searchDocs(index, "ZIP file");
    const bodyMatch = results.find((r) => r.matchField === "body");
    expect(bodyMatch).toBeDefined();
    expect(bodyMatch!.snippet.length).toBeGreaterThan(0);
  });
});

// ===========================================================================
// extractSnippet
// ===========================================================================
describe("extractSnippet", () => {
  const longText =
    "This is a long text that contains various keywords. " +
    "The earthquake monitoring system detects seismic activity. " +
    "It provides real-time alerts to users who are streaming.";

  it("returns text around the match position", () => {
    const snippet = extractSnippet(longText, "earthquake", SNIPPET_CONTEXT_LENGTH);
    expect(snippet).toContain("earthquake");
  });

  it("adds ellipsis when match is not at the start", () => {
    const snippet = extractSnippet(longText, "earthquake", SNIPPET_CONTEXT_LENGTH);
    expect(snippet.startsWith("…")).toBe(true);
  });

  it("adds ellipsis when match is not at the end", () => {
    const snippet = extractSnippet(longText, "earthquake", SNIPPET_CONTEXT_LENGTH);
    expect(snippet.endsWith("…")).toBe(true);
  });

  it("does not add leading ellipsis when match is near the start", () => {
    const snippet = extractSnippet(longText, "This is", SNIPPET_CONTEXT_LENGTH);
    expect(snippet.startsWith("…")).toBe(false);
  });

  it("does not add trailing ellipsis when match is near the end", () => {
    const snippet = extractSnippet(longText, "streaming", SNIPPET_CONTEXT_LENGTH);
    expect(snippet.endsWith("…")).toBe(false);
  });

  it("returns empty string for empty query", () => {
    expect(extractSnippet(longText, "", SNIPPET_CONTEXT_LENGTH)).toBe("");
  });

  it("returns empty string for whitespace-only query", () => {
    expect(extractSnippet(longText, "   ", SNIPPET_CONTEXT_LENGTH)).toBe("");
  });

  it("returns empty string when query is not found in text", () => {
    expect(extractSnippet(longText, "xyznotfound", SNIPPET_CONTEXT_LENGTH)).toBe("");
  });

  it("handles short text without crashing", () => {
    const snippet = extractSnippet("hi", "hi", SNIPPET_CONTEXT_LENGTH);
    expect(snippet).toBe("hi");
  });

  it("handles empty body text", () => {
    expect(extractSnippet("", "query", SNIPPET_CONTEXT_LENGTH)).toBe("");
  });

  it("uses the first match when query appears multiple times", () => {
    const text = "AAA earthquake BBB earthquake CCC";
    const snippet = extractSnippet(text, "earthquake", 5);
    // The first occurrence at position 4 should be used
    expect(snippet).toContain("earthquake");
    // Should contain context around first match, including "AAA"
    expect(snippet).toContain("AAA");
  });

  it("works with Japanese text", () => {
    const jaText = "QuakeOverlayは地震情報を自動で取得するツールです。";
    const snippet = extractSnippet(jaText, "地震情報", SNIPPET_CONTEXT_LENGTH);
    expect(snippet).toContain("地震情報");
  });

  it("handles text with newlines and tabs correctly", () => {
    const text = "First line\n\tSecond\tline\n\nThird line with keyword here";
    const snippet = extractSnippet(text, "keyword", 10);
    expect(snippet).toContain("keyword");
  });

  it("handles text with consecutive whitespace around match", () => {
    const text = "before   keyword   after";
    const snippet = extractSnippet(text, "keyword", 5);
    expect(snippet).toContain("keyword");
  });
});

// ===========================================================================
// buildNormalizedPositionMap
// ===========================================================================
describe("buildNormalizedPositionMap", () => {
  it("maps simple text positions correctly", () => {
    const positions = buildNormalizedPositionMap("hello");
    expect(positions).toEqual([0, 1, 2, 3, 4]);
  });

  it("compresses consecutive whitespace into single position", () => {
    const positions = buildNormalizedPositionMap("a   b");
    // normalized: "a b" (3 chars)
    // positions: a→0, space→1, b→4
    expect(positions).toHaveLength(3);
    expect(positions[0]).toBe(0); // 'a'
    expect(positions[1]).toBe(1); // first space
    expect(positions[2]).toBe(4); // 'b'
  });

  it("handles full-width spaces", () => {
    const positions = buildNormalizedPositionMap("a\u3000b");
    // normalized: "a b" (3 chars)
    expect(positions).toHaveLength(3);
    expect(positions[0]).toBe(0); // 'a'
    expect(positions[1]).toBe(1); // fullwidth space
    expect(positions[2]).toBe(2); // 'b'
  });

  it("handles newlines and tabs", () => {
    const positions = buildNormalizedPositionMap("a\n\tb");
    // normalized: "a b" (3 chars)
    expect(positions).toHaveLength(3);
    expect(positions[0]).toBe(0); // 'a'
    expect(positions[1]).toBe(1); // newline (first ws)
    expect(positions[2]).toBe(3); // 'b'
  });

  it("trims leading and trailing whitespace", () => {
    const positions = buildNormalizedPositionMap("  hello  ");
    // trimmed: "hello", normalized: "hello" (5 chars)
    expect(positions).toHaveLength(5);
    expect(positions[0]).toBe(0);
  });

  it("returns empty array for empty string", () => {
    expect(buildNormalizedPositionMap("")).toEqual([]);
  });

  it("returns empty array for whitespace-only string", () => {
    expect(buildNormalizedPositionMap("   ")).toEqual([]);
  });
});

// ===========================================================================
// extractTextFromMarkdocAst
// ===========================================================================
describe("extractTextFromMarkdocAst", () => {
  it("extracts text from a simple text node", () => {
    const ast = {
      type: "text",
      attributes: { content: "Hello world" },
    };
    expect(extractTextFromMarkdocAst(ast)).toBe("Hello world");
  });

  it("extracts text from nested children", () => {
    const ast = {
      type: "paragraph",
      children: [
        { type: "text", attributes: { content: "Hello" } },
        { type: "text", attributes: { content: "world" } },
      ],
    };
    expect(extractTextFromMarkdocAst(ast)).toBe("Hello world");
  });

  it("extracts text from heading nodes", () => {
    const ast = {
      type: "heading",
      attributes: { level: 2 },
      children: [
        { type: "text", attributes: { content: "My Heading" } },
      ],
    };
    expect(extractTextFromMarkdocAst(ast)).toBe("My Heading");
  });

  it("extracts text from deeply nested structure", () => {
    const ast = {
      type: "document",
      children: [
        {
          type: "paragraph",
          children: [
            { type: "text", attributes: { content: "First " } },
            {
              type: "strong",
              children: [
                { type: "text", attributes: { content: "bold" } },
              ],
            },
            { type: "text", attributes: { content: " text" } },
          ],
        },
        {
          type: "paragraph",
          children: [
            { type: "text", attributes: { content: "Second paragraph" } },
          ],
        },
      ],
    };
    expect(extractTextFromMarkdocAst(ast)).toContain("First");
    expect(extractTextFromMarkdocAst(ast)).toContain("bold");
    expect(extractTextFromMarkdocAst(ast)).toContain("text");
    expect(extractTextFromMarkdocAst(ast)).toContain("Second paragraph");
  });

  it("handles Keystatic node wrapper format", () => {
    const ast = {
      node: {
        type: "document",
        children: [
          {
            type: "paragraph",
            children: [
              { type: "text", attributes: { content: "Wrapped content" } },
            ],
          },
        ],
      },
    };
    expect(extractTextFromMarkdocAst(ast)).toContain("Wrapped content");
  });

  it("returns empty string for null/undefined", () => {
    expect(extractTextFromMarkdocAst(null)).toBe("");
    expect(extractTextFromMarkdocAst(undefined)).toBe("");
  });

  it("returns empty string for empty object", () => {
    expect(extractTextFromMarkdocAst({})).toBe("");
  });
});
