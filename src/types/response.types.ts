import { Response } from "express";

// ========== API Response ==========

export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
}
