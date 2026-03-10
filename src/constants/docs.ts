import { BookOpen, Monitor, Palette, HelpCircle, LifeBuoy } from "lucide-react";
import type { ElementType } from "react";

export type DocCategory =
  | "getting-started"
  | "screens"
  | "customization"
  | "faq"
  | "support";

export type DocCategoryDef = {
  key: DocCategory;
  icon: ElementType;
};

export const DOC_CATEGORIES: DocCategoryDef[] = [
  { key: "getting-started", icon: BookOpen },
  { key: "screens", icon: Monitor },
  { key: "customization", icon: Palette },
  { key: "faq", icon: HelpCircle },
  { key: "support", icon: LifeBuoy },
];
