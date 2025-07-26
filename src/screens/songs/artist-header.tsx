import { useEffect, useState } from "react";

interface Props {
  artist: string;
  query: string;
  countForArtist: (artist: string, query?: string) => Promise<number>;
  className?: string;
}

const ArtistHeader = ({ artist, query, countForArtist, className }: Props) => {
  const [songCount, setSongCount] = useState<number | null>(null);

  useEffect(() => {
    countForArtist(artist, query).then((count) => setSongCount(count));
  }, [countForArtist, artist, query]);

  return (
    <div
      className={`flex items-center gap-2 pl-16 py-2 pr-2 bg-gradient-to-b from-layout-dark to-transparent ${className}`}
    >
      <div className="text-white text-xl font-bold">{artist}</div>
      {songCount ? (
        <div className="ml-auto">
          <span className="text-2xl text-primary font-bold">{songCount}</span>
          <span className="text-xl text-secondary ml-2 font-semibold">
            SONG{songCount !== 1 ? "S" : ""}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default ArtistHeader;
