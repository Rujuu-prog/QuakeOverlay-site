import type { DocCategory } from "@/constants/docs";
import type { DocEntry } from "@/types/docs";
import { reader } from "./reader";
import { sortDocs } from "./docs-utils";

// Re-export client-safe utilities for convenience
export {
  generateHeadingId,
  sortDocs,
  groupDocsByCategory,
  getAdjacentDocs,
  extractTocFromDocument,
} from "./docs-utils";

/**
 * Fetch all docs for a locale from Keystatic.
 */
export async function getDocsByLocale(locale: string): Promise<DocEntry[]> {
  const allDocs = await reader.collections.docs.all();

  const filtered: DocEntry[] = allDocs
    .filter((doc) => doc.entry.locale === locale)
    .map((doc) => ({
      slug: doc.slug,
      title: doc.entry.title,
      description: doc.entry.description,
      category: doc.entry.category as DocCategory,
      order: doc.entry.order ?? 0,
      locale: doc.entry.locale,
    }));

  return sortDocs(filtered);
}

/**
 * Fetch a single doc by slug from Keystatic.
 */
export async function getDocBySlug(slug: string) {
  const doc = await reader.collections.docs.read(slug, {
    resolveLinkedFiles: true,
  });
  return doc;
}
