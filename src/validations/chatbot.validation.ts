import { z } from "zod";

// ========== AI Chatbot Validations ==========

export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required"),

  languageCode: z
    .string()
    .length(2, "Language code must be a 2-character string")
    .optional()
    .default("vi"),

  context: z
    .string()
    .optional(),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
