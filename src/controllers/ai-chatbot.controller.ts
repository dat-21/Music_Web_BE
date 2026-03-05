import { Request, Response } from "express";
import { aiChatbotService } from "../services";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { sendResponse } from "../utils/respone.utils";

/**
 * POST /api/ai-chatbot/message
 */
export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { message, languageCode = "vi", context } = req.body;

  const response = await aiChatbotService.chat(
    message.trim(),
    languageCode,
    context
  );

  sendResponse(res, 200, {
    message: "Chatbot response retrieved",
    data: {
      userMessage: message,
      botResponse: response.response,
      languageCode,
      metadata: {
        provider: response.provider,
        model: response.model,
      },
    },
  });
});

/**
 * GET /api/ai-chatbot/test
 */
export const testConnection = asyncHandler(async (_req: Request, res: Response) => {
  const isConnected = await aiChatbotService.testConnection();
  const providerInfo = aiChatbotService.getProviderInfo();

  sendResponse(res, isConnected ? 200 : 503, {
    message: isConnected
      ? `AI Chatbot (${providerInfo.provider}) is working properly`
      : "Failed to connect to AI provider",
    data: {
      connected: isConnected,
      provider: providerInfo,
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * GET /api/ai-chatbot/info
 */
export const getProviderInfo = asyncHandler(async (_req: Request, res: Response) => {
  const info = aiChatbotService.getProviderInfo();

  sendResponse(res, 200, {
    message: "Provider info retrieved",
    data: info,
  });
});
