import type { DocCategory } from "@/constants/docs";

export type SearchIndexEntry = {
  slug: string;
  title: string;
  description: string;
  category: DocCategory;
  body: string;
  searchTitle: string;
  searchDescription: string;
  searchBody: string;
};

export type MatchField = "title" | "description" | "body";
export type MatchType = "prefix" | "partial";

export type SearchResult = {
  slug: string;
  title: string;
  description: string;
  category: DocCategory;
  snippet: string;
  matchField: MatchField;
  matchType: MatchType;
};
