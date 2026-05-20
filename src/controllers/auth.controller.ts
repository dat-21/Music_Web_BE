import { Request, Response } from "express";
import { registerService, loginService, logoutService, getCurrentUserService } from "../services";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { sendResponse } from "../utils/respone.utils";
import { UserDTO } from "@dat-21/contracts";

// ========== REGISTER ==========

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = await registerService(username, email, password);

  sendResponse(res, 201, {
    message: "User registered successfully!",
    data: user,
  });
});

// ========== LOGIN ==========

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const { user, token } = await loginService(username, password);

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse<UserDTO>(res, 200, {
    message: "Login successful!",
    data: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
});

// ========== LOGOUT ==========

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  logoutService(userId);

  res.clearCookie("token");

  sendResponse(res, 200, {
    message: "Logged out successfully",
  });
});

// ========== GET CURRENT USER ==========

export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const user = await getCurrentUserService(userId);

  sendResponse(res, 200, {
    message: "User retrieved successfully",
    data: user,
  });
});