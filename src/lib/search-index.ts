import { DOC_CATEGORIES } from "@/constants/docs";
import type { DocCategory } from "@/constants/docs";
import type { SearchIndexEntry } from "@/types/search";
import { normalizeForSearch, extractTextFromMarkdocAst } from "./search";
import { reader } from "./reader";

/**
 * Build search index for a locale. Server-side only.
 * Reads all docs via Keystatic reader and extracts plain text from Markdoc AST.
 *
 * This function encapsulates all index generation responsibility.
 * UI consumers should not know or care about the data source.
 */
export async function getSearchIndex(
  locale: string
): Promise<SearchIndexEntry[]> {
  const allDocs = await reader.collections.docs.all();
  const localeDocs = allDocs.filter((doc) => doc.entry.locale === locale);

  // Fetch all docs in parallel
  const fullDocs = await Promise.all(
    localeDocs.map((doc) =>
      reader.collections.docs
        .read(doc.slug, { resolveLinkedFiles: true })
        .then((fullDoc) => (fullDoc ? { doc, fullDoc } : null))
    )
  );

  const entries: SearchIndexEntry[] = [];

  for (const item of fullDocs) {
    if (!item) continue;
    const { doc, fullDoc } = item;

    const bodyText = fullDoc.content
      ? extractTextFromMarkdocAst(
          fullDoc.content as unknown as Record<string, unknown>
        )
      : "";

    entries.push({
      slug: doc.slug,
      title: doc.entry.title,
      description: doc.entry.description,
      category: doc.entry.category as DocCategory,
      body: bodyText,
      searchTitle: normalizeForSearch(doc.entry.title),
      searchDescription: normalizeForSearch(doc.entry.description),
      searchBody: normalizeForSearch(bodyText),
    });
  }

  // Pre-compute slug→order map for O(1) lookup during sort
  const orderMap = new Map(
    localeDocs.map((d) => [d.slug, d.entry.order ?? 0])
  );
  const categoryOrder = DOC_CATEGORIES.map((c) => c.key);

  return entries.sort((a, b) => {
    const catA = categoryOrder.indexOf(a.category);
    const catB = categoryOrder.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return (orderMap.get(a.slug) ?? 0) - (orderMap.get(b.slug) ?? 0);
  });
}
