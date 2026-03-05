import mongoose from "mongoose";
import { Playlist, IPlaylist } from "../models/playlist.model";

export const findPlaylistsByUser = async (
  userId: string
): Promise<IPlaylist[]> => {
  return Playlist.find({ user: userId }).populate(
    "songs",
    "title artist coverUrl duration"
  );
};

export const findPlaylistById = async (
  id: string
): Promise<IPlaylist | null> => {
  return Playlist.findById(id);
};

export const createPlaylist = async (
  data: Partial<IPlaylist>
): Promise<IPlaylist> => {
  const playlist = new Playlist(data);
  return playlist.save();
};

export const deletePlaylistById = async (
  id: string
): Promise<IPlaylist | null> => {
  return Playlist.findByIdAndDelete(id);
};

export const savePlaylist = async (
  playlist: IPlaylist
): Promise<IPlaylist> => {
  return playlist.save();
};
