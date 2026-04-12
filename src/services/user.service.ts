import mongoose from "mongoose";
import { userRepository } from "../repositories";
import { AppError } from "../utils/AppError.utils";
import { IUser } from "../models/user.model";

export const deleteUserService = async (
  userId: string,
  currentUserId?: string
): Promise<void> => {
  if (!currentUserId) {
    throw new AppError("Unauthorized", 401);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const user = await userRepository.findUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user._id.toString() === currentUserId) {
    throw new AppError("Cannot delete yourself", 400);
  }

  await userRepository.deleteUserById(userId);
};

export const getAllUsersService = async (
  page: number,
  limit: number
): Promise<{
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  users: IUser[];
}> => {
  const _page = page || 1;
  const _limit = limit || 20;

  if (_page < 1 || _limit < 1) {
    throw new AppError("Invalid pagination parameters", 400);
  }

  const users = await userRepository.findAllUsers({}, (_page - 1) * _limit, _limit);
  const total = await userRepository.countUsers();

  return {
    page: _page,
    limit: _limit,
    total,
    totalPages: Math.ceil(total / _limit),
    users,
  };
};