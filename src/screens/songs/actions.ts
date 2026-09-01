"use server";

import type { SearchQuery } from "@/repositories/songs";
import * as SongsRepository from "@/repositories/songs";
import * as ScoresRepository from "@/repositories/scores";
import { cookies } from "next/headers";

export type SearchResult = Awaited<ReturnType<typeof search>>;

export const search = async (searchQuery: SearchQuery, skip?: number) => {
  const cookieStore = await cookies();
  const activePlayerId = cookieStore.get("active-player")?.value;

  const searchResult = await SongsRepository.search(searchQuery, skip);

  const songChecksums = searchResult.songs.map((song) => song.checksum);

  const personalBests = activePlayerId
    ? await ScoresRepository.personalBestsByInstrumentsForSong(
        activePlayerId,
        songChecksums,
      )
    : [];

  const latestPlayedAt = activePlayerId
    ? await ScoresRepository.latestPlayedAtForSongs(
        activePlayerId,
        songChecksums,
      )
    : [];

  return {
    ...searchResult,
    songs: searchResult.songs.map((song, index) => {
      return {
        ...song,
        personalBests: personalBests[index],
        latestPlayedAt: latestPlayedAt[index],
      };
    }),
  };
};

export const countForArtist = async (
  artist: string,
  searchQuery: SearchQuery,
) => {
  return SongsRepository.countForArtist(artist, searchQuery);
};
