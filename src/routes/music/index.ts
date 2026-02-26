// routes/music/index.ts
// Gom tất cả route theo role lại thành 1 router duy nhất

import express from "express";
import publicRoutes from "./public.routes";
import userRoutes from "./user.routes";
import moderatorRoutes from "./moderator.routes";
import adminRoutes from "./admin.routes";

const router = express.Router();

// THỨ TỰ QUAN TRỌNG: public → user → moderator → admin
// Route cụ thể (VD: /pending-songs) phải đăng ký TRƯỚC route có param (VD: /songs/:id)

router.use(publicRoutes);      // GET /songs, GET /songs/:id, GET /recommendations
router.use(userRoutes);        // Playlist CRUD (cần login)
router.use(moderatorRoutes);   // Duyệt/sửa bài hát (cần moderator+)
router.use(adminRoutes);       // Upload/xóa bài hát, quản lý user (cần admin)

export default router;
