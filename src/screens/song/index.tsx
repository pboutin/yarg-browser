"use client";

import SongSidePanel from "@/components/song-side-panel";
import { CompleteScore, Difficulty, Instrument, Song } from "@/types";
import { useMemo } from "react";
import ScoresHistory from "@/screens/song/scores-history";
import ScoresCharts from "@/screens/song/scores-charts";
import Instruments from "@/components/instruments";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import Difficulties from "@/components/difficulties";

interface Props {
  song: Song;
  scores: CompleteScore[];
  playedInstruments: Instrument[];
  playedDifficulties: Difficulty[];
  activeInstrument: Instrument;
  activeDifficulty: Difficulty;
}

const SongScreen = ({
  song,
  scores,
  playedInstruments,
  playedDifficulties,
  activeInstrument,
  activeDifficulty,
}: Props) => {
  const router = useRouter();

  const bestScore = useMemo(() => {
    return scores.reduce((best, score) => {
      return score.score > best.score ? score : best;
    }, scores[0]);
  }, [scores]);

  const handleInstrumentClick = (instrument: Instrument) => {
    router.push(`/song/${song.id}?instrument=${instrument}`);
  };

  const handleDifficultyClick = (difficulty: Difficulty) => {
    router.push(
      `/song/${song.id}?instrument=${activeInstrument}&difficulty=${difficulty}`,
    );
  };

  return (
    <div className="flex h-full">
      <ScoresHistory scores={scores} bestScore={bestScore} />
      <ScoresCharts scores={scores} />
      <div className="flex flex-col gap-4">
        <div className="text-gray-400 font-semibold text-sm mt-2 -mb-2">
          PLAYED ON
        </div>
        <Instruments
          instruments={playedInstruments}
          active={activeInstrument}
          onClick={handleInstrumentClick}
        />

        <Difficulties
          difficulties={playedDifficulties}
          active={activeDifficulty}
          onClick={handleDifficultyClick}
        />

        <SongSidePanel song={song} />
      </div>
    </div>
  );
};

export default SongScreen;
