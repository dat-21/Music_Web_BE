// controllers/user.controller.ts
import { Request, Response } from "express";
import {
    deleteUserService,
    getAllUsersService,
} from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler.utils";

// ✅ Admin only - Xóa user
export const deleteUser = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        await deleteUserService(id, req.user!.id);

        res.json({
            message: "User deleted successfully",
        });
    }
)

// ✅ Admin only - Lấy danh sách tất cả users
export const getAllUsers = asyncHandler(
    async (req: Request, res: Response) => {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 20;

        const result = await getAllUsersService(req.query);

        res.json(result);
    }
)

