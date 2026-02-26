// routes/music/public.routes.ts
// Các route KHÔNG cần đăng nhập - ai cũng truy cập được

import express from "express";
import { optionalAuth } from "../../middleware/auth.middleware";
import * as songController from "../../controllers/song.controller";
import * as recommendationController from "../../controllers/recommendation.controller";

const router = express.Router();

// Lấy danh sách bài hát (có phân trang)
router.get("/songs", songController.getAllSongs);

// Lấy chi tiết 1 bài hát
router.get("/songs/:id", songController.getSongById);

// Gợi ý bài hát (nếu đã login thì personalized, chưa login thì general)
router.get("/recommendations", optionalAuth, recommendationController.getRecommendations);

export default router;
