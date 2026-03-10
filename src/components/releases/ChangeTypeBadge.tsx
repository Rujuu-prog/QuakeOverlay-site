"use client";

import { useTranslations } from "next-intl";
import { CHANGE_TYPE_CONFIGS } from "@/constants/releases";
import type { ChangeType } from "@/types/releases";

type ChangeTypeBadgeProps = {
  type: ChangeType;
};

export function ChangeTypeBadge({ type }: ChangeTypeBadgeProps) {
  const t = useTranslations("releases.changeTypes");
  const config = CHANGE_TYPE_CONFIGS[type];

  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
      }}
    >
      {t(type)}
    </span>
  );
}
