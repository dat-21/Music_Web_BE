import { Types } from "mongoose";

// ========== DTOs ==========

export interface CreatePlaylistDTO {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdatePlaylistDTO {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface PlaylistResponseDTO {
  id: Types.ObjectId;
  name: string;
  description?: string;
  user: Types.ObjectId;
  songs: Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
}

export interface PlaylistListResponseDTO {
  total: number;
  playlists: PlaylistResponseDTO[];
}
