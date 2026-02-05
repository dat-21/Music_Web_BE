import { Router } from "express";
import {
  updateListenPosition,
  getListenPosition,
  getListenHistory,
  removeFromHistory,
  clearHistory,
} from "../controllers/history.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * Listen History Routes
 * Base path: /api/history
 * 
 * Tất cả routes đều yêu cầu authentication
 */

// Cập nhật vị trí nghe (upsert) - POST /api/history/position
router.post("/position", authenticate, updateListenPosition);

// Lấy vị trí nghe của một bài cụ thể - GET /api/history/position/:songId
router.get("/position/:songId", authenticate, getListenPosition);

// Lấy toàn bộ lịch sử nghe - GET /api/history
router.get("/", authenticate, getListenHistory);

// Xóa một bài khỏi lịch sử - DELETE /api/history/:songId
router.delete("/:songId", authenticate, removeFromHistory);

// Xóa toàn bộ lịch sử - DELETE /api/history/clear
router.delete("/clear/all", authenticate, clearHistory);

export default router;
