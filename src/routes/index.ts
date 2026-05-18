// routes/index.ts

import express from "express";
import authRoutes from "./auth.routes";
import aiChatbotRoutes from "./ai-chatbot.routes";
import historyRoutes from "./history.routes";
import { ROUTE_PATHS } from "@dat-21/contracts";

// Import music routes theo role

import moderatorRoutes from "./moderator.routes";
import adminRoutes from "./admin.routes";
import publicRoutes from "./public.routes";
import userRoutes from "./user.routes";
const router = express.Router();

/* ======================
   AUTH
====================== */
router.use(ROUTE_PATHS.mounts.auth, authRoutes);

/* ======================
   MUSIC (theo role)
====================== */
// Thứ tự quan trọng
router.use(ROUTE_PATHS.mounts.music, publicRoutes);
router.use(ROUTE_PATHS.mounts.music, userRoutes);
router.use(ROUTE_PATHS.mounts.music, moderatorRoutes);
router.use(ROUTE_PATHS.mounts.music, adminRoutes);

/* ======================
   KHÁC
====================== */
router.use(ROUTE_PATHS.mounts.chatbot, aiChatbotRoutes);
router.use(ROUTE_PATHS.mounts.history, historyRoutes);

export default router;