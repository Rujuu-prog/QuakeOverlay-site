import { DOC_CATEGORIES } from "@/constants/docs";
import { generateHeadingId } from "@/lib/docs-utils";
import { SNIPPET_CONTEXT_LENGTH, SEARCH_PRIORITY } from "@/constants/search";
import type {
  SearchIndexEntry,
  SearchResult,
  SectionMarker,
  MatchField,
  MatchType,
} from "@/types/search";

// ---------------------------------------------------------------------------
// Normalization
// ---------------------------------------------------------------------------

/**
 * Shared normalization for all search operations.
 * All comparisons, snippet generation, and highlighting must use this.
 */
export function normalizeForSearch(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\u3000/g, " ")
    .replace(/\s+/g, " ");
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

/**
 * Search documents in the index. Returns results sorted by priority:
 * 1. title prefix match
 * 2. title partial match
 * 3. description partial match
 * 4. body partial match
 * Same-priority items keep their original order (category → doc order).
 */
export function searchDocs(
  index: SearchIndexEntry[],
  query: string
): SearchResult[] {
  const normalizedQuery = normalizeForSearch(query);
  if (!normalizedQuery) return [];

  const categoryRank = new Map(DOC_CATEGORIES.map((c, i) => [c.key, i]));

  type ScoredResult = SearchResult & { priority: number; originalIndex: number };
  const scored: ScoredResult[] = [];

  for (let i = 0; i < index.length; i++) {
    const doc = index[i];

    // Skip entries without normalized fields (defensive guard)
    if (
      doc.searchTitle === undefined ||
      doc.searchDescription === undefined ||
      doc.searchBody === undefined
    ) {
      continue;
    }

    let matchField: MatchField | null = null;
    let matchType: MatchType = "partial";
    let priority: number;

    if (doc.searchTitle.startsWith(normalizedQuery)) {
      matchField = "title";
      matchType = "prefix";
      priority = SEARCH_PRIORITY.titlePrefix;
    } else if (doc.searchTitle.includes(normalizedQuery)) {
      matchField = "title";
      matchType = "partial";
      priority = SEARCH_PRIORITY.titlePartial;
    } else if (doc.searchDescription.includes(normalizedQuery)) {
      matchField = "description";
      matchType = "partial";
      priority = SEARCH_PRIORITY.descriptionPartial;
    } else if (doc.searchBody.includes(normalizedQuery)) {
      matchField = "body";
      matchType = "partial";
      priority = SEARCH_PRIORITY.bodyPartial;
    } else {
      continue;
    }

    const snippet =
      matchField === "body"
        ? extractSnippet(doc.body, normalizedQuery, SNIPPET_CONTEXT_LENGTH)
        : "";

    // Determine sectionId for body matches
    let sectionId: string | undefined;
    if (matchField === "body" && doc.sections && doc.sections.length > 0) {
      const matchPos = doc.searchBody.indexOf(normalizedQuery);
      if (matchPos >= 0) {
        // Map normalized position back to body position
        const posMap = buildNormalizedPositionMap(doc.body);
        const origPos = posMap[matchPos] ?? 0;
        // Find the last section with offset <= origPos
        for (let s = doc.sections.length - 1; s >= 0; s--) {
          if (doc.sections[s].offset <= origPos) {
            sectionId = doc.sections[s].id;
            break;
          }
        }
      }
    }

    scored.push({
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      snippet,
      matchField,
      matchType,
      sectionId,
      priority,
      originalIndex: i,
    });
  }

  // Stable sort: priority → category order → original index
  scored.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    const catA = categoryRank.get(a.category) ?? 0;
    const catB = categoryRank.get(b.category) ?? 0;
    if (catA !== catB) return catA - catB;
    return a.originalIndex - b.originalIndex;
  });

  // Strip internal scoring fields
  return scored.map(({ priority: _, originalIndex: __, ...result }) => result);
}

// ---------------------------------------------------------------------------
// Normalized→original position mapping
// ---------------------------------------------------------------------------

/**
 * Build a mapping from normalized text positions to trimmed text positions.
 * Handles whitespace normalization only (fullwidth→halfwidth space + \s+ compression).
 * Does not perform lowercase — callers handle case via normalizeForSearch separately.
 * Returned indices are relative to text.trim(), not the original text.
 *
 * Used by extractSnippet and HighlightedText to map match positions
 * from normalized text back to the original text for display.
 */
export function buildNormalizedPositionMap(text: string): number[] {
  const trimmed = text.trim();
  const positions: number[] = [];
  let origIdx = 0;
  let inWhitespace = false;

  while (origIdx < trimmed.length) {
    const ch = trimmed[origIdx];
    const isWs = /\s/.test(ch) || ch === "\u3000";

    if (isWs) {
      if (!inWhitespace) {
        positions.push(origIdx);
        inWhitespace = true;
      }
      origIdx++;
    } else {
      inWhitespace = false;
      positions.push(origIdx);
      origIdx++;
    }
  }

  return positions;
}

// ---------------------------------------------------------------------------
// Snippet extraction
// ---------------------------------------------------------------------------

/**
 * Extract a text snippet around the first match of `query` in `body`.
 *
 * Rules:
 * - Match detection uses normalizeForSearch on the body
 * - Display uses the original body text at the corresponding position
 * - Always uses the first match for stability
 * - Returns "" for empty/whitespace query or when not found
 */
export function extractSnippet(
  body: string,
  query: string,
  contextLength: number = SNIPPET_CONTEXT_LENGTH
): string {
  const normalizedQuery = normalizeForSearch(query);
  if (!normalizedQuery) return "";
  if (!body) return "";

  const normalizedBody = normalizeForSearch(body);
  const matchIndex = normalizedBody.indexOf(normalizedQuery);
  if (matchIndex === -1) return "";

  const trimmed = body.trim();
  const origPositions = buildNormalizedPositionMap(body);

  // Map normalized match position to original positions
  const origStart = origPositions[matchIndex] ?? 0;
  const origEnd =
    matchIndex + normalizedQuery.length < origPositions.length
      ? origPositions[matchIndex + normalizedQuery.length] ??
        trimmed.length
      : trimmed.length;

  // Calculate context window in original string
  const contextStart = Math.max(0, origStart - contextLength);
  const contextEnd = Math.min(trimmed.length, origEnd + contextLength);

  let snippet = trimmed.slice(contextStart, contextEnd);

  // Add ellipsis
  if (contextStart > 0) {
    snippet = "…" + snippet;
  }
  if (contextEnd < trimmed.length) {
    snippet = snippet + "…";
  }

  return snippet;
}

// ---------------------------------------------------------------------------
// Markdoc AST text extraction
// ---------------------------------------------------------------------------

/**
 * Extract all plain text from a Markdoc AST node tree.
 * Handles Keystatic's { node: { children: [...] } } wrapper format.
 */
export function extractTextFromMarkdocAst(node: unknown): string {
  if (!node || typeof node !== "object") return "";

  const obj = node as Record<string, unknown>;

  // Handle Keystatic wrapper: { node: { ... } }
  if (obj.node && typeof obj.node === "object") {
    return extractTextFromMarkdocAst(obj.node);
  }

  // Text node: { type: "text", attributes: { content: "..." } }
  if (obj.type === "text") {
    const attrs = obj.attributes as Record<string, unknown> | undefined;
    if (attrs?.content && typeof attrs.content === "string") {
      return attrs.content;
    }
    return "";
  }

  // Recurse into children
  if (Array.isArray(obj.children)) {
    return obj.children
      .map((child: unknown) => extractTextFromMarkdocAst(child).trim())
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

// ---------------------------------------------------------------------------
// Section-aware text extraction
// ---------------------------------------------------------------------------

type SectionedText = {
  body: string;
  sections: SectionMarker[];
};

/**
 * Extract text from Markdoc AST with section boundary tracking.
 * Records the offset in the body text where each heading section begins.
 */
export function extractSectionedText(node: unknown): SectionedText {
  if (!node || typeof node !== "object") return { body: "", sections: [] };

  const obj = node as Record<string, unknown>;

  // Handle Keystatic wrapper
  if (obj.node && typeof obj.node === "object") {
    return extractSectionedText(obj.node);
  }

  const parts: string[] = [];
  const sections: SectionMarker[] = [];

  function walk(n: unknown): void {
    if (!n || typeof n !== "object") return;
    const o = n as Record<string, unknown>;

    // Detect heading nodes
    let headingLevel: number | null = null;
    if (o.type === "heading") {
      const attrs = o.attributes as Record<string, unknown> | undefined;
      headingLevel = (attrs?.level as number) ?? null;
    }

    if (headingLevel !== null && headingLevel >= 2 && headingLevel <= 4) {
      const headingText = extractTextFromMarkdocAst(o).trim();
      if (headingText) {
        // Current body length = offset where this section starts
        const currentBody = parts.filter(Boolean).join(" ");
        const offset = currentBody.length > 0 ? currentBody.length + 1 : 0;
        sections.push({
          id: generateHeadingId(headingText),
          offset,
        });
      }
      // Add heading text to body
      const text = extractTextFromMarkdocAst(o).trim();
      if (text) parts.push(text);
      return; // Don't walk into heading children again
    }

    // Text node
    if (o.type === "text") {
      const attrs = o.attributes as Record<string, unknown> | undefined;
      if (attrs?.content && typeof attrs.content === "string") {
        const trimmed = attrs.content.trim();
        if (trimmed) parts.push(trimmed);
      }
      return;
    }

    // Recurse into children
    if (Array.isArray(o.children)) {
      for (const child of o.children) {
        walk(child);
      }
    }
  }

  if (Array.isArray(obj.children)) {
    for (const child of obj.children) {
      walk(child);
    }
  }

  return { body: parts.filter(Boolean).join(" "), sections };
}

