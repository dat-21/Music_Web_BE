// services/user.service.ts
import mongoose from "mongoose";
import { User } from "../models";
import { AppError } from "../utils/AppError.utils";

export const deleteUserService = async (
    userId: string,
    currentUserId: string
) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new AppError("Invalid user ID", 400);
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user._id.toString() === currentUserId) {
        throw new AppError("Cannot delete yourself", 400);
    }

    await User.findByIdAndDelete(userId);
};

export const getAllUsersService = async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    if (page < 1 || limit < 1) {
        throw new AppError("Invalid pagination parameters", 400);
    }

    const users = await User.find()
        .select("-password -verifyToken -verifyTokenExpires")
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await User.countDocuments();

    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        users,
    };
};