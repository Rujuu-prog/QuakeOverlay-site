export const SNIPPET_CONTEXT_LENGTH = 50;

/**
 * Search result priority (lower = higher priority).
 * Used for stable sorting of search results.
 */
export const SEARCH_PRIORITY = {
  titlePrefix: 0,
  titlePartial: 1,
  descriptionPartial: 2,
  bodyPartial: 3,
} as const;
