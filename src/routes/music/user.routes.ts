// routes/music/user.routes.ts
// Các route cần ĐĂNG NHẬP - dành cho user thường (và cao hơn)

import express from "express";
import { authenticate } from "../../middleware/auth.middleware";
import * as playlistController from "../../controllers/playlist.controller";

const router = express.Router();

// Tất cả route trong file này đều cần authenticate
router.use(authenticate);

// Lấy playlists của chính mình
router.get("/my-playlists", playlistController.getMyPlaylists);

// Tạo playlist mới
router.post("/playlists", playlistController.createPlaylist);

// Cập nhật playlist (controller tự check owner/admin)
router.put("/playlists/:id", playlistController.updatePlaylist);

// Xóa playlist (controller tự check owner/admin)
router.delete("/playlists/:id", playlistController.deletePlaylist);

// Thêm bài hát vào playlist
router.post("/playlists/:id/songs", playlistController.addSongToPlaylist);

// Xóa bài hát khỏi playlist
router.delete("/playlists/:id/songs/:songId", playlistController.removeSongFromPlaylist);

export default router;
