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

  const entries: SearchIndexEntry[] = [];

  for (const doc of localeDocs) {
    const fullDoc = await reader.collections.docs.read(doc.slug, {
      resolveLinkedFiles: true,
    });
    if (!fullDoc) continue;

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

  // Sort by category order then doc order for stable results
  const categoryOrder = DOC_CATEGORIES.map((c) => c.key);
  return entries.sort((a, b) => {
    const catA = categoryOrder.indexOf(a.category);
    const catB = categoryOrder.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    const orderA =
      localeDocs.find((d) => d.slug === a.slug)?.entry.order ?? 0;
    const orderB =
      localeDocs.find((d) => d.slug === b.slug)?.entry.order ?? 0;
    return orderA - orderB;
  });
}
