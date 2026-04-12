import { Types } from "mongoose";
import { UserRole } from "../enums";

// ========== Entity Interfaces ==========

export interface IListenHistoryItem {
  songId: Types.ObjectId;
  position: number;
  updatedAt: Date;
}

// ========== DTOs ==========

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface UserResponseDTO {
  id: Types.ObjectId;
  username: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: Date;
}

export interface LoginResponseDTO {
  id: Types.ObjectId;
  username: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
}

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];
}
