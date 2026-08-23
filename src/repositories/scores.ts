import prismaScoresClient from "@/repositories/_prisma-scores-client";
import { CompleteScore, Difficulty, Instrument, ScoreMetadata } from "@/types";

const UTC_OFFSET_MS = new Date().getTimezoneOffset() * 60000;
const EPOCH_TICKS = BigInt("621355968000000000");

/** .NET DateTime ticks (100ns since 0001-01-01) → JS Date */
const ticksToDate = (ticks: bigint): Date => {
  // YARG timestamp is in local time
  // since Date expect a unix timestamp, we need offset it back to UTC
  const cursedUtcTimestamp =
    Number((ticks - EPOCH_TICKS) / BigInt(10000)) + UTC_OFFSET_MS;
  return new Date(cursedUtcTimestamp);
};

export const findLatestForPlayer = async (
  playerId: string,
  songChecksum?: string,
): Promise<ScoreMetadata | null> => {
  const score = await prismaScoresClient.playerScore.findFirst({
    where: {
      playerId,
      instrument: { not: null },
      difficulty: { not: null },
      gameRecord: {
        date: { not: null },
        songChecksum: { not: null },
      },
      ...(songChecksum
        ? { gameRecord: { songChecksum: Buffer.from(songChecksum, "hex") } }
        : {}),
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

  return {
    playerId,
    songChecksum: Buffer.from(score!.gameRecord!.songChecksum!)
      .toString("hex")
      .toUpperCase(),
    instrument: score!.instrument as Instrument,
    difficulty: score!.difficulty as Difficulty,
  };
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

export const playedDifficultiesForSong = async (
  songChecksum: string,
  playerId: string,
): Promise<Difficulty[]> => {
  const scores = await prismaScoresClient.playerScore.findMany({
    where: {
      playerId,
      instrument: { not: null },
      difficulty: { not: null },
      gameRecord: {
        songChecksum: Buffer.from(songChecksum, "hex"),
      },
    },
  });

  return Array.from(
    new Set(scores.map<Difficulty>((score) => score.difficulty!)),
  )
    .filter((difficulty) => difficulty !== null)
    .sort();
};

export const playedInstrumentsForSong = async (
  songChecksum: string,
  playerId: string,
): Promise<Instrument[]> => {
  const scores = await prismaScoresClient.playerScore.findMany({
    where: {
      playerId,
      instrument: { not: null },
      difficulty: { not: null },
      gameRecord: {
        songChecksum: Buffer.from(songChecksum, "hex"),
      },
    },
  });

  return Array.from(
    new Set(scores.map<Instrument>((score) => score.instrument!)),
  )
    .filter((instrument) => instrument !== null)
    .sort();
};
