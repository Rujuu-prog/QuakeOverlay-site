"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search } from "lucide-react";
import { DOC_CATEGORIES } from "@/constants/docs";
import type { SidebarCategory } from "@/types/docs";

type SidebarProps = {
  categories: SidebarCategory[];
  currentSlug?: string;
};

export function Sidebar({ categories, currentSlug }: SidebarProps) {
  const t = useTranslations("docs");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
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

  const hasResults = filtered.some((cat) => cat.items.length > 0);

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

      {/* Categories */}
      {hasResults ? (
        <nav>
          <ul className="flex flex-col gap-6">
            {filtered.map((cat) => {
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
      ) : (
        <p className="text-sm text-text-muted">{t("noResults")}</p>
      )}
    </aside>
  );
}
