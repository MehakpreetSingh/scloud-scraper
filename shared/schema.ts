import { z } from "zod";

// Define SearchResult schema
export const searchResultSchema = z.object({
  name: z.string(),
  size: z.string(),
  link: z.string(),
  fileType: z.string().optional(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

// Define SearchResponse schema
export const searchResponseSchema = z.object({
  query: z.string(),
  count: z.number(),
  results: z.array(searchResultSchema),
});

export type SearchResponse = z.infer<typeof searchResponseSchema>;

// Define DownloadResponse schema
export const downloadResponseSchema = z.object({
  url: z.string(),
  filename: z.string(),
  size: z.string(),
  success: z.boolean(),
});

export type DownloadResponse = z.infer<typeof downloadResponseSchema>;

// Define ErrorResponse schema
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string().optional(),
  success: z.boolean().optional(),
});

export type ErrorResponse = z.infer<typeof errorResponseSchema>;
