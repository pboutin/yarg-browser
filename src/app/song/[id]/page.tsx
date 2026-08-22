import SongScreen from "@/screens/song";
import * as SongsRepository from "@/repositories/songs";
import * as ScoresRepository from "@/repositories/scores";
import { notFound } from "next/navigation";
import { Difficulty, Instrument } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

const SongPage = async ({ params }: Props) => {
  const { id } = await params;

  const song = await SongsRepository.get(id);

  if (!song) {
    notFound();
  }

  const scores = await ScoresRepository.findAll(
    song.checksum,
    "316bd1b0-f06f-4526-b316-d4d50fa6c056", // InfaMc
    Instrument.ProDrums,
    Difficulty.Expert,
  );

  return <SongScreen song={song} scores={scores} />;
};

export default SongPage;
