import type { DocCategory } from "@/constants/docs";

export type SectionMarker = {
  id: string;
  offset: number;
};

/**
 * Slim data passed from server to client (no normalized fields).
 */
export type SearchIndexData = {
  slug: string;
  title: string;
  description: string;
  category: DocCategory;
  body: string;
  sections: SectionMarker[];
};

/**
 * Full entry with normalized fields, computed on the client.
 */
export type SearchIndexEntry = SearchIndexData & {
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
  sectionId?: string;
};
