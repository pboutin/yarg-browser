import prismaClient from "@/repositories/_prisma-client";

export function search(query: string) {
  return prismaClient.song.findMany({
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
    take: 20,
  });
}
