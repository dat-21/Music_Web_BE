import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import { sendResponse } from "../utils/respone.utils";
import {
    getMyPlaylistsService,
    createPlaylistService,
    updatePlaylistService,
    deletePlaylistService,
    addSongToPlaylistService,
    removeSongFromPlaylistService,
} from "../services";

// Cần login - Lấy playlists của user
export const getMyPlaylists = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await getMyPlaylistsService(userId);

    sendResponse(res, 200, {
        message: "Playlists retrieved successfully",
        data: result,
    });
});

// Cần login - Tạo playlist
export const createPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { name, description, isPublic } = req.body;
    const userId = req.user?.id;

    const playlist = await createPlaylistService(name, description, isPublic, userId);

    sendResponse(res, 201, {
        message: "Playlist created successfully",
        data: playlist,
    });
});

// Owner hoặc Admin - Cập nhật playlist
export const updatePlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, isPublic } = req.body;
    const userId = req.user?.id;

    const playlist = await updatePlaylistService(id, name, description, isPublic, userId);

    sendResponse(res, 200, {
        message: "Playlist updated successfully",
        data: playlist,
    });
});

// Owner hoặc Admin - Xóa playlist
export const deletePlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    await deletePlaylistService(id, userId);

    sendResponse(res, 200, {
        message: "Playlist deleted successfully",
    });
});

// Cần login - Thêm bài hát vào playlist
export const addSongToPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { songId } = req.body;
    const userId = req.user?.id;

    const playlist = await addSongToPlaylistService(id, songId, userId);

    sendResponse(res, 200, {
        message: "Song added to playlist",
        data: playlist,
    });
});

// Cần login - Xóa bài hát khỏi playlist
export const removeSongFromPlaylist = asyncHandler(async (req: Request, res: Response) => {
    const { id, songId } = req.params;
    const userId = req.user?.id;


    const playlist = await removeSongFromPlaylistService(id, songId, userId);

    sendResponse(res, 200, {
        message: "Song removed from playlist",
        data: playlist,
    });
});
