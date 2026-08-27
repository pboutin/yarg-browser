import SongScreen from "@/screens/song";
import * as SongsRepository from "@/repositories/songs";
import * as ScoresRepository from "@/repositories/scores";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { Difficulty, Instrument } from "@/types";

type RawSearchParams = Promise<{ instrument: string; difficulty: string }>;

interface Props {
  params: Promise<{ id: string }>;
  searchParams: RawSearchParams;
}

const parseSearchParams = async (
  searchParams: RawSearchParams,
): Promise<{
  instrument: Instrument | undefined;
  difficulty: Difficulty | undefined;
}> => {
  const { instrument, difficulty } = await searchParams;
  return {
    instrument: instrument ? Number(instrument) : undefined,
    difficulty: difficulty ? Number(difficulty) : undefined,
  };
};

const SongPage = async ({ params, searchParams }: Props) => {
  const cookieStore = await cookies();
  const activePlayerId = cookieStore.get("active-player")?.value;

  if (!activePlayerId) {
    notFound();
  }

  const { id } = await params;
  const { instrument: instrumentParam, difficulty: difficultyParam } =
    await parseSearchParams(searchParams);

  const song = await SongsRepository.get(id);

  if (!song) {
    notFound();
  }

  const latestScore = await ScoresRepository.findLatestForPlayer(
    activePlayerId,
    song.checksum,
  );

  if (!latestScore) {
    notFound();
  }

  const playedInstruments = await ScoresRepository.playedInstrumentsForSong(
    activePlayerId,
    song.checksum,
  );

  const activeInstrument = instrumentParam ?? latestScore.instrument;

  const playedDifficulties = await ScoresRepository.playedDifficultiesForSong(
    activePlayerId,
    song.checksum,
    activeInstrument,
  );

  const activeDifficulty =
    difficultyParam ?? playedDifficulties[playedDifficulties.length - 1];

  const scores = await ScoresRepository.findAll(
    activePlayerId,
    song.checksum,
    activeInstrument,
    activeDifficulty,
  );

  return (
    <SongScreen
      song={song}
      scores={scores}
      playedInstruments={playedInstruments}
      playedDifficulties={playedDifficulties}
      activeInstrument={activeInstrument}
      activeDifficulty={activeDifficulty}
    />
  );
};

export default SongPage;
