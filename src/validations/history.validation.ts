import { z } from "zod";

// ========== History Validations ==========

export const updateListenPositionSchema = z.object({
  songId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid songId format"),

  position: z
    .number()
    .min(0, "Position must be non-negative"),
});

export const historySongIdParamSchema = z.object({
  songId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid songId format"),
});

export type UpdateListenPositionInput = z.infer<typeof updateListenPositionSchema>;
