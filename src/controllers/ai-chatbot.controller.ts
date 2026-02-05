import { Request, Response } from 'express';
import aiChatbotService from '../services/ai-chatbot.service';

class AIChatbotController {
  /**
   * POST /api/ai-chatbot/message
   * Gửi tin nhắn đến AI chatbot và nhận phản hồi
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const { message, languageCode = 'vi', context } = req.body;

      // Validate input
      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Message is required and must be a non-empty string'
        });
      }

      // Validate language code
      if (typeof languageCode !== 'string' || languageCode.length !== 2) {
        return res.status(400).json({
          success: false,
          message: 'Language code must be a 2-character string (e.g., "vi", "en")'
        });
      }

      // Gọi AI service
      const response = await aiChatbotService.chat(
        message.trim(),
        languageCode,
        context
      );

      return res.status(200).json({
        success: true,
        data: {
          userMessage: message,
          botResponse: response.response,
          languageCode,
          metadata: {
            provider: response.provider,
            model: response.model
          }
        }
      });
    } catch (error: any) {
      console.error('AI Chatbot error:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to get chatbot response',
        error: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
  }

  /**
   * GET /api/ai-chatbot/test
   * Kiểm tra kết nối với AI provider
   */
  async testConnection(req: Request, res: Response) {
    try {
      const isConnected = await aiChatbotService.testConnection();
      const providerInfo = aiChatbotService.getProviderInfo();
      
      return res.status(200).json({
        success: isConnected,
        message: isConnected 
          ? `AI Chatbot (${providerInfo.provider}) is working properly` 
          : 'Failed to connect to AI provider',
        provider: providerInfo,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Connection test failed',
        error: error.message
      });
    }
  }

  /**
   * GET /api/ai-chatbot/info
   * Lấy thông tin về AI providers
   */
  async getProviderInfo(req: Request, res: Response) {
    try {
      const info = aiChatbotService.getProviderInfo();
      
      return res.status(200).json({
        success: true,
        data: info
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: 'Failed to get provider info',
        error: error.message
      });
    }
  }
}

export default new AIChatbotController();
