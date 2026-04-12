import bcrypt from "bcryptjs";
import { userRepository } from "../repositories";
import { generateToken } from "../utils/jwt.utils";
import { AppError } from "../utils/AppError.utils";
import { IUser } from "../models/user.model";

export const registerService = async (
  username: string,
  email: string,
  password: string,
  role?: string
): Promise<{ id: string; username: string; email: string }> => {
  const existingUser = await userRepository.findUserByUsername(username);
  if (existingUser) {
    throw new AppError("Username already exists", 400);
  }

  const existingEmail = await userRepository.findUserByEmail(email);
  if (existingEmail) {
    throw new AppError("Email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.createUser({
    username,
    email,
    password: hashedPassword,
    role: role && ["admin", "moderator"].includes(role) ? (role as IUser["role"]) : "user",
    isVerified: true,
  } as Partial<IUser>);

  return {
    id: newUser._id.toString(),
    username: newUser.username,
    email: newUser.email,
  };
};

export const loginService = async (
  username: string,
  password: string
): Promise<{ user: IUser; token: string }> => {
  const user = await userRepository.findUserByUsername(username);
  if (!user) {
    throw new AppError("Invalid username or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid username or password", 401);
  }

  const token = generateToken({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
  });

  return { user, token };
};

export const logoutService = (userId?: string): void => {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }
};

export const getCurrentUserService = async (
  userId?: string
): Promise<IUser> => {
  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await userRepository.findUserByIdSafe(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};