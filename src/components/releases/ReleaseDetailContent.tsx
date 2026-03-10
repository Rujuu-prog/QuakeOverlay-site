"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ChangeList } from "./ChangeList";
import type { ReleaseEntry } from "@/types/releases";

type ReleaseDetailContentProps = {
  release: ReleaseEntry;
  children?: ReactNode;
};

export function ReleaseDetailContent({
  release,
  children,
}: ReleaseDetailContentProps) {
  const t = useTranslations("releases");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-4 mb-2">
          <h1
            className="font-heading font-bold text-accent"
            style={{ fontSize: "var(--text-h1)" }}
          >
            {release.version}
          </h1>
          <span className="text-text-muted">{release.date}</span>
        </div>
        {release.summary && (
          <p className="text-text-secondary text-lg">{release.summary}</p>
        )}
      </div>

      {/* Changes */}
      <div>
        <ChangeList changes={release.changes} />
      </div>

      {/* Known Issues */}
      {release.knownIssues.length > 0 && (
        <div className="pt-4 border-t border-border-default">
          <h3 className="text-sm font-medium text-status-warning mb-2">
            {t("knownIssues")}
          </h3>
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

      {/* Markdoc Content (rendered server-side, passed as children) */}
      {children && (
        <div className="pt-4 border-t border-border-default">{children}</div>
      )}
    </div>
  );
}
