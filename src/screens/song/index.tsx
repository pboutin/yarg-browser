"use client";

import SongSidePanel from "@/components/song-side-panel";
import { Song } from "@/types";

interface Props {
  song: Song;
  fetchAlbumImage: (songDirectory: string) => Promise<string>;
}

const SongScreen = ({ song, fetchAlbumImage }: Props) => {
  return (
    <div className="flex h-full">
      <div className="flex-1 max-w-(--sidebar-width) min-h-0 overflow-y-auto">
        STATS
      </div>
      <div className="flex-1 ">CHARTS</div>
      <SongSidePanel song={song} fetchAlbumImage={fetchAlbumImage} />
    </div>
  );
};

export default SongScreen;
