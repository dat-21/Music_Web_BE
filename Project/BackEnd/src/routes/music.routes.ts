// routes/music.routes.ts
import express from "express";
import { 
  authenticate, 
  isAdmin, 
  isModeratorOrAdmin,
  isOwnerOrAdmin,
  optionalAuth 
} from "../middleware/auth.middleware";
import * as musicController from "../controllers/music.controller";
import { uploadSongMiddleware } from "../middleware/song.middleware";


const router = express.Router();

// ✅ Public routes (không cần đăng nhập)
router.get("/songs", musicController.getAllSongs);
router.get("/songs/:id", musicController.getSongById);

// ✅ Optional auth (có thể đăng nhập hoặc không)
router.get("/recommendations", optionalAuth, musicController.getRecommendations);

router.use(authenticate)
// ✅ Cần đăng nhập
router.post("/playlists", musicController.createPlaylist);
router.get("/my-playlists", musicController.getMyPlaylists);

// ✅ Chỉ admin
router.use(isAdmin);
router.post("/songs", uploadSongMiddleware, musicController.uploadSong); // ✅ Upload audio + cover image
router.delete("/songs/:id", musicController.deleteSong);
router.delete("/users/:id", musicController.deleteUser);

// ✅ Admin hoặc Moderator
router.put("/songs/:id", isModeratorOrAdmin, musicController.updateSong);
router.post("/songs/:id/approve", isModeratorOrAdmin, musicController.approveSong);

// ✅ Chỉ owner hoặc admin (VD: user chỉ sửa playlist của mình)
router.put("/playlists/:id", isOwnerOrAdmin("userId"), musicController.updatePlaylist);
router.delete("/playlists/:id", isOwnerOrAdmin("userId"), musicController.deletePlaylist);

export default router;