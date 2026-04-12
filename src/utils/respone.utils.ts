// BE: src/utils/respone.utils.ts
import { Response } from "express";
import { ApiResponse } from "../../../shared/contracts"; // ← thêm dòng này

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  options: {
    message?: string;
    data?: T;
  }
) => {
  const response: ApiResponse<T> = {  // ← dùng type từ shared
    success: statusCode < 400,
    message: options.message,
    data: options.data,
  };

  return res.status(statusCode).json(response);
};

export const sendErrorResponse = <T = unknown>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
) => {
  const response: ApiResponse<T> = {
    success: false,
    message,
    data,
  };

  return res.status(statusCode).json(response);
};