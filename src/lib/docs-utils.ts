import { DOC_CATEGORY_KEYS } from "@/constants/doc-categories";
import type { DocCategory } from "@/constants/doc-categories";
import type { DocEntry, DocNavItem, DocTocItem, SidebarCategory } from "@/types/docs";

/**
 * Generate a URL-safe heading ID from text.
 */
export function generateHeadingId(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Sort docs by category display order, then by order field.
 */
export function sortDocs(docs: DocEntry[]): DocEntry[] {
  const categoryOrder = [...DOC_CATEGORY_KEYS];
  return [...docs].sort((a, b) => {
    const catA = categoryOrder.indexOf(a.category);
    const catB = categoryOrder.indexOf(b.category);
    if (catA !== catB) return catA - catB;
    return a.order - b.order;
  });
}

/**
 * Group sorted docs into SidebarCategory array.
 */
export function groupDocsByCategory(docs: DocEntry[]): SidebarCategory[] {
  if (docs.length === 0) return [];

  const sorted = sortDocs(docs);
  const groups: SidebarCategory[] = [];
  const seen = new Set<DocCategory>();

  for (const doc of sorted) {
    if (!seen.has(doc.category)) {
      seen.add(doc.category);
      groups.push({
        category: doc.category,
        items: sorted.filter((d) => d.category === doc.category),
      });
    }
  }

  return groups;
}

/**
 * Get adjacent (prev/next) docs for navigation.
 */
export function getAdjacentDocs(
  currentSlug: string,
  sortedDocs: DocEntry[]
): { prev?: DocNavItem; next?: DocNavItem } {
  const index = sortedDocs.findIndex((d) => d.slug === currentSlug);
  if (index === -1) return {};

  return {
    prev: index > 0
      ? { slug: sortedDocs[index - 1].slug, title: sortedDocs[index - 1].title }
      : undefined,
    next: index < sortedDocs.length - 1
      ? { slug: sortedDocs[index + 1].slug, title: sortedDocs[index + 1].title }
      : undefined,
  };
}

/**
 * Extract TOC items from a Markdoc document tree.
 */
export function extractTocFromDocument(
  node: Record<string, unknown>
): DocTocItem[] {
  const items: DocTocItem[] = [];

  function walk(n: unknown): void {
    if (!n || typeof n !== "object") return;

    const obj = n as Record<string, unknown>;

    let headingLevel: number | null = null;

    // Markdoc AST from Keystatic: { type: "heading", attributes: { level: 2 } }
    if (obj.type === "heading") {
      const attrs = obj.attributes as Record<string, unknown> | undefined;
      headingLevel = (attrs?.level as number) ?? null;
    }
    // Legacy format: { name: "h2" }
    else if (
      obj.name &&
      typeof obj.name === "string" &&
      /^h[2-4]$/.test(obj.name)
    ) {
      headingLevel = parseInt((obj.name as string)[1], 10);
    }

    if (headingLevel !== null && headingLevel >= 2 && headingLevel <= 4) {
      const text = extractText(obj);
      if (text) {
        items.push({ id: generateHeadingId(text), text, level: headingLevel });
      }
    }

    if (Array.isArray(obj.children)) {
      for (const child of obj.children) {
        walk(child);
      }
    }

    // Handle { node: { children: [...] } } wrapper from Keystatic
    if (obj.node && typeof obj.node === "object") {
      walk(obj.node);
    }
  }

  walk(node);
  return items;
}

function extractText(node: unknown): string {
  if (typeof node === "string") return node;
  if (!node || typeof node !== "object") return "";

  const obj = node as Record<string, unknown>;

  // Markdoc text node: { type: "text", attributes: { content: "..." } }
  if (obj.type === "text") {
    const attrs = obj.attributes as Record<string, unknown> | undefined;
    if (attrs?.content && typeof attrs.content === "string") {
      return attrs.content;
    }
  }

  if (Array.isArray(obj.children)) {
    return obj.children.map(extractText).join("");
  }
  return "";
}
