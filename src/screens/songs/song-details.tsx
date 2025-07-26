import CharterIcon from "@/components/charter-icon";
import { Instruments } from "@/components/instruments";
import { Song } from "@/generated/prisma";
import formatDuration from "@/utilities/format-duration";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  song: Song;
  fetchAlbumImage: (songDirectory: string) => Promise<string>;
}
// <CharterIcon charterId={song.charterId} size={32} />
const SongDetails = ({ song, fetchAlbumImage }: Props) => {
  const [albumImage, setAlbumImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbumImage(song.directory).then(setAlbumImage);
  }, [song.directory, fetchAlbumImage]);

  return (
    <div className="fixed right-0 w-1/4 top-29 pr-4">
      <div className="bg-background flex flex-col gap-4">
        {albumImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/jpeg;base64,${albumImage}`}
            alt={song.album ?? "album artwork"}
            className="w-full"
          />
        ) : null}

        <div className="flex flex-col gap-1">
          <div className="text-white text-3xl font-bold">{song.name}</div>
          <div className="text-primary text-xl font-semibold">
            {song.artist}
          </div>
          <div className="text-secondary text-lg font-semibold">
            {song.album}
          </div>
        </div>

        <div className="py-4 px-2 text-md text-white font-bold uppercase flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="text-gray-400 font-semibold text-sm">CHARTER</div>
            <div className="flex items-center gap-2">
              <CharterIcon charterId={song.charterId} size={24} />{" "}
              {song.charter}
            </div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-400 font-semibold text-sm">GENRE</div>
            <div>{song.genre}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-400 font-semibold text-sm">YEAR</div>
            <div>{song.year}</div>
          </div>
          <div className="flex justify-between">
            <div className="text-gray-400 font-semibold text-sm">LENGTH</div>
            <div>{formatDuration(song.length)}</div>
          </div>
        </div>
      </div>

      <Instruments
        className="mt-4 justify-between"
        size={64}
        guitar={song.difficultyGuitar}
        bass={song.difficultyBass}
        drums={song.difficultyDrums}
        vocals={song.difficultyVocals}
      />
    </div>
  );
};

export default SongDetails;
