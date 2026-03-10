"use client";

import { useTranslations } from "next-intl";
import { CHANGE_TYPE_CONFIGS } from "@/constants/releases";
import type { ChangeType } from "@/types/releases";

type ChangeTypeFilterProps = {
  activeFilter: ChangeType | null;
  onFilterChange: (filter: ChangeType | null) => void;
};

const CHANGE_TYPES: ChangeType[] = [
  "feature",
  "improvement",
  "fix",
  "breaking",
];

export function ChangeTypeFilter({
  activeFilter,
  onFilterChange,
}: ChangeTypeFilterProps) {
  const t = useTranslations("releases");

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter">
      <button
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
          activeFilter === null
            ? "bg-accent text-text-inverse"
            : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
        }`}
        onClick={() => onFilterChange(null)}
        aria-pressed={activeFilter === null}
      >
        {t("filterAll")}
      </button>
      {CHANGE_TYPES.map((type) => {
        const config = CHANGE_TYPE_CONFIGS[type];
        const isActive = activeFilter === type;

        return (
          <button
            key={type}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "text-text-inverse"
                : "bg-bg-tertiary text-text-secondary hover:text-text-primary"
            }`}
            style={
              isActive
                ? { backgroundColor: config.color }
                : undefined
            }
            onClick={() => onFilterChange(type)}
            aria-pressed={isActive}
          >
            {t(`changeTypes.${type}`)}
          </button>
        );
      })}
    </div>
  );
}
