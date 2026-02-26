import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import { Song } from "../models";
import { AppError } from "../utils/AppError.utils";
import { parseBuffer } from "music-metadata";
import { Readable } from "stream";
import slugify from "slugify";

import { uploadToCloudinary } from "../utils/cloudinary.utils";
import { getAudioDuration } from "../utils/audio.utils";


const parseGenres = (genres: any): string[] => {
  if (!genres) return [];

  if (Array.isArray(genres)) {
    return genres;
  }

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

export const getAllSongsService = async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;

    const filter = { status: "approved" };

    const songs = await Song.find(filter)
        .skip((page - 1) * limit)
        .limit(limit);

    const total = await Song.countDocuments(filter);

    return { page, limit, total, songs };
};

export const getSongByIdService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid song ID", 400);
    }

    const song = await Song.findOne({
        _id: id,
        status: "approved",
    });

    if (!song) {
        throw new AppError("Song not found", 404);
    }

    return song;
};

// ================= ADMIN =================

export const getPendingSongsService = async () => {
    const songs = await Song.find({ status: "pending" });
    return { total: songs.length, songs };
};


export const uploadSongService = async (
    files: any,
    body: any,
    currentUser: any
) => {
    if (!files?.audio?.length) {
        throw new AppError("Audio file is required", 400);
    }

    const audioFile = files.audio[0];
    const coverFile = files.coverImage?.[0];

    const { title, artist, album, genres } = body;
    const parsedGenres = parseGenres(genres);   
    if (!title || !artist) {
        throw new AppError("Title and artist are required", 400);
    }

    // Upload audio
    const uploadAudioResult: any = await uploadToCloudinary(
    audioFile.buffer,
         {
                resource_type: "video",
                folder: "music_uploads",
                public_id: `${Date.now()}-${slugify(title, { lower: true })}`
            }
    )

    // Upload cover
    let coverUrl;
    let coverKey;

    if (coverFile) {
        const uploadCover: any = await uploadToCloudinary(
            coverFile.buffer,
            {
                resource_type: "image",
                folder: "music_covers",
            }
        );

        coverUrl = uploadCover.secure_url;
        coverKey = uploadCover.public_id;
    }

        // 🔥 Lấy duration dùng util
    const duration = await getAudioDuration(
  audioFile.buffer,
  audioFile.mimetype
    );


    const newSong = await Song.create({
        title,
        artist,
        album,
        genres: parsedGenres,
        fileUrl: uploadAudioResult.secure_url,
        fileKey: uploadAudioResult.public_id,
        duration,
        size: audioFile.size,
        coverUrl,
        coverKey,
        uploadedBy: currentUser.id,
    });

    return newSong;
};


export const deleteSongService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid song ID", 400);
    }

    const song = await Song.findById(id);
    if (!song) {
        throw new AppError("Song not found", 404);
    }

    // Xóa file trên Cloudinary
    try {
        await cloudinary.uploader.destroy(song.fileKey, {
            resource_type: "video",
        });
    } catch (error) {
        console.error("Cloudinary deletion error:", error);
    }

    await Song.findByIdAndDelete(id);
};

export const updateSongService = async (
  id: string,
  data: any
) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid song ID", 400);
  }

  const { title, artist, album, genres } = data;
  const updateData: any = {};

  if (title !== undefined) updateData.title = title.trim();
  if (artist !== undefined) updateData.artist = artist.trim();
  if (album !== undefined) updateData.album = album.trim();
  if (genres !== undefined) updateData.genres = parseGenres(genres);

  if (Object.keys(updateData).length === 0) {
    throw new AppError("No data provided to update", 400);
  }

  const song = await Song.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!song) {
    throw new AppError("Song not found", 404);
  }

  return song;
};


export const approveSongService = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new AppError("Invalid song ID", 400);
    }

    const song = await Song.findById(id);
    if (!song) {
        throw new AppError("Song not found", 404);
    }

    song.status = "approved";
    await song.save();

    return song;
};