import SongCount from "@/components/song-count";
import * as SongRepository from "@/repositories/songs";
import { useEffect, useState } from "react";

interface Props {
  artist: string;
  searchQuery: SongRepository.SearchQuery;
  countForArtist: (
    artist: string,
    searchQuery: SongRepository.SearchQuery
  ) => Promise<number>;
  className?: string;
}

const ArtistHeader = ({
  artist,
  searchQuery,
  countForArtist,
  className,
}: Props) => {
  const [songCount, setSongCount] = useState<number | null>(null);

  useEffect(() => {
    countForArtist(artist, searchQuery).then((count) => setSongCount(count));
  }, [countForArtist, artist, searchQuery]);

  return (
    <div
      className={`flex items-center gap-2 pl-16 py-2 pr-4 bg-gradient-to-b from-layout-dark to-transparent ${className}`}
    >
      <div className="text-white text-xl font-bold">{artist}</div>
      {songCount ? <SongCount count={songCount} /> : null}
    </div>
  );
};

export default ArtistHeader;
