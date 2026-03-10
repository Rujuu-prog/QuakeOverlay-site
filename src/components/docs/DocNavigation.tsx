"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DocNavItem } from "@/types/docs";

type DocNavigationProps = {
  prev?: DocNavItem;
  next?: DocNavItem;
};

export function DocNavigation({ prev, next }: DocNavigationProps) {
  const t = useTranslations("docs");

  return (
    <nav className="mt-12 flex items-stretch gap-4">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex flex-1 flex-col rounded-lg border border-border-default p-4 hover:border-border-accent transition-colors duration-200"
        >
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            <ChevronLeft className="size-4" />
            {t("previousPage")}
          </span>
          <span className="mt-1 font-medium text-text-primary group-hover:text-accent transition-colors duration-200">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex flex-1 flex-col items-end rounded-lg border border-border-default p-4 hover:border-border-accent transition-colors duration-200"
        >
          <span className="flex items-center gap-1 text-sm text-text-secondary">
            {t("nextPage")}
            <ChevronRight className="size-4" />
          </span>
          <span className="mt-1 font-medium text-text-primary group-hover:text-accent transition-colors duration-200">
            {next.title}
          </span>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </nav>
  );
}
