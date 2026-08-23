"use server";

import * as ScoresRepository from "@/repositories/scores";
import * as SongsRepository from "@/repositories/songs";

const PLAYER_ID = "316bd1b0-f06f-4526-b316-d4d50fa6c056"; // InfaMc

export const fetchLatestScoreMetadata = async () => {
  return ScoresRepository.findLatestForPlayer(PLAYER_ID);
};

export const fetchSongId = async (
  songChecksum: string,
): Promise<string | null> => {
  const song = await SongsRepository.getByChecksum(songChecksum);
  if (!song) return null;
  return song.id;
};
