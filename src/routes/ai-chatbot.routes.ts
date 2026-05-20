import { Router } from "express";
import { sendMessage, testConnection, getProviderInfo } from "../controllers/ai-chatbot.controller";
import { validate } from "../middleware/validate.middleware";
import { chatMessageSchema } from "../validations/chatbot.validation";
import { ROUTE_PATHS } from "@dat-21/contracts";

const router = Router();

router.post(ROUTE_PATHS.chatbot.send, validate(chatMessageSchema), sendMessage);

router.get(ROUTE_PATHS.chatbot.test, testConnection);

router.get(ROUTE_PATHS.chatbot.info, getProviderInfo);

export default router;
