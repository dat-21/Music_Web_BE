// routes/music/moderator.routes.ts
// Các route dành cho MODERATOR hoặc ADMIN

import express from "express";
import { authenticate, isModeratorOrAdmin } from "../../middleware/auth.middleware";
import * as songController from "../../controllers/song.controller";

const router = express.Router();

// Tất cả route trong file này cần authenticate + moderator/admin
router.use(authenticate);
router.use(isModeratorOrAdmin);

// Lấy danh sách bài hát đang chờ duyệt
router.get("/pending-songs", songController.getPendingSongs);

// Cập nhật thông tin bài hát
router.put("/songs/:id", songController.updateSong);

// Duyệt bài hát (pending → approved)
router.post("/songs/:id/approve", songController.approveSong);

export default router;
