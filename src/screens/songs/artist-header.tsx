"use client";

import SongCount from "@/components/song-count";
import type { SearchQuery } from "@/repositories/songs";
import { useEffect, useState } from "react";
import { countForArtist } from "./actions";

interface Props {
  artist: string;
  searchQuery: SearchQuery;
  className?: string;
}

const ArtistHeader = ({ artist, searchQuery, className }: Props) => {
  const [songCount, setSongCount] = useState<number | null>(null);

  useEffect(() => {
    countForArtist(artist, searchQuery).then((count) => setSongCount(count));
  }, [artist, searchQuery]);

  return (
    <div
      className={`flex items-center gap-2 pl-16 py-2 pr-4 bg-gradient-to-b from-layout-dark to-transparent ${className}`}
    >
      <div className="text-white/80 text-xl font-bold">{artist}</div>
      {songCount ? <SongCount count={songCount} /> : null}
    </div>
  );
};

export default ArtistHeader;
