import { cache } from "react";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

export const reader = createReader(process.cwd(), keystaticConfig);

/** Cached per-request to deduplicate across getDocsByLocale / getSearchIndex. */
export const getAllDocs = cache(() => reader.collections.docs.all());
