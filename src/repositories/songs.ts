import prismaClient from "@/repositories/_prisma-client";

const PER_PAGE = 20;

export async function search(query: string, skip: number = 0) {
  const songs = await prismaClient.song.findMany({
    where: {
      AND: query.split(" ").map((subQuery) => ({
        OR: [
          { name: { contains: subQuery } },
          { artist: { contains: subQuery } },
        ],
      })),
    },
    orderBy: {
      name: "asc",
    },
    take: PER_PAGE + 1,
    skip,
  });

  return {
    songs: songs.slice(0, PER_PAGE),
    hasMore: songs.length > PER_PAGE,
  };
}
