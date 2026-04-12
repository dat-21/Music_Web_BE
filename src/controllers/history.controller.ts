import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import {
  updateListenPositionService,
  getListenPositionService,
  getListenHistoryService,
  removeFromHistoryService,
  clearHistoryService,
} from "../services";
import { sendResponse } from "../utils/respone.utils";

/**
 * Controller - chỉ nhận request, gọi service, trả response
 */

export const updateListenPosition = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { songId, position } = req.body;

  const result = await updateListenPositionService(userId, songId, position);

  sendResponse(res, 200, {
    message: "Listen position updated",
    data: result,
  });
});

export const getListenPosition = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { songId } = req.params;

  const result = await getListenPositionService(userId, songId);

  sendResponse(res, 200, {
    data: result,
  });
});

export const getListenHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  const result = await getListenHistoryService(userId, page, limit);

  sendResponse(res, 200, {
    message: "Listen history retrieved",
    data: result,
  });
});

export const removeFromHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { songId } = req.params;

  await removeFromHistoryService(userId, songId);

  sendResponse(res, 200, {
    message: "Removed from history",
  });
});

export const clearHistory = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  await clearHistoryService(userId);

  sendResponse(res, 200, {
    message: "History cleared",
  });
});