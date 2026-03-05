import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.utils";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};