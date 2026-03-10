"use client";

import { Info, AlertTriangle, AlertOctagon } from "lucide-react";
import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger";

type CalloutProps = {
  type: CalloutType;
  children: ReactNode;
};

const config: Record<
  CalloutType,
  { icon: typeof Info; borderClass: string; bgClass: string; iconClass: string }
> = {
  info: {
    icon: Info,
    borderClass: "border-status-info",
    bgClass: "bg-status-info/10",
    iconClass: "text-status-info",
  },
  warning: {
    icon: AlertTriangle,
    borderClass: "border-status-warning",
    bgClass: "bg-status-warning/10",
    iconClass: "text-status-warning",
  },
  danger: {
    icon: AlertOctagon,
    borderClass: "border-status-danger",
    bgClass: "bg-status-danger/10",
    iconClass: "text-status-danger",
  },
};

export function Callout({ type, children }: CalloutProps) {
  const { icon: Icon, borderClass, bgClass, iconClass } = config[type];
  const isAlert = type === "warning" || type === "danger";

  return (
    <div
      className={`my-4 flex gap-3 rounded-lg border-l-4 p-4 ${borderClass} ${bgClass}`}
      role={isAlert ? "alert" : undefined}
    >
      <Icon className={`mt-0.5 size-5 shrink-0 ${iconClass}`} />
      <div className="text-sm text-text-primary">{children}</div>
    </div>
  );
}
