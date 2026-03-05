import { Types } from "mongoose";
import { SongStatus } from "../enums";

// ========== DTOs ==========

export interface CreateSongDTO {
  title: string;
  artist: string;
  album?: string;
  genres?: string[];
}

export interface UpdateSongDTO {
  title?: string;
  artist?: string;
  album?: string;
  genres?: string[];
}

export interface SongResponseDTO {
  id: Types.ObjectId;
  title: string;
  artist: string;
  album?: string;
  genres: string[];
  fileUrl: string;
  duration: number;
  size: number;
  coverUrl?: string;
  plays: number;
  likes: number;
  status: SongStatus;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface SongListResponseDTO {
  page: number;
  limit: number;
  total: number;
  songs: SongResponseDTO[];
}

export interface PendingSongsResponseDTO {
  total: number;
  songs: SongResponseDTO[];
}

// ========== Upload Types ==========

export interface CloudinaryUploadOptions {
  resource_type: "video" | "image" | "raw" | "auto";
  folder: string;
  public_id?: string;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  bytes: number;
  duration?: number;
}
