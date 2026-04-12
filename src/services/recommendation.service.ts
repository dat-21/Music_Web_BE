import { songRepository } from "../repositories";
import { ISong } from "../models/song.model";

export const getPersonalizedRecommendations = async (
  username: string
): Promise<{ username: string; songs: ISong[] }> => {
  const songs = await songRepository.findApprovedSongsSortedByPlays(10);
  return { username, songs };
};

export const getGeneralRecommendations = async (): Promise<{ songs: ISong[] }> => {
  const songs = await songRepository.findApprovedSongsSortedByDate(10);
  return { songs };
};