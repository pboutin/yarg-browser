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

  const masteredInstruments = activePlayerId
    ? await ScoresRepository.masteredInstrumentsForSongs(
        activePlayerId,
        searchResult.songs.map((song) => song.checksum),
      )
    : [];

  return {
    ...searchResult,
    songs: searchResult.songs.map((song, index) => ({
      ...song,
      masteredInstruments: masteredInstruments[index],
    })),
  };
};

export const countForArtist = async (
  artist: string,
  searchQuery: SearchQuery,
) => {
  return SongsRepository.countForArtist(artist, searchQuery);
};
