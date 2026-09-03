import type { SearchResult } from "./actions";

export type SongsListCache = {
  query: string;
  songs: SearchResult["songs"];
  hasMore: boolean;
  total: number | null;
  selectedSongId: string | null;
  scrollTop: number;
};

let cache: SongsListCache | null = null;

export const getSongsListCache = (): SongsListCache | null => cache;

export const setSongsListCache = (next: SongsListCache): void => {
  cache = next;
};

export const clearSongsListCache = (): void => {
  cache = null;
};
