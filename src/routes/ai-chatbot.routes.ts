import { Router } from 'express';
import aiChatbotController from '../controllers/ai-chatbot.controller';

const router = Router();

// POST /api/ai-chatbot/message - Gửi tin nhắn và nhận phản hồi
router.post('/message', aiChatbotController.sendMessage);

// GET /api/ai-chatbot/test - Kiểm tra kết nối AI provider
router.get('/test', aiChatbotController.testConnection);

// GET /api/ai-chatbot/info - Lấy thông tin AI providers
router.get('/info', aiChatbotController.getProviderInfo);

export default router;
