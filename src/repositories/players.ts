import prismaScoresClient from "@/repositories/_prisma-scores-client";
import { Player } from "@/types";

export const getAll = async (): Promise<Player[]> => {
  return prismaScoresClient.player.findMany();
};
