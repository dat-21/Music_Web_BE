// routes/music/admin.routes.ts
// Các route CHỈ dành cho ADMIN

import express from "express";
import { authenticate, isAdmin } from "../../middleware/auth.middleware";
import { uploadSongMiddleware } from "../../middleware/song.middleware";
import * as songController from "../../controllers/song.controller";
import * as userController from "../../controllers/user.controller";

const router = express.Router();

// Tất cả route trong file này cần authenticate + admin
router.use(authenticate);
router.use(isAdmin);

// Upload bài hát mới (audio + cover image)
router.post("/songs", uploadSongMiddleware, songController.uploadSong);

// Xóa bài hát (xóa cả trên Cloudinary)
router.delete("/songs/:id", songController.deleteSong);

// Lấy danh sách tất cả users
router.get("/users", userController.getAllUsers);

// Xóa user
router.delete("/users/:id", userController.deleteUser);

export default router;
