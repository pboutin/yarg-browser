"use client";

import CharterIcon from "@/components/charter-icon";
import formatDuration from "@/utilities/format-duration";
import { useState } from "react";
import { Song } from "@/types";
import Instruments from "@/components/instruments";
import { getSongAlbumImageUrl } from "@/utilities/songs";

interface Props {
  song: Song;
}

const SongSidePanel = ({ song }: Props) => {
  const [hasImageError, setHasImageError] = useState<boolean>(false);

  return (
    <div className="flex-1 max-w-(--sidebar-width) min-h-0 overflow-y-auto">
      <div className="bg-background flex flex-col gap-4">
        <div className="relative">
          {!hasImageError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={song.id}
              src={getSongAlbumImageUrl(song.id)}
              alt={song.album ?? "album artwork"}
              className="w-full"
              onError={() => setHasImageError(true)}
            />
          ) : null}

          <div className="flex flex-col gap-1 px-4 pt-12 absolute bottom-0 left-0 right-0 bg-linear-to-b from-background/0 via-background/60 via-40% to-background">
            <div className="text-white text-3xl font-bold">{song.name}</div>
            <div className="text-primary text-xl font-semibold">
              {song.artist}
            </div>
            <div className="text-secondary text-lg font-semibold">
              {song.album}
            </div>
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
            <div className="text-gray-400 font-semibold text-sm mb-2">
              CHARTED FOR
            </div>
            <Instruments instruments={song.instruments} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongSidePanel;
