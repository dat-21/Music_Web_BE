import mongoose from "mongoose";
import User from "../models/user.model";

export interface ListenHistoryEntry {
  songId: mongoose.Types.ObjectId;
  position: number;
  updatedAt: Date;
}

/**
 * Repository - chỉ thao tác trực tiếp với DB
 */

export const findUserWithHistory = async (userId: string) => {
  return User.findById(userId).select("listenHistory");
};

export const findUserWithPopulatedHistory = async (userId: string) => {
  return User.findById(userId)
    .select("listenHistory")
    .populate({
      path: "listenHistory.songId",
      select: "title artist coverUrl duration fileUrl",
    });
};

export const saveUserHistory = async (
  userId: string,
  listenHistory: ListenHistoryEntry[]
) => {
  return User.findByIdAndUpdate(
    userId,
    { $set: { listenHistory } },
    { new: true }
  );
};

export const upsertListenEntry = async (
  userId: string,
  songId: string,
  position: number
) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const songObjectId = new mongoose.Types.ObjectId(songId);
  const existingIndex = user.listenHistory.findIndex(
    (item) => item.songId.toString() === songId
  );

  if (existingIndex !== -1) {
    user.listenHistory[existingIndex].position = position;
    user.listenHistory[existingIndex].updatedAt = new Date();
  } else {
    user.listenHistory.push({ songId: songObjectId, position, updatedAt: new Date() });
  }

  await user.save();
  return user;
};

export const pullSongFromHistory = async (userId: string, songId: string) => {
  return User.findByIdAndUpdate(userId, {
    $pull: {
      listenHistory: { songId: new mongoose.Types.ObjectId(songId) },
    },
  });
};

export const clearUserHistory = async (userId: string) => {
  return User.findByIdAndUpdate(userId, { $set: { listenHistory: [] } });
};