import mongoose from "mongoose";
import {
  upsertListenEntry,
  findUserWithHistory,
  findUserWithPopulatedHistory,
  pullSongFromHistory,
  clearUserHistory,
  saveUserHistory,
} from "../repositories/listenHistory.repository";
import { AppError } from "../utils/AppError.utils";
import { IListenHistoryItem } from "../models";

const MAX_HISTORY_ITEMS = 100;

/**
 * Service - chứa toàn bộ business logic + validation
 */

export const updateListenPositionService = async (
  userId: string | undefined,
  songId: string,
  position: number
) => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }
  if (!songId || position === undefined) {
    throw new AppError("songId and position are required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(songId)) {
    throw new AppError("Invalid songId format", 400);
  }

  const user = await upsertListenEntry(userId, songId, position);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Giới hạn số lượng history
  if (user.listenHistory.length > MAX_HISTORY_ITEMS) {
    const trimmed: IListenHistoryItem[] = [...user.listenHistory]
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
      .slice(0, MAX_HISTORY_ITEMS);

    await saveUserHistory(userId, trimmed);
  }

  return { songId, position, updatedAt: new Date() };
};

export const getListenPositionService = async (
  userId: string | undefined,
  songId: string
) => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }
  if (!songId) {
    throw new AppError("songId is required", 400);
  }
  if (!mongoose.Types.ObjectId.isValid(songId)) {
    throw new AppError("Invalid songId format", 400);
  }

  const user = await findUserWithHistory(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const historyItem = user.listenHistory.find(
    (item) => item.songId.toString() === songId
  );

  return {
    songId,
    position: historyItem?.position ?? 0,
    updatedAt: historyItem?.updatedAt ?? null,
  };
};

export const getListenHistoryService = async (
  userId: string | undefined,
  page: number,
  limit: number
) => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const _page = page || 1;
  const _limit = limit || 50;

  const user = await findUserWithPopulatedHistory(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const sorted = [...user.listenHistory].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const startIndex = (_page - 1) * _limit;
  const paginated = sorted.slice(startIndex, startIndex + _limit);

  return {
    data: paginated,
    pagination: {
      total: sorted.length,
      page: _page,
      limit: _limit,
      totalPages: Math.ceil(sorted.length / _limit),
    },
  };
};

export const removeFromHistoryService = async (
  userId: string | undefined,
  songId: string
) => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }
  if (!mongoose.Types.ObjectId.isValid(songId)) {
    throw new AppError("Invalid songId format", 400);
  }

  await pullSongFromHistory(userId, songId);
};

export const clearHistoryService = async (userId: string | undefined) => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  await clearUserHistory(userId);
};