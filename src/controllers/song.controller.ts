import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.utils";
import * as songService from "../services/song.service";

// PUBLIC
export const getAllSongs = asyncHandler(async (req: Request, res: Response) => {
    const result = await songService.getAllSongsService(req.query);
    res.json(result);
});

export const getSongById = asyncHandler(async (req: Request, res: Response) => {
    const song = await songService.getSongByIdService(req.params.id);
    res.json({ song });
});

// ADMIN
export const getPendingSongs = asyncHandler(async (req: Request, res: Response) => {
    const result = await songService.getPendingSongsService();
    res.json(result);
});

export const uploadSong = asyncHandler(async (req: any, res: Response) => {
    const song = await songService.uploadSongService(
        req.files,
        req.body,
        req.user
    );

    res.status(201).json({
        message: "Song uploaded successfully",
        song,
    });
});

// ADMIN - Delete song
export const deleteSong = asyncHandler(async (req: Request, res: Response) => {
    await songService.deleteSongService(req.params.id);

    res.json({
        success: true,
        message: "Song deleted successfully",
    });
});

// ADMIN - Update song
export const updateSong = asyncHandler(async (req: Request, res: Response) => {
    const song = await songService.updateSongService(
        req.params.id,
        req.body
    );

    res.json({
        success: true,
        message: "Song updated successfully",
        song,
    });
});

// ADMIN - Approve song
export const approveSong = asyncHandler(async (req: Request, res: Response) => {
    const song = await songService.approveSongService(req.params.id);

    res.json({
        success: true,
        message: "Song approved successfully",
        song,
    });
});