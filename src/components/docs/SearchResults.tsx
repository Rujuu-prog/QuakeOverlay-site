"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DOC_CATEGORIES } from "@/constants/docs";
import { normalizeForSearch } from "@/lib/search";
import type { SearchResult } from "@/types/search";

type SearchResultsProps = {
  results: SearchResult[];
  query: string;
};

/**
 * Highlight matching text within a string using <mark> elements.
 */
function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const normalizedQuery = normalizeForSearch(query);
  if (!normalizedQuery) return <>{text}</>;

  const normalizedText = normalizeForSearch(text);
  const matchIndex = normalizedText.indexOf(normalizedQuery);
  if (matchIndex === -1) return <>{text}</>;

  // Map normalized position back to original text
  // Since normalization preserves character count (mostly),
  // we find the match in original text case-insensitively
  const lowerText = text.toLowerCase().replace(/\u3000/g, " ");
  const origIndex = lowerText.indexOf(normalizedQuery);
  if (origIndex === -1) return <>{text}</>;

  const before = text.slice(0, origIndex);
  const match = text.slice(origIndex, origIndex + normalizedQuery.length);
  const after = text.slice(origIndex + normalizedQuery.length);

  return (
    <>
      {before}
      <mark className="bg-accent/20 text-accent rounded-sm px-0.5">
        {match}
      </mark>
      {after}
    </>
  );
}

export function SearchResults({ results, query }: SearchResultsProps) {
  const t = useTranslations("docs");

  // Don't render when query is empty
  if (!normalizeForSearch(query)) return null;

  if (results.length === 0) {
    return (
      <div className="py-4">
        <p className="text-sm text-text-muted">{t("noResults")}</p>
        <p className="mt-1 text-xs text-text-muted">{t("noResultsHint")}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-xs text-text-muted">
        {t("searchResultCount", { count: results.length })}
      </p>
      <ul className="flex flex-col gap-2">
        {results.map((result) => {
          const catDef = DOC_CATEGORIES.find(
            (c) => c.key === result.category
          );

          return (
            <li key={result.slug}>
              <Link
                href={`/docs/${result.slug}`}
                className="block rounded-lg border border-border-default p-3 transition-colors duration-200 hover:border-border-accent hover:bg-bg-hover"
              >
                <span className="text-sm font-medium text-text-primary">
                  <HighlightedText text={result.title} query={query} />
                </span>
                <span className="ml-2 text-xs text-text-muted">
                  {t(`categories.${catDef?.key ?? result.category}`)}
                </span>
                {result.matchField === "body" && result.snippet && (
                  <p className="mt-1 text-xs text-text-secondary">
                    <span className="mr-1 text-text-muted">
                      {t("searchMatchBody")}:
                    </span>
                    <HighlightedText text={result.snippet} query={query} />
                  </p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
