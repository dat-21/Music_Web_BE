// ========== DTOs ==========

export interface ChatMessageDTO {
  message: string;
  languageCode?: string;
  context?: string;
}

export interface ChatResponseDTO {
  response: string;
  provider: string;
  model?: string;
  error?: boolean;
}

export interface ChatbotProviderInfo {
  provider: string;
  available: {
    gemini: boolean;
    openai: boolean;
    ruleBased: boolean;
  };
}
