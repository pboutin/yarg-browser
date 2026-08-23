"use client";

import CharterIcon from "@/components/charter-icon";
import { Song } from "@/generated/prisma/client";
import formatDuration from "@/utilities/format-duration";
import { useEffect, useMemo, useState } from "react";
import { fetchAlbumImage } from "./actions";
import { Instrument } from "@/types";
import Image from "next/image";

interface Props {
  song: Song;
}

const SongSidePanel = ({ song }: Props) => {
  const [albumImage, setAlbumImage] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbumImage(song.directory).then(setAlbumImage);
  }, [song.directory]);

  const instruments = useMemo(() => {
    return JSON.parse(song.instrumentsJson) as Instrument[];
  }, [song.instrumentsJson]);

  return (
    <div className="flex-1 max-w-(--sidebar-width) min-h-0 overflow-y-auto">
      <div className="bg-background flex flex-col gap-4">
        {albumImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`data:image/jpeg;base64,${albumImage}`}
            alt={song.album ?? "album artwork"}
            className="w-full"
          />
        ) : null}

        <div className="flex flex-col gap-1 px-4">
          <div className="text-white text-3xl font-bold">{song.name}</div>
          <div className="text-primary text-xl font-semibold">
            {song.artist}
          </div>
          <div className="text-secondary text-lg font-semibold">
            {song.album}
          </div>
        </div>

        <div className="px-4 text-md text-white font-bold uppercase flex flex-col gap-2">
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
          <div>
            <div className="text-gray-400 font-semibold text-sm">
              CHARTED FOR
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {instruments.map((instrument) => (
                <Image
                  key={instrument}
                  src={`/instruments/${instrument}.png`}
                  alt={instrument.toString()}
                  width={60}
                  height={60}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongSidePanel;
