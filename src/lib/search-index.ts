import { DOC_CATEGORIES } from "@/constants/docs";
import type { DocCategory } from "@/constants/docs";
import type { SearchIndexData } from "@/types/search";
import { extractSectionedText } from "./search";
import { reader, getAllDocs } from "./reader";

/**
 * Build search index for a locale. Server-side only.
 * Reads all docs via Keystatic reader and extracts plain text from Markdoc AST.
 *
 * Returns slim data without normalized fields to reduce RSC payload.
 * Normalized fields are computed on the client side.
 */
export async function getSearchIndex(
  locale: string
): Promise<SearchIndexData[]> {
  const allDocs = await getAllDocs();
  const localeDocs = allDocs.filter((doc) => doc.entry.locale === locale);

  // Fetch all docs in parallel
  const fullDocs = await Promise.all(
    localeDocs.map((doc) =>
      reader.collections.docs
        .read(doc.slug, { resolveLinkedFiles: true })
        .then((fullDoc) => (fullDoc ? { doc, fullDoc } : null))
    )
  );

  const entries: SearchIndexData[] = [];

  for (const item of fullDocs) {
    if (!item) continue;
    const { doc, fullDoc } = item;

    const { body: bodyText, sections } = fullDoc.content
      ? extractSectionedText(
          fullDoc.content as unknown as Record<string, unknown>
        )
      : { body: "", sections: [] };

    entries.push({
      slug: doc.slug,
      title: doc.entry.title,
      description: doc.entry.description,
      category: doc.entry.category as DocCategory,
      body: bodyText,
      sections,
    });
  }

  // Pre-compute slug→order map for O(1) lookup during sort
  const orderMap = new Map(
    localeDocs.map((d) => [d.slug, d.entry.order ?? 0])
  );
  const categoryRank = new Map(
    DOC_CATEGORIES.map((c, i) => [c.key, i])
  );

  return entries.sort((a, b) => {
    const catA = categoryRank.get(a.category) ?? 0;
    const catB = categoryRank.get(b.category) ?? 0;
    if (catA !== catB) return catA - catB;
    return (orderMap.get(a.slug) ?? 0) - (orderMap.get(b.slug) ?? 0);
  });
}
