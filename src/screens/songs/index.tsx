"use client";

import { Song } from "@/generated/prisma";
import { useState } from "react";

import { useEffect } from "react";

interface Props {
  search: (query: string) => Promise<Song[]>;
}

const SongsScreen = ({ search }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  useEffect(() => {
    search(searchQuery).then(setSongs);
  }, [searchQuery, search]);

  return (
    <div>
      <h1>Hello World</h1>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="flex flex-col gap-2">
        <ul>
          {songs.map((song) => (
            <li key={song.id} onClick={() => setSelectedSong(song)}>
              {song.name}
            </li>
          ))}
        </ul>

        {selectedSong && (
          <div>
            <h2>{selectedSong.name}</h2>
            <p>{selectedSong.artist}</p>
            <pre>{JSON.stringify(selectedSong, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SongsScreen;
