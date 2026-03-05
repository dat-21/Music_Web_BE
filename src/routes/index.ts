// routes/index.ts

import express from "express";
import authRoutes from "./auth.routes";
import aiChatbotRoutes from "./ai-chatbot.routes";
import historyRoutes from "./history.routes";

// Import music routes theo role

import moderatorRoutes from "./moderator.routes";
import adminRoutes from "./admin.routes";
import publicRoutes from "./public.routes";
import userRoutes from "./user.routes";
const router = express.Router();

/* ======================
   AUTH
====================== */
router.use("/auth", authRoutes);

/* ======================
   MUSIC (theo role)
====================== */
// Thứ tự quan trọng
router.use("/music", publicRoutes);
router.use("/music", userRoutes);
router.use("/music", moderatorRoutes);
router.use("/music", adminRoutes);

/* ======================
   KHÁC
====================== */
router.use("/ai-chatbot", aiChatbotRoutes);
router.use("/history", historyRoutes);

export default router;