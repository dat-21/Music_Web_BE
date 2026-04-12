import mongoose from "mongoose";
import { playlistRepository } from "../repositories";
import { AppError } from "../utils/AppError.utils";
import { IPlaylist } from "../models/playlist.model";

export const getMyPlaylistsService = async (
  userId?: string
): Promise<{ total: number; playlists: IPlaylist[] }> => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const playlists = await playlistRepository.findPlaylistsByUser(userId);
  return { total: playlists.length, playlists };
};

export const createPlaylistService = async (
  name: string,
  description: string | undefined,
  isPublic: boolean | undefined,
  userId?: string
): Promise<IPlaylist> => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (!name) {
    throw new AppError("Playlist name is required", 400);
  }

  const newPlaylist = await playlistRepository.createPlaylist({
    name,
    description: description || undefined,
    user: userId as unknown as mongoose.Types.ObjectId,
    songs: [],
    isPublic: isPublic || false,
  });

  return newPlaylist;
};

export const updatePlaylistService = async (
  id: string,
  name: string | undefined,
  description: string | undefined,
  isPublic: boolean | undefined,
  userId?: string
): Promise<IPlaylist> => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid playlist ID", 400);
  }

  const playlist = await playlistRepository.findPlaylistById(id);
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  if (playlist.user.toString() !== userId) {
    throw new AppError("Access denied", 403);
  }

  if (name) playlist.name = name;
  if (description !== undefined) playlist.description = description;
  if (isPublic !== undefined) playlist.isPublic = isPublic;

  await playlistRepository.savePlaylist(playlist);
  return playlist;
};

export const deletePlaylistService = async (
  id: string,
  userId?: string
): Promise<void> => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid playlist ID", 400);
  }

  const playlist = await playlistRepository.findPlaylistById(id);
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  if (playlist.user.toString() !== userId) {
    throw new AppError("Access denied", 403);
  }

  await playlistRepository.deletePlaylistById(id);
};

export const addSongToPlaylistService = async (
  id: string,
  songId: string,
  userId?: string
): Promise<IPlaylist> => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(songId)
  ) {
    throw new AppError("Invalid ID format", 400);
  }

  const playlist = await playlistRepository.findPlaylistById(id);
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  if (playlist.user.toString() !== userId) {
    throw new AppError("Access denied", 403);
  }

  if (playlist.songs.some((s) => s.toString() === songId)) {
    throw new AppError("Song already in playlist", 400);
  }

  playlist.songs.push(new mongoose.Types.ObjectId(songId));
  await playlistRepository.savePlaylist(playlist);
  return playlist;
};

export const removeSongFromPlaylistService = async (
  id: string,
  songId: string,
  userId?: string
): Promise<IPlaylist> => {
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  if (
    !mongoose.Types.ObjectId.isValid(id) ||
    !mongoose.Types.ObjectId.isValid(songId)
  ) {
    throw new AppError("Invalid ID format", 400);
  }

  const playlist = await playlistRepository.findPlaylistById(id);
  if (!playlist) {
    throw new AppError("Playlist not found", 404);
  }

  if (playlist.user.toString() !== userId) {
    throw new AppError("Access denied", 403);
  }

  playlist.songs = playlist.songs.filter((s) => s.toString() !== songId);
  await playlistRepository.savePlaylist(playlist);
  return playlist;
};