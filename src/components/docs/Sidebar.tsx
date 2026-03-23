"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search } from "lucide-react";
import { DOC_CATEGORIES } from "@/constants/docs";
import { searchDocs } from "@/lib/search";
import { SearchResults } from "./SearchResults";
import type { SidebarCategory } from "@/types/docs";
import type { SearchIndexEntry } from "@/types/search";

type SidebarProps = {
  categories: SidebarCategory[];
  currentSlug?: string;
  searchIndex?: SearchIndexEntry[];
};

export function Sidebar({ categories, currentSlug, searchIndex }: SidebarProps) {
  const t = useTranslations("docs");
  const [query, setQuery] = useState("");

  // Fulltext search results (when searchIndex is available and query is non-empty)
  const fulltextResults = useMemo(() => {
    if (!searchIndex || !query.trim()) return null;
    return searchDocs(searchIndex, query);
  }, [searchIndex, query]);

  // Fallback: title-only filtering (when searchIndex is not available)
  const filteredCategories = useMemo(() => {
    if (!query.trim()) return categories;

    const lower = query.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          item.title.toLowerCase().includes(lower)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, query]);

  const hasQuery = query.trim().length > 0;
  const useFulltext = hasQuery && searchIndex != null;

  // For fallback title-only mode
  const hasFilteredResults = filteredCategories.some(
    (cat) => cat.items.length > 0
  );

  return (
    <aside aria-label={t("sidebar")}>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border-default bg-bg-secondary py-2 pl-10 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-border-accent focus:outline-none transition-colors duration-200"
        />
      </div>

      {/* Fulltext search results */}
      {useFulltext ? (
        <SearchResults results={fulltextResults!} query={query} />
      ) : hasQuery && !hasFilteredResults ? (
        /* Fallback: title-only no results */
        <p className="text-sm text-text-muted">{t("noResults")}</p>
      ) : (
        /* Category list (default or fallback filtered) */
        <nav>
          <ul className="flex flex-col gap-6">
            {(hasQuery ? filteredCategories : categories).map((cat) => {
              const catDef = DOC_CATEGORIES.find(
                (c) => c.key === cat.category
              );
              const Icon = catDef?.icon;

              return (
                <li key={cat.category}>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
                    {Icon && <Icon className="size-4 text-text-secondary" />}
                    {t(`categories.${cat.category}`)}
                  </h3>
                  <ul className="flex flex-col gap-0.5">
                    {cat.items.map((item) => {
                      const isActive = item.slug === currentSlug;
                      return (
                        <li key={item.slug}>
                          <Link
                            href={`/docs/${item.slug}`}
                            className={`block rounded-md px-3 py-1.5 text-sm transition-colors duration-200 ${
                              isActive
                                ? "text-accent bg-accent/10 font-medium"
                                : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                            }`}
                          >
                            {item.title}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </aside>
  );
}
