"use client";

import SongSidePanel from "@/components/song-side-panel";
import { CompleteScore, Song } from "@/types";
import { useMemo } from "react";
import ScoresHistory from "@/screens/song/scores-history";

interface Props {
  song: Song;
  scores: CompleteScore[];
  fetchAlbumImage: (songDirectory: string) => Promise<string>;
}

const SongScreen = ({ song, scores, fetchAlbumImage }: Props) => {
  const bestScore = useMemo(() => {
    return scores.reduce((best, score) => {
      return score.score > best.score ? score : best;
    }, scores[0]);
  }, [scores]);

  return (
    <div className="flex h-full">
      <ScoresHistory scores={scores} bestScore={bestScore} />
      <div className="flex-1 ">CHARTS</div>
      <SongSidePanel song={song} fetchAlbumImage={fetchAlbumImage} />
    </div>
  );
};

export default SongScreen;
