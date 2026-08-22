"use server";

import * as ScoresRepository from "@/repositories/scores";
import * as SongsRepository from "@/repositories/songs";

const PLAYER_ID = "316bd1b0-f06f-4526-b316-d4d50fa6c056"; // InfaMc

export const fetchLatestSongId = async () => {
  const latestScore = await ScoresRepository.findLatestForPlayer(PLAYER_ID);
  if (!latestScore) return null;
  const song = await SongsRepository.getByChecksum(latestScore.songChecksum);
  if (!song) return null;
  return song.id;
};
