"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useActiveHeading } from "@/hooks/useActiveHeading";
import type { DocTocItem } from "@/types/docs";

type TableOfContentsProps = {
  items: DocTocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  const t = useTranslations("docs");

  const headingIds = useMemo(() => items.map((item) => item.id), [items]);
  const activeId = useActiveHeading(headingIds);

  if (items.length === 0) return null;

  return (
    <nav aria-label={t("tableOfContents")}>
      <h3 className="mb-3 text-sm font-semibold text-text-primary">
        {t("onThisPage")}
      </h3>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`block text-sm transition-colors duration-200 ${
                item.level === 3 ? "pl-4" : item.level === 4 ? "pl-8" : ""
              } ${
                activeId === item.id
                  ? "text-accent font-medium"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
