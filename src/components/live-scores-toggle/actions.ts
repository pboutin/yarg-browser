"use server";

import { cookies } from "next/headers";
import * as ScoresRepository from "@/repositories/scores";
import * as SongsRepository from "@/repositories/songs";

export const fetchLatestScoreMetadata = async () => {
  const cookieStore = await cookies();
  const activePlayerId = cookieStore.get("active-player")?.value;
  if (!activePlayerId) return null;

  return ScoresRepository.findLatestForPlayer(activePlayerId);
};

export const fetchSongId = async (
  songChecksum: string,
): Promise<string | null> => {
  const song = await SongsRepository.getByChecksum(songChecksum);
  if (!song) return null;
  return song.id;
};
