"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  // Close on Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
      }
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
        aria-label={isOpen ? t("header.closeMenu") : t("header.openMenu")}
        className="inline-flex items-center justify-center rounded-lg p-2 text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-200 md:hidden"
      >
        {isOpen ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 z-40 bg-black/50"
            onClick={close}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <nav
            className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-l border-border-default bg-bg-secondary p-6"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col gap-4">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={close}
                      className={`block rounded-lg px-4 py-2 text-base font-medium transition-colors duration-200 ${
                        isActive
                          ? "text-accent bg-accent/10"
                          : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 border-t border-border-default pt-4">
              <LanguageSwitcher />
            </div>
          </nav>
        </>
      )}
    </>
  );
}
