import { BookOpen, Monitor, Palette, HelpCircle, LifeBuoy } from "lucide-react";
import type { ElementType } from "react";
import { DOC_CATEGORY_KEYS } from "./doc-categories";

export type { DocCategory } from "./doc-categories";
export { DOC_CATEGORY_KEYS } from "./doc-categories";

export type DocCategoryDef = {
  key: (typeof DOC_CATEGORY_KEYS)[number];
  icon: ElementType;
};

const CATEGORY_ICONS: Record<(typeof DOC_CATEGORY_KEYS)[number], ElementType> = {
  "getting-started": BookOpen,
  screens: Monitor,
  customization: Palette,
  faq: HelpCircle,
  support: LifeBuoy,
};

export const DOC_CATEGORIES: DocCategoryDef[] = DOC_CATEGORY_KEYS.map(
  (key) => ({ key, icon: CATEGORY_ICONS[key] })
);
