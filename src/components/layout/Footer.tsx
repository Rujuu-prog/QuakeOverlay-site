"use client";

import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SITE_NAME, EXTERNAL_LINKS } from "@/constants/site";
import { ExternalLink } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-default bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-lg font-bold text-text-primary">{SITE_NAME}</h2>
            <p className="mt-2 text-sm text-text-secondary">{t("description")}</p>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{t("documents")}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href={`/docs/${locale}-installation`}
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  {t("gettingStarted")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/docs/${locale}-main-screen`}
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  {t("screens")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/docs/${locale}-faq`}
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  {t("faq")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/docs/${locale}-contact`}
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  {t("support")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{t("links")}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <a
                  href={EXTERNAL_LINKS.booth}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  Booth
                  <ExternalLink className="size-3" />
                </a>
              </li>
              <li>
                <a
                  href={EXTERNAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  X (Twitter)
                  <ExternalLink className="size-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary">{t("language")}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link
                  href="/"
                  locale="ja"
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  日本語
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  locale="en"
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  English
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  locale="ko"
                  className="text-sm text-text-secondary hover:text-accent transition-colors duration-200"
                >
                  한국어
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-border-default pt-6 text-center">
          <p className="text-sm text-text-muted">{t("copyright", { year })}</p>
        </div>
      </div>
    </footer>
  );
}
