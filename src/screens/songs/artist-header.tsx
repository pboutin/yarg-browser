import { useEffect, useState } from "react";

interface Props {
  artist: string;
  query: string;
  countForArtist: (artist: string, query?: string) => Promise<number>;
}

const ArtistHeader = ({ artist, query, countForArtist }: Props) => {
  const [songCount, setSongCount] = useState<number | null>(null);

  useEffect(() => {
    countForArtist(artist, query).then((count) => setSongCount(count));
  }, [countForArtist, artist, query]);

  return (
    <div className="flex items-center gap-2 py-2">
      <span className="font-semibold">{artist}</span>

      {songCount ? (
        <span className="ml-auto text-cyan-400 text-sm">
          {songCount} SONG{songCount !== 1 ? "S" : ""}
        </span>
      ) : null}
    </div>
  );
};

export default ArtistHeader;
