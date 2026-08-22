"use server";

import type { SearchQuery } from "@/repositories/songs";
import * as SongsRepository from "@/repositories/songs";

export const search = async (searchQuery: SearchQuery, skip?: number) => {
  return SongsRepository.search(searchQuery, skip);
};

export const countForArtist = async (
  artist: string,
  searchQuery: SearchQuery,
) => {
  return SongsRepository.countForArtist(artist, searchQuery);
};
