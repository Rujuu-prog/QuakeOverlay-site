"use client";

import { ChangeTypeBadge } from "./ChangeTypeBadge";
import type { ReleaseChange } from "@/types/releases";

type ChangeListProps = {
  changes: ReleaseChange[];
};

export function ChangeList({ changes }: ChangeListProps) {
  if (changes.length === 0) return null;

  return (
    <ul className="space-y-2">
      {changes.map((change, index) => (
        <li key={index} className="flex items-start gap-3">
          <ChangeTypeBadge type={change.type} />
          <span className="text-sm text-text-secondary">
            {change.description}
          </span>
        </li>
      ))}
    </ul>
  );
}
