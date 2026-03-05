import { Router } from "express";
import { sendMessage, testConnection, getProviderInfo } from "../controllers/ai-chatbot.controller";
import { validate } from "../middleware/validate.middleware";
import { chatMessageSchema } from "../validations/chatbot.validation";

const router = Router();

router.post("/message", validate(chatMessageSchema), sendMessage);

router.get("/test", testConnection);

router.get("/info", getProviderInfo);

export default router;
