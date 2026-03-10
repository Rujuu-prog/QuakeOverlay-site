"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ChangeList } from "./ChangeList";
import type { ChangeType, ReleaseEntry } from "@/types/releases";

type ReleaseCardProps = {
  release: ReleaseEntry;
  defaultOpen: boolean;
  activeFilter?: ChangeType | null;
};

export function ReleaseCard({
  release,
  defaultOpen,
  activeFilter = null,
}: ReleaseCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const t = useTranslations("releases");
  const panelId = `release-panel-${release.slug}`;

  const filteredChanges = activeFilter
    ? release.changes.filter((c) => c.type === activeFilter)
    : release.changes;

  return (
    <div className="relative bg-bg-card border border-border-default rounded-xl overflow-hidden">
      <button
        className="w-full px-6 py-4 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <div className="flex items-center gap-4">
          <Link
            href={`/releases/${release.slug}`}
            className="font-heading text-lg font-semibold text-accent hover:text-accent-hover transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {release.version}
          </Link>
          <span className="text-sm text-text-muted">{release.date}</span>
        </div>
        <ChevronDown
          className={`size-5 text-text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {release.summary && (
        <p className="px-6 pb-2 text-sm text-text-secondary">
          {release.summary}
        </p>
      )}

      {isOpen && (
        <div id={panelId} className="px-6 pb-6 pt-2 space-y-4">
          <ChangeList changes={filteredChanges} />

          {release.knownIssues.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-default">
              <h4 className="text-sm font-medium text-status-warning mb-2">
                {t("knownIssues")}
              </h4>
              <ul className="space-y-1">
                {release.knownIssues.map((issue, index) => (
                  <li
                    key={index}
                    className="text-sm text-text-secondary flex items-start gap-2"
                  >
                    <span className="text-status-warning mt-1">•</span>
                    {issue.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
