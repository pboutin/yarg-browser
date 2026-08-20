import prismaClient from "@/repositories/_prisma-client";

export const create = async (songId: string, requestedBy: string) => {
  const songRequest = await prismaClient.songRequest.create({
    data: { songId, requestedBy },
  });
  return songRequest;
};

export const discard = async (songRequestId: string) => {
  await prismaClient.songRequest.delete({
    where: { id: songRequestId },
  });
};

export const count = async () => {
  const count = await prismaClient.songRequest.count();
  return count;
};
