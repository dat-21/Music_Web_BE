import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import {
    getAllSongsService,
    getSongByIdService,
    getPendingSongsService,
    uploadSongService,
    deleteSongService,
    updateSongService,
    approveSongService,
} from "../services";
import { sendResponse } from "../utils/respone.utils";

// PUBLIC
export const getAllSongs = asyncHandler(async (req: Request, res: Response) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const result = await getAllSongsService(page, limit);

    sendResponse(res, 200, {
        message: "Songs retrieved successfully",
        data: result,
    });
});

export const getSongById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const song = await getSongByIdService(id);

    sendResponse(res, 200, {
        message: "Song retrieved successfully",
        data: song,
    });
});

// ADMIN
export const getPendingSongs = asyncHandler(async (req: Request, res: Response) => {
    const result = await getPendingSongsService();

    sendResponse(res, 200, {
        message: "Pending songs retrieved successfully",
        data: result,
    });
});

export const uploadSong = asyncHandler(async (req: Request, res: Response) => {
    const { title, artist, album, genres } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const audioFile = files?.["audio"]?.[0];
    const coverFile = files?.["coverImage"]?.[0];
    const userId = req.user?.id;

    const song = await uploadSongService(
        title, artist, album, genres,
        audioFile, coverFile, userId
    );

    sendResponse(res, 201, {
        message: "Song uploaded successfully",
        data: song,
    });
});

// ADMIN - Delete song
export const deleteSong = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await deleteSongService(id);

    sendResponse(res, 200, {
        message: "Song deleted successfully",
    });
});

// ADMIN - Update song
export const updateSong = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, artist, album, genres } = req.body;

    const song = await updateSongService(
        id, title, artist, album, genres
    );

    sendResponse(res, 200, {
        message: "Song updated successfully",
        data: song,
    });
});

// ADMIN - Approve song
export const approveSong = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const song = await approveSongService(id);

    sendResponse(res, 200, {
        message: "Song approved successfully",
        data: song,
    });
});