import { FilterQuery, UpdateQuery } from "mongoose";
import { Song, ISong } from "../models/song.model";

export const findAllSongs = async (
  filter: FilterQuery<ISong>,
  skip: number,
  limit: number
): Promise<ISong[]> => {
  return Song.find(filter).skip(skip).limit(limit);
};

export const countSongs = async (
  filter: FilterQuery<ISong>
): Promise<number> => {
  return Song.countDocuments(filter);
};

export const findSongById = async (id: string): Promise<ISong | null> => {
  return Song.findById(id);
};

export const findOneSong = async (
  filter: FilterQuery<ISong>
): Promise<ISong | null> => {
  return Song.findOne(filter);
};

export const createSong = async (
  data: Partial<ISong>
): Promise<ISong> => {
  return Song.create(data);
};

export const updateSongById = async (
  id: string,
  data: UpdateQuery<ISong>
): Promise<ISong | null> => {
  return Song.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const deleteSongById = async (id: string): Promise<ISong | null> => {
  return Song.findByIdAndDelete(id);
};

export const findSongsByStatus = async (
  status: string
): Promise<ISong[]> => {
  return Song.find({ status });
};

export const findApprovedSongsSortedByPlays = async (
  limit: number
): Promise<ISong[]> => {
  return Song.find({ status: "approved" }).sort({ plays: -1 }).limit(limit);
};

export const findApprovedSongsSortedByDate = async (
  limit: number
): Promise<ISong[]> => {
  return Song.find({ status: "approved" }).sort({ createdAt: -1 }).limit(limit);
};
