"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import type { SidebarCategory } from "@/types/docs";
import type { SearchIndexEntry } from "@/types/search";

type DocsSidebarDrawerProps = {
  categories: SidebarCategory[];
  currentSlug?: string;
  searchIndex?: SearchIndexEntry[];
};

export function DocsSidebarDrawer({
  categories,
  currentSlug,
  searchIndex,
}: DocsSidebarDrawerProps) {
  const t = useTranslations("docs");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? t("closeSidebar") : t("openSidebar")}
        className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-200 md:hidden"
      >
        {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={close}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto border-r border-border-default bg-bg-secondary p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">
                {t("title")}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={t("closeSidebar")}
                className="rounded-lg p-1 text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-200"
              >
                <X className="size-5" />
              </button>
            </div>
            <Sidebar categories={categories} currentSlug={currentSlug} searchIndex={searchIndex} />
          </div>
        </>
      )}
    </>
  );
}
