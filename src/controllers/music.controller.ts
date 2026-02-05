import { Request, Response } from "express";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary";
import { Readable } from "stream";
import { parseBuffer } from "music-metadata";
import { Song } from "../models";

// ✅ Helper: Convert buffer to stream (cho Cloudinary)
const bufferToStream = (buffer: Buffer): Readable => {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
};

// Public - Lấy tất cả bài hát
export const getAllSongs = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const songs = await Song.find() // query all songs trong collection của MongoDB  == SELECT * FROM Songs
      .populate("artist album") // join trong MongoDB (Mongoose làm hộ).populate tương tự JOIN trong SQL
      .skip((page - 1) * limit) // skip giúp bỏ qua số lượng record đầu tiên
      .limit(limit); // giới hạn số lượng record trả về

    const total = await Song.countDocuments(); // đếm tổng số bài hát trong collection

    res.status(200).json({
      page,
      limit, 
      total,
      songs,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



// ✅ Public - Lấy 1 bài hát
export const getSongById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId trước tránh crash
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid song ID"
      });
    }

    const song = await Song.findById(id)
      .populate("artist album");

    if (!song) {
      return res.status(404).json({
        message: "Song not found"
      });
    }

    res.status(200).json({
      message: "Song fetched successfully",
      song
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Cần login - Lấy playlists của user
export const getMyPlaylists = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const username = req.user!.username;
    
    res.json({ 
      message: `Playlists của ${username}`,
      userId,
      playlists: [
        { id: 1, name: "My Favorites", userId }
      ]
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Cần login - Tạo playlist
export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const userId = req.user!.id;
    
    res.status(201).json({ 
      message: "Playlist created",
      playlist: { id: Date.now(), name, userId }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ Admin only - Upload bài hát lên Cloudinary
export const uploadSong = async (req: Request, res: Response) => {
  try {
    // 1. Validate file upload
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    if (!files || !files.audio || files.audio.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No audio file uploaded. Please provide an audio file.",
      });
    }

    const audioFile = files.audio[0];
    const coverFile = files.coverImage ? files.coverImage[0] : null;

    const { title, artist, album, genres } = req.body;

    // 2. Validate required fields
    if (!title || !artist) {
      return res.status(400).json({
        success: false,
        message: "Title and artist are required",
      });
    }

    // 3. Upload audio lên Cloudinary
    const uploadAudioPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // Cloudinary dùng "video" cho audio files
          folder: "music_uploads", // Folder trong Cloudinary
          public_id: `${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, "_")}`,
          format: "mp3", // Convert về mp3
        },
        (error: any, result: any) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      bufferToStream(audioFile.buffer).pipe(uploadStream);
    });

    const uploadAudioResult: any = await uploadAudioPromise;

    // 4. Upload cover image lên Cloudinary (nếu có)
    let coverImageUrl = "";
    let coverImageKey = "";
    
    if (coverFile) {
      const uploadCoverPromise = new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: "music_covers",
            public_id: `cover-${Date.now()}-${title.replace(/[^a-zA-Z0-9]/g, "_")}`,
          },
          (error: any, result: any) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        bufferToStream(coverFile.buffer).pipe(uploadStream);
      });

      const uploadCoverResult: any = await uploadCoverPromise;
      coverImageUrl = uploadCoverResult.secure_url;
      coverImageKey = uploadCoverResult.public_id;
    }

    // 5. Lấy metadata (duration) từ file audio
    let duration = 0;
    try {
      const metadata = await parseBuffer(audioFile.buffer, {
        mimeType: audioFile.mimetype,
      });
      duration = Math.floor(metadata.format.duration || 0);
    } catch (metaError) {
      console.warn("Cannot parse audio metadata:", metaError);
      // Nếu không đọc được, dùng duration từ Cloudinary
      duration = Math.floor(uploadAudioResult.duration || 0);
    }

    // 6. Lưu vào MongoDB
    const newSong = new Song({
      title,
      artist: artist, // Có thể là string hoặc ObjectId
      album: album || undefined,
      fileUrl: uploadAudioResult.secure_url, // URL từ Cloudinary
      fileKey: uploadAudioResult.public_id, // Public ID để xóa sau
      duration,
      size: audioFile.size,
      coverUrl: coverImageUrl || undefined,
      genres: genres || undefined,
      uploadedBy: req.user!.id,
    });

    await newSong.save();

    // 7. Trả về response
    res.status(201).json({
      success: true,
      message: "Song uploaded successfully to Cloudinary",
      song: {
        _id: newSong._id,
        title: newSong.title,
        artist: newSong.artist,
        songUrl: uploadAudioResult.secure_url,
        publicId: uploadAudioResult.public_id,
        coverUrl: coverImageUrl || null,
        size: audioFile.size,
        duration,
        genres: newSong.genres,
        uploadedBy: req.user!.username,
        uploadedAt: newSong.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Upload song error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to upload song to Cloudinary",
    });
  }
};

// ✅ Admin only - Xóa bài hát (xóa cả trên Cloudinary)
export const deleteSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid song ID" });
    }

    // Tìm song trong MongoDB
    const song = await Song.findById(id);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    // Xóa file trên Cloudinary
    try {
      await cloudinary.uploader.destroy(song.fileKey, {
        resource_type: "video", // Audio files dùng resource_type "video"
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary deletion error:", cloudinaryError);
      // Tiếp tục xóa trong DB dù Cloudinary lỗi
    }

    // Xóa trong MongoDB
    await Song.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Song deleted successfully from Cloudinary and database",
    });
  } catch (error: any) {
    console.error("Delete song error:", error);
    res.status(500).json({
      message: error.message || "Failed to delete song",
    });
  }
};

// ✅ Admin only - Xóa user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `User ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin hoặc Moderator - Cập nhật bài hát
export const updateSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, artist } = req.body;
    
    res.json({ 
      message: `Song ${id} updated`,
      song: { id, title, artist }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin hoặc Moderator - Duyệt bài hát
export const approveSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Song ${id} approved` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Owner hoặc Admin - Cập nhật playlist
export const updatePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    res.json({ 
      message: `Playlist ${id} updated`,
      playlist: { id, name }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Owner hoặc Admin - Xóa playlist
export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ message: `Playlist ${id} deleted` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Optional auth - Recommendations
export const getRecommendations = async (req: Request, res: Response) => {
  try {
    if (req.user) {
      // User đã login - personalized
      res.json({ 
        message: "Personalized recommendations",
        username: req.user.username,
        songs: [
          { id: 1, title: "Based on your history" }
        ]
      });
    } else {
      // Guest - general
      res.json({ 
        message: "General recommendations",
        songs: [
          { id: 1, title: "Popular song" }
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};