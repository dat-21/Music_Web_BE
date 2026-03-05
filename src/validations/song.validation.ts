import { z } from "zod";

// ========== Song Validations ==========

export const createSongSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),

  artist: z
    .string()
    .trim()
    .min(1, "Artist is required")
    .max(100, "Artist must be at most 100 characters"),

  album: z
    .string()
    .trim()
    .max(200, "Album must be at most 200 characters")
    .optional(),

  genres: z
    .union([z.string(), z.array(z.string())])
    .optional(),
});

export const updateSongSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be at most 200 characters")
    .optional(),

  artist: z
    .string()
    .trim()
    .min(1, "Artist cannot be empty")
    .max(100, "Artist must be at most 100 characters")
    .optional(),

  album: z
    .string()
    .trim()
    .max(200, "Album must be at most 200 characters")
    .optional(),

  genres: z
    .union([z.string(), z.array(z.string())])
    .optional(),
});

export const songIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid song ID"),
});

export type CreateSongInput = z.infer<typeof createSongSchema>;
export type UpdateSongInput = z.infer<typeof updateSongSchema>;
