import { z } from "zod";

// ========== Playlist Validations ==========

export const createPlaylistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Playlist name is required")
    .max(100, "Playlist name must be at most 100 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  isPublic: z
    .boolean()
    .optional()
    .default(false),
});

export const updatePlaylistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Playlist name cannot be empty")
    .max(100, "Playlist name must be at most 100 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),

  isPublic: z
    .boolean()
    .optional(),
});

export const addSongToPlaylistSchema = z.object({
  songId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid song ID"),
});

export const playlistIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid playlist ID"),
});

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;
export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;
