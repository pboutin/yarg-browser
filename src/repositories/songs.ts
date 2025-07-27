import prismaClient from "@/repositories/_prisma-client";
const PER_PAGE = 20;

export interface SearchQuery {
  query: string;
  guitar?: boolean;
  bass?: boolean;
  drums?: boolean;
  vocals?: boolean;
}

const prismaSearchQuery = (searchQuery: SearchQuery) => {
  return {
    AND: searchQuery.query.split(" ").map((subQuery) => ({
      OR: [
        { name: { contains: subQuery } },
        { artist: { contains: subQuery } },
      ],
    })),
    ...(searchQuery.guitar && { difficultyGuitar: { not: null } }),
    ...(searchQuery.bass && { difficultyBass: { not: null } }),
    ...(searchQuery.drums && { difficultyDrums: { not: null } }),
    ...(searchQuery.vocals && { difficultyVocals: { not: null } }),
  };
};

export const search = async (searchQuery: SearchQuery, skip: number = 0) => {
  const songs = await prismaClient.song.findMany({
    where: prismaSearchQuery(searchQuery),
    orderBy: [{ artist: "asc" }, { name: "asc" }],
    take: PER_PAGE + 1,
    skip,
  });

  const total =
    skip === 0
      ? await prismaClient.song.count({
          where: prismaSearchQuery(searchQuery),
        })
      : null;

  return {
    total,
    songs: songs.slice(0, PER_PAGE),
    hasMore: songs.length > PER_PAGE,
  };
};

export const countForArtist = async (
  artist: string,
  searchQuery?: SearchQuery
) => {
  const count = await prismaClient.song.count({
    where: {
      ...(searchQuery ? prismaSearchQuery(searchQuery) : {}),
      artist,
    },
  });

  return count;
};
