import type { DocCategory } from "@/constants/docs";

export type DocEntry = {
  slug: string;
  title: string;
  description: string;
  category: DocCategory;
  order: number;
  locale: string;
};

export type DocTocItem = {
  id: string;
  text: string;
  level: number;
};

export type DocNavItem = {
  slug: string;
  title: string;
};

export type SidebarCategory = {
  category: DocCategory;
  items: DocEntry[];
};
