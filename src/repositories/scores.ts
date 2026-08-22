import prismaScoresClient from "@/repositories/_prisma-scores-client";
import { CompleteScore, Difficulty, Instrument } from "@/types";

/** .NET DateTime ticks (100ns since 0001-01-01) → JS Date */
const ticksToDate = (ticks: bigint): Date => {
  const epochTicks = BigInt("621355968000000000");
  return new Date(Number((ticks - epochTicks) / BigInt(10000)));
};

export const findAll = async (
  songChecksum: string,
  playerId: string,
  instrument: Instrument,
  difficulty: Difficulty,
): Promise<CompleteScore[]> => {
  const scores = await prismaScoresClient.playerScore.findMany({
    where: {
      playerId,
      instrument,
      difficulty,
      gameRecord: {
        songChecksum: Buffer.from(songChecksum, "hex"),
      },
    },
    include: {
      gameRecord: true,
    },
    orderBy: {
      gameRecord: {
        date: "desc",
      },
    },
  });

  return scores.flatMap((score) => {
    const { gameRecord } = score;
    if (
      gameRecord?.date == null ||
      gameRecord.gameVersion == null ||
      score.score == null ||
      score.stars == null ||
      score.percent == null ||
      score.notesHit == null ||
      score.notesMissed == null ||
      score.isFc == null
    ) {
      return [];
    }

    return [
      {
        id: score.id.toString(),
        date: ticksToDate(gameRecord.date),
        gameVersion: gameRecord.gameVersion,
        score: score.score,
        stars: score.stars,
        percent: score.percent,
        notesHit: score.notesHit,
        notesMissed: score.notesMissed,
        isFc: score.isFc !== 0,
      },
    ];
  });
};
