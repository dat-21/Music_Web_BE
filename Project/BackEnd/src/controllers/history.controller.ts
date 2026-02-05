import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";

/**
 * Controller xử lý lịch sử nghe nhạc
 */

// Cập nhật vị trí nghe của bài hát (upsert)
export const updateListenPosition = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { songId, position } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!songId || position === undefined) {
      return res.status(400).json({ message: "songId and position are required" });
    }

    // Validate songId format
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid songId format" });
    }

    const songObjectId = new mongoose.Types.ObjectId(songId);

    // Tìm user và cập nhật listen history
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tìm entry hiện có trong listenHistory
    const existingEntryIndex = user.listenHistory.findIndex(
      (item) => item.songId.toString() === songId
    );

    if (existingEntryIndex !== -1) {
      // Update existing entry
      user.listenHistory[existingEntryIndex].position = position;
      user.listenHistory[existingEntryIndex].updatedAt = new Date();
    } else {
      // Add new entry
      user.listenHistory.push({
        songId: songObjectId,
        position: position,
        updatedAt: new Date(),
      });
    }

    // Giới hạn số lượng history (ví dụ: 100 bài gần nhất)
    const MAX_HISTORY_ITEMS = 100;
    if (user.listenHistory.length > MAX_HISTORY_ITEMS) {
      // Sort theo updatedAt và giữ lại 100 bài gần nhất
      user.listenHistory.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      user.listenHistory = user.listenHistory.slice(0, MAX_HISTORY_ITEMS);
    }

    await user.save();

    return res.status(200).json({
      message: "Listen position updated",
      data: {
        songId,
        position,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating listen position:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Lấy vị trí nghe của một bài hát cụ thể
export const getListenPosition = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { songId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!songId) {
      return res.status(400).json({ message: "songId is required" });
    }

    // Validate songId format
    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid songId format" });
    }

    const user = await User.findById(userId).select("listenHistory");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Tìm entry trong listenHistory
    const historyItem = user.listenHistory.find(
      (item) => item.songId.toString() === songId
    );

    if (!historyItem) {
      return res.status(200).json({
        data: {
          songId,
          position: 0,
          updatedAt: null,
        },
      });
    }

    return res.status(200).json({
      data: {
        songId,
        position: historyItem.position,
        updatedAt: historyItem.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error getting listen position:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Lấy toàn bộ lịch sử nghe của user (optional - cho trang history)
export const getListenHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { limit = 50, page = 1 } = req.query;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await User.findById(userId)
      .select("listenHistory")
      .populate({
        path: "listenHistory.songId",
        select: "title artist coverUrl duration fileUrl",
      });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sort by updatedAt (most recent first)
    const sortedHistory = user.listenHistory.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    // Pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const paginatedHistory = sortedHistory.slice(
      startIndex,
      startIndex + Number(limit)
    );

    return res.status(200).json({
      data: paginatedHistory,
      pagination: {
        total: sortedHistory.length,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(sortedHistory.length / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Error getting listen history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Xóa một bài khỏi lịch sử nghe
export const removeFromHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { songId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!mongoose.Types.ObjectId.isValid(songId)) {
      return res.status(400).json({ message: "Invalid songId format" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: {
        listenHistory: { songId: new mongoose.Types.ObjectId(songId) },
      },
    });

    return res.status(200).json({ message: "Removed from history" });
  } catch (error) {
    console.error("Error removing from history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Xóa toàn bộ lịch sử nghe
export const clearHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    await User.findByIdAndUpdate(userId, {
      $set: { listenHistory: [] },
    });

    return res.status(200).json({ message: "History cleared" });
  } catch (error) {
    console.error("Error clearing history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
