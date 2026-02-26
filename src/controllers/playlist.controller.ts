import { Request, Response } from "express";
import mongoose from "mongoose";
import { Playlist } from "../models";

// ✅ Cần login - Lấy playlists của user
export const getMyPlaylists = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const playlists = await Playlist.find({ user: userId })
            .populate("songs", "title artist coverUrl duration");

        res.json({
            total: playlists.length,
            playlists,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Cần login - Tạo playlist
export const createPlaylist = async (req: Request, res: Response) => {
    try {
        const { name, description, isPublic } = req.body;
        const userId = req.user!.id;

        if (!name) {
            return res.status(400).json({ message: "Playlist name is required" });
        }

        const newPlaylist = new Playlist({
            name,
            description: description || undefined,
            user: userId,
            songs: [],
            isPublic: isPublic || false,
        });

        await newPlaylist.save();

        res.status(201).json({
            message: "Playlist created successfully",
            playlist: newPlaylist,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Owner hoặc Admin - Cập nhật playlist
export const updatePlaylist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid playlist ID" });
        }

        const { name, description, isPublic } = req.body;

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        // Kiểm tra quyền: chỉ owner hoặc admin
        if (playlist.user.toString() !== req.user!.id && req.user!.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        if (name) playlist.name = name;
        if (description !== undefined) playlist.description = description;
        if (isPublic !== undefined) playlist.isPublic = isPublic;

        await playlist.save();

        res.json({
            message: "Playlist updated successfully",
            playlist,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Owner hoặc Admin - Xóa playlist
export const deletePlaylist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid playlist ID" });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        // Kiểm tra quyền: chỉ owner hoặc admin
        if (playlist.user.toString() !== req.user!.id && req.user!.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        await Playlist.findByIdAndDelete(id);

        res.json({
            message: "Playlist deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Cần login - Thêm bài hát vào playlist
export const addSongToPlaylist = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { songId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        // Chỉ owner mới thêm được
        if (playlist.user.toString() !== req.user!.id && req.user!.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        // Kiểm tra bài hát đã có trong playlist chưa
        if (playlist.songs.some((s) => s.toString() === songId)) {
            return res.status(400).json({ message: "Song already in playlist" });
        }

        playlist.songs.push(new mongoose.Types.ObjectId(songId));
        await playlist.save();

        res.json({
            message: "Song added to playlist",
            playlist,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Cần login - Xóa bài hát khỏi playlist
export const removeSongFromPlaylist = async (req: Request, res: Response) => {
    try {
        const { id, songId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(songId)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const playlist = await Playlist.findById(id);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found" });
        }

        if (playlist.user.toString() !== req.user!.id && req.user!.role !== "admin") {
            return res.status(403).json({ message: "Access denied" });
        }

        playlist.songs = playlist.songs.filter((s) => s.toString() !== songId);
        await playlist.save();

        res.json({
            message: "Song removed from playlist",
            playlist,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
