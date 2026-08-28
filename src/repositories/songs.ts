import prismaClient from "@/repositories/_prisma-client";
import { Song as PrismaSong } from "@/generated/prisma/client";
import { Song } from "@/types";
const PER_PAGE = 20;

export interface SearchQuery {
  query: string;
}

const parseSong = (song: PrismaSong): Song => {
  return {
    ...song,
    instruments: JSON.parse(song.instrumentsJson),
  };
};
const parseSongs = (songs: PrismaSong[]): Song[] => songs.map(parseSong);

const prismaSearchQuery = (searchQuery: SearchQuery) => {
  return {
    AND: searchQuery.query.split(" ").map((subQuery) => ({
      OR: [
        { name: { contains: subQuery } },
        { artist: { contains: subQuery } },
      ],
    })),
  };
};

export const get = async (id: string): Promise<Song | null> => {
  const song = await prismaClient.song.findUnique({
    where: { id },
  });

  return song ? parseSong(song) : null;
};

export const getByChecksum = async (checksum: string): Promise<Song | null> => {
  const song = await prismaClient.song.findUnique({
    where: { checksum },
  });

  return song ? parseSong(song) : null;
};

export const countAll = async () => {
  return await prismaClient.song.count();
};

export const search = async (
  searchQuery: SearchQuery,
  skip: number = 0,
): Promise<{ total: number; songs: Song[]; hasMore: boolean }> => {
  const songs = await prismaClient.song.findMany({
    where: prismaSearchQuery(searchQuery),
    orderBy: [{ artist: "asc" }, { name: "asc" }],
    take: PER_PAGE + 1,
    skip,
  });

  const total = await prismaClient.song.count({
    where: prismaSearchQuery(searchQuery),
  });

  return {
    total,
    songs: parseSongs(songs.slice(0, PER_PAGE)),
    hasMore: songs.length > PER_PAGE,
  };
};

export const countForArtist = async (
  artist: string,
  searchQuery?: SearchQuery,
) => {
  const count = await prismaClient.song.count({
    where: {
      ...(searchQuery ? prismaSearchQuery(searchQuery) : {}),
      artist,
    },
  });

  return count;
};

export const upsert = async (song: Omit<Song, "id">) => {
  const { instruments, ...rest } = song;
  const data = {
    ...rest,
    instrumentsJson: JSON.stringify(instruments),
  };

  await prismaClient.song.upsert({
    where: { checksum: song.checksum },
    update: data,
    create: data,
  });
};
