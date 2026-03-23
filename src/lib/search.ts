import { DOC_CATEGORIES } from "@/constants/docs";
import { SNIPPET_CONTEXT_LENGTH, SEARCH_PRIORITY } from "@/constants/search";
import type {
  SearchIndexEntry,
  SearchResult,
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

  const categoryOrder = DOC_CATEGORIES.map((c) => c.key);

  type ScoredResult = SearchResult & { priority: number; originalIndex: number };
  const scored: ScoredResult[] = [];

  for (let i = 0; i < index.length; i++) {
    const doc = index[i];
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

    scored.push({
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      category: doc.category,
      snippet,
      matchField,
      matchType,
      priority,
      originalIndex: i,
    });
  }

  // Stable sort: priority → category order → original index
  scored.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    const catA = categoryOrder.indexOf(a.category);
    const catB = categoryOrder.indexOf(b.category);
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
 * Build a mapping from normalized text positions to original text positions.
 * Follows the same rules as normalizeForSearch:
 * trim + lowercase + fullwidth→halfwidth space + \s+ compression.
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
      .map((child: unknown) => extractTextFromMarkdocAst(child))
      .filter(Boolean)
      .join(" ");
  }

  return "";
}

