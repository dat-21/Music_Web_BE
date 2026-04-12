import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.utils";
import { sendErrorResponse } from "../utils/respone.utils";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return sendErrorResponse(res, err.statusCode, err.message);
  }

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  return sendErrorResponse(res, 500, "Internal Server Error");
};