// controllers/user.controller.ts
import { Request, Response } from "express";
import {
    deleteUserService,
    getAllUsersService,
} from "../services";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { sendResponse } from "../utils/respone.utils";

// Admin only - Xóa user
export const deleteUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const currentUserId = req.user?.id;

        await deleteUserService(id, currentUserId);

        sendResponse(res, 200, {
            message: "User deleted successfully",
        });
    }
)

// Admin only - Lấy danh sách tất cả users
export const getAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page);
        const limit = Number(req.query.limit);

        const result = await getAllUsersService(page, limit);

        sendResponse(res, 200, {
            message: "Users retrieved successfully",
            data: result,
        });
    }
)

