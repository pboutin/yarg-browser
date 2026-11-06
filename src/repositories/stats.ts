import prismaClient from "@/repositories/_prisma-client";
import { historyForPlayer } from "@/repositories/scores";
import { buildPlayerStats, type StatsSong } from "@/utilities/player-stats";

export const forPlayer = async (playerId: string) => {
  const history = await historyForPlayer(playerId);
  const checksums = [...new Set(history.map((score) => score.checksum))];
  const songs: StatsSong[] = [];

  for (let offset = 0; offset < checksums.length; offset += 500) {
    songs.push(...await prismaClient.song.findMany({
      where: { checksum: { in: checksums.slice(offset, offset + 500) } },
      select: {
        id: true,
        checksum: true,
        name: true,
        artist: true,
        length: true,
      },
    }));
  }

  return buildPlayerStats(history, songs);
};