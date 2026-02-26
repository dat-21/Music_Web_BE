import { Request, Response } from "express";
import { Song } from "../models";

// ✅ Optional auth - Recommendations (có thể login hoặc không)
export const getRecommendations = async (req: Request, res: Response) => {
    try {
        if (req.user) {
            // User đã login - personalized: lấy bài hát phổ biến nhất
            const songs = await Song.find({ status: "approved" })
                .sort({ plays: -1 })
                .limit(10);

            res.json({
                message: "Personalized recommendations",
                username: req.user.username,
                songs,
            });
        } else {
            // Guest - general: lấy bài hát mới nhất
            const songs = await Song.find({ status: "approved" })
                .sort({ createdAt: -1 })
                .limit(10);

            res.json({
                message: "General recommendations",
                songs,
            });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
