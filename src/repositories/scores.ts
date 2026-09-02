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

  if (
    !score ||
    !score.gameRecord?.songChecksum ||
    score.instrument == null ||
    score.difficulty == null
  ) {
    return null;
  }

  return {
    playerId,
    songChecksum: Buffer.from(score.gameRecord.songChecksum)
      .toString("hex")
      .toUpperCase(),
    instrument: score.instrument as Instrument,
    difficulty: score.difficulty as Difficulty,
  };
};

export const findAll = async (
  playerId: string,
  songChecksum: string,
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

export const playedInstrumentsForSong = async (
  playerId: string,
  songChecksum: string,
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

export const playedDifficultiesForSong = async (
  playerId: string,
  songChecksum: string,
  instrument: Instrument,
): Promise<Difficulty[]> => {
  const scores = await prismaScoresClient.playerScore.findMany({
    where: {
      playerId,
      instrument,
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

export const personalBestsByInstrumentsForSong = async (
  playerId: string,
  songChecksums: string[],
): Promise<
  Array<
    Array<{
      instrument: Instrument;
      difficulty: Difficulty;
      stars: number;
      isFc: boolean;
    }>
  >
> => {
  const personalBests = (await Promise.all(
    songChecksums.map(
      (songChecksum) =>
        prismaScoresClient.$queryRaw`
      SELECT max(ps.Score), ps.Instrument, ps.Difficulty, ps.Stars, ps.IsFc
      FROM PlayerScores ps
      INNER JOIN GameRecords gr ON ps.GameRecordId = gr.Id
      WHERE gr.SongChecksum = ${Buffer.from(songChecksum, "hex")}
      AND ps.PlayerId = ${playerId}
      GROUP BY ps.Instrument, ps.Difficulty;
    `,
    ),
  )) as Array<
    Array<{
      Instrument: Instrument;
      Difficulty: Difficulty;
      Stars: number;
      IsFc: boolean;
    }>
  >;

  return songChecksums.map((_checksum, index) => {
    const bestsPerInstruments = personalBests[index].reduce(
      (acc, currentPersonalBest) => {
        const previousMatch = acc[currentPersonalBest.Instrument] ?? null;
        return {
          ...acc,
          [currentPersonalBest.Instrument]:
            !previousMatch ||
            previousMatch.Difficulty < currentPersonalBest.Difficulty
              ? currentPersonalBest
              : previousMatch,
        };
      },
      {} as Record<
        Instrument,
        { Difficulty: Difficulty; Stars: number; IsFc: boolean }
      >,
    );

    return Object.entries(bestsPerInstruments)
      .map(([instrument, best]) => ({
        instrument: Number(instrument) as Instrument,
        difficulty: best.Difficulty,
        stars: best.Stars,
        isFc: best.IsFc,
      }))
      .sort((a, b) => a.instrument - b.instrument);
  });
};

export const latestPlayedAtForSongs = async (
  playerId: string,
  songChecksums: string[],
): Promise<Array<Date | null>> => {
  const gameRecords = await prismaScoresClient.gameRecord.groupBy({
    by: ["songChecksum"],
    where: {
      songChecksum: {
        in: songChecksums.map((checksum) => Buffer.from(checksum, "hex")),
      },
      playerScores: {
        some: {
          playerId,
        },
      },
      date: { not: null },
    },
    _max: {
      date: true,
    },
  });

  return songChecksums.map((checksum) => {
    const gameRecordSongChecksum = Buffer.from(checksum, "hex");
    const latestGameRecord = gameRecords.find(
      (gameRecord) =>
        gameRecord.songChecksum &&
        Buffer.compare(gameRecord.songChecksum, gameRecordSongChecksum) === 0,
    );
    return latestGameRecord?._max?.date
      ? ticksToDate(latestGameRecord._max.date)
      : null;
  });
};
