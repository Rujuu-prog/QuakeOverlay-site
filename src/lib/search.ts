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

    // For body matches, compute position map once for both snippet and sectionId
    let snippet = "";
    let sectionId: string | undefined;
    if (matchField === "body") {
      const matchPos = doc.searchBody.indexOf(normalizedQuery);
      if (matchPos >= 0) {
        const posMap = buildNormalizedPositionMap(doc.body);

        snippet = buildSnippetFromMap(
          doc.body.trim(),
          posMap,
          matchPos,
          normalizedQuery.length,
          SNIPPET_CONTEXT_LENGTH
        );

        if (doc.sections && doc.sections.length > 0) {
          const origPos = posMap[matchPos] ?? 0;
          for (let s = doc.sections.length - 1; s >= 0; s--) {
            if (doc.sections[s].offset <= origPos) {
              sectionId = doc.sections[s].id;
              break;
            }
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
 * Build a snippet from pre-computed position map and match location.
 * Shared by extractSnippet (public API) and searchDocs (avoids duplicate
 * position map computation).
 */
function buildSnippetFromMap(
  trimmedBody: string,
  positionMap: number[],
  matchIndex: number,
  matchLength: number,
  contextLength: number
): string {
  const origStart = positionMap[matchIndex] ?? 0;
  const origEnd =
    matchIndex + matchLength < positionMap.length
      ? positionMap[matchIndex + matchLength] ?? trimmedBody.length
      : trimmedBody.length;

  const contextStart = Math.max(0, origStart - contextLength);
  const contextEnd = Math.min(trimmedBody.length, origEnd + contextLength);

  let snippet = trimmedBody.slice(contextStart, contextEnd);

  if (contextStart > 0) {
    snippet = "…" + snippet;
  }
  if (contextEnd < trimmedBody.length) {
    snippet = snippet + "…";
  }

  return snippet;
}

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

  const positionMap = buildNormalizedPositionMap(body);
  return buildSnippetFromMap(
    body.trim(),
    positionMap,
    matchIndex,
    normalizedQuery.length,
    contextLength
  );
}

// ---------------------------------------------------------------------------
// Markdoc AST text extraction
// ---------------------------------------------------------------------------

const BLOCK_TYPES = new Set([
  "paragraph",
  "heading",
  "list",
  "item",
  "blockquote",
  "hr",
  "fence",
  "table",
  "thead",
  "tbody",
  "tr",
  "td",
  "th",
]);

/**
 * Extract all plain text from a Markdoc AST node tree.
 * Handles Keystatic's { node: { children: [...] } } wrapper format.
 *
 * Block-level children (paragraph, heading, etc.) are separated by spaces.
 * Inline children are joined without spaces to preserve CJK adjacency
 * (e.g. 地震**情報** → 地震情報, not 地震 情報).
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

  // Recurse into children — insert space before block-level elements
  // to prevent word concatenation across blocks
  if (Array.isArray(obj.children)) {
    const parts: string[] = [];
    for (const child of obj.children) {
      const text = extractTextFromMarkdocAst(child);
      if (!text) continue;
      const childObj = child as Record<string, unknown>;
      if (parts.length > 0 && BLOCK_TYPES.has(childObj?.type as string)) {
        parts.push(" ");
      }
      parts.push(text);
    }
    return parts.join("").replace(/\s+/g, " ").trim();
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
 *
 * Builds the body incrementally by extracting text from each block-level
 * node, separating blocks with spaces. Section offsets are recorded at
 * the time of heading encounter, avoiding fragile indexOf-based lookups.
 */
export function extractSectionedText(node: unknown): SectionedText {
  if (!node || typeof node !== "object") return { body: "", sections: [] };

  const obj = node as Record<string, unknown>;

  // Handle Keystatic wrapper
  if (obj.node && typeof obj.node === "object") {
    return extractSectionedText(obj.node);
  }

  let body = "";
  const sections: SectionMarker[] = [];

  function appendSeparator(): void {
    if (body.length > 0) body += " ";
  }

  function walk(n: unknown): void {
    if (!n || typeof n !== "object") return;
    const o = n as Record<string, unknown>;

    // Heading (h2-h4): record offset then append text
    if (o.type === "heading") {
      const attrs = o.attributes as Record<string, unknown> | undefined;
      const level = (attrs?.level as number) ?? null;
      if (level !== null && level >= 2 && level <= 4) {
        const headingText = extractTextFromMarkdocAst(o).trim();
        if (headingText) {
          appendSeparator();
          sections.push({
            id: generateHeadingId(headingText),
            offset: body.length,
          });
          body += headingText;
        }
        return;
      }
    }

    // Other block-level nodes: extract text as a unit
    if (BLOCK_TYPES.has(o.type as string)) {
      const blockText = extractTextFromMarkdocAst(o).trim();
      if (blockText) {
        appendSeparator();
        body += blockText;
      }
      return;
    }

    // Non-block containers (document, etc.): recurse into children
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

  return { body, sections };
}

