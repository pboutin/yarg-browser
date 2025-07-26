import prismaClient from "@/repositories/_prisma-client";

const PER_PAGE = 20;

const searchQuery = (query: string) => {
  return {
    AND: query.split(" ").map((subQuery) => ({
      OR: [
        { name: { contains: subQuery } },
        { artist: { contains: subQuery } },
      ],
    })),
  };
};

export const search = async (query: string, skip: number = 0) => {
  const songs = await prismaClient.song.findMany({
    where: searchQuery(query),
    orderBy: [{ artist: "asc" }, { name: "asc" }],
    take: PER_PAGE + 1,
    skip,
  });

  return {
    songs: songs.slice(0, PER_PAGE),
    hasMore: songs.length > PER_PAGE,
  };
};

export const countForArtist = async (artist: string, query?: string) => {
  const count = await prismaClient.song.count({
    where: {
      ...(query ? searchQuery(query) : {}),
      artist,
    },
  });

  return count;
};
