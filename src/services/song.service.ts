import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import { songRepository } from "../repositories";
import { AppError } from "../utils/AppError.utils";
import slugify from "slugify";
import { uploadToCloudinary } from "../utils/cloudinary.utils";
import { getAudioDuration } from "../utils/audio.utils";
import { UpdateSongDTO } from "../types";
import { ISong } from "../models/song.model";

const parseGenres = (genres: string | string[] | undefined): string[] => {
  if (!genres) return [];
  if (Array.isArray(genres)) return genres;
  if (typeof genres === "string") {
    try {
      const parsed = JSON.parse(genres);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [genres];
    }
  }
  return [];
};

// ================= PUBLIC =================

export const getAllSongsService = async (
  page: number,
  limit: number
): Promise<{ page: number; limit: number; total: number; songs: ISong[] }> => {
  const _page = page || 1;
  const _limit = limit || 20;
  const filter = { status: "approved" };

  const songs = await songRepository.findAllSongs(filter, (_page - 1) * _limit, _limit);
  const total = await songRepository.countSongs(filter);

  return { page: _page, limit: _limit, total, songs };
};

export const getSongByIdService = async (id: string): Promise<ISong> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid song ID", 400);
  }

  const song = await songRepository.findOneSong({ _id: id, status: "approved" });
  if (!song) {
    throw new AppError("Song not found", 404);
  }

  return song;
};

// ================= ADMIN =================

export const getPendingSongsService = async (): Promise<{ total: number; songs: ISong[] }> => {
  const songs = await songRepository.findSongsByStatus("pending");
  return { total: songs.length, songs };
};

export const uploadSongService = async (
  title: string,
  artist: string,
  album: string | undefined,
  genres: string | string[] | undefined,
  audioFile: Express.Multer.File | undefined,
  coverFile: Express.Multer.File | undefined,
  userId?: string
): Promise<ISong> => {
  if (!audioFile) {
    throw new AppError("Audio file is required", 400);
  }

  if (!title || !artist) {
    throw new AppError("Title and artist are required", 400);
  }

  const parsedGenres = parseGenres(genres);

  const uploadAudioResult = await uploadToCloudinary(audioFile.buffer, {
    resource_type: "video",
    folder: "music_uploads",
    public_id: `${Date.now()}-${slugify(title, { lower: true })}`,
  });

  let coverUrl: string | undefined;

  if (coverFile) {
    const uploadCover = await uploadToCloudinary(coverFile.buffer, {
      resource_type: "image",
      folder: "music_covers",
    });
    coverUrl = uploadCover.secure_url;
  }

  const duration = await getAudioDuration(audioFile.buffer, audioFile.mimetype);

  const newSong = await songRepository.createSong({
    title,
    artist,
    album,
    genres: parsedGenres,
    fileUrl: uploadAudioResult.secure_url,
    fileKey: uploadAudioResult.public_id,
    duration,
    size: audioFile.size,
    coverUrl,
    uploadedBy: userId as unknown as mongoose.Types.ObjectId,
  });

  return newSong;
};

export const deleteSongService = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid song ID", 400);
  }

  const song = await songRepository.findSongById(id);
  if (!song) {
    throw new AppError("Song not found", 404);
  }

  try {
    await cloudinary.uploader.destroy(song.fileKey, { resource_type: "video" });
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
  }

  await songRepository.deleteSongById(id);
};

export const updateSongService = async (
  id: string,
  title?: string,
  artist?: string,
  album?: string,
  genres?: string | string[] | undefined
): Promise<ISong> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid song ID", 400);
  }

  const updateData: UpdateSongDTO = {};
  if (title !== undefined) updateData.title = title.trim();
  if (artist !== undefined) updateData.artist = artist.trim();
  if (album !== undefined) updateData.album = album.trim();
  if (genres !== undefined) updateData.genres = parseGenres(genres);

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No data provided to update", 400);
  }

  const song = await songRepository.updateSongById(id, updateData);
  if (!song) {
    throw new AppError("Song not found", 404);
  }

  return song;
};

export const approveSongService = async (id: string): Promise<ISong> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid song ID", 400);
  }

  const song = await songRepository.findSongById(id);
  if (!song) {
    throw new AppError("Song not found", 404);
  }

  song.status = "approved";
  await song.save();

  return song;
};