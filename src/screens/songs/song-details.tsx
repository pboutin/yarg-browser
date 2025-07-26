import { Song } from "@/generated/prisma";
import { useState } from "react";
import { useEffect } from "react";

interface Props {
  song: Song;
  fetchAlbumImage: (songDirectory: string) => Promise<string>;
}

const SongDetails = ({ song, fetchAlbumImage }: Props) => {
  const [albumImage, setAlbumImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbumImage(song.directory).then(setAlbumImage);
  }, [song.directory, fetchAlbumImage]);

  return (
    <div className="flex-1 fixed right-0 w-1/4 top-16 bg-gray-800 p-4">
      <div className="bg-gray-900 border-gray-700">
        <div className="p-4">
          {albumImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`data:image/jpeg;base64,${albumImage}`}
              alt={song.album ?? "album artwork"}
              className="w-full"
            />
          ) : null}

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">CHARTER</span>
              <span>{song.charter}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">GENRE</span>
              <span>{song.genre}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">YEAR</span>
              <span>{song.year}</span>
              <span className="text-gray-400">LENGTH</span>
              <span>{song.length}</span>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gray-600 rounded-full"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;
