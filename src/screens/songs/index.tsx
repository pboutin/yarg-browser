"use client";

import { Song } from "@/generated/prisma";
import useDebouncedValue from "@/hooks/use-debounced-value";
import ArtistHeader from "@/screens/songs/artist-header";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  search: (
    query: string,
    skip?: number
  ) => Promise<{
    songs: Song[];
    hasMore: boolean;
  }>;
  countForArtist: (artist: string, query?: string) => Promise<number>;
}

const SongsScreen = ({ search, countForArtist }: Props) => {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const debouncedQuery = useDebouncedValue(query, 1000);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSongs([]);
    setHasMore(false);

    search(debouncedQuery).then(({ songs, hasMore }) => {
      setSongs(songs);
      setHasMore(hasMore);
    });
  }, [debouncedQuery, search]);

  const handleLoadMore = () => {
    search(query, songs.length).then(({ songs, hasMore }) => {
      setSongs((prevSongs) => prevSongs.concat(songs));
      setHasMore(hasMore);
    });
  };

  let latestRenderedArtist: string | null = null;

  return (
    <div>
      <div className="flex sticky top-0 bg-black">
        <input
          type="text"
          value={query}
          className="flex-1 px-4 py-2 m-4 rounded-4xl bg-white text-black"
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="p-4 w-3/4">
        <InfiniteScroll
          dataLength={songs.length}
          next={handleLoadMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {songs.map((song) => {
            const shouldRenderArtistHeader =
              latestRenderedArtist !== song.artist;

            latestRenderedArtist = song.artist;

            return (
              <div key={song.id}>
                {shouldRenderArtistHeader ? (
                  <ArtistHeader
                    artist={song.artist}
                    query={debouncedQuery}
                    countForArtist={countForArtist}
                  />
                ) : null}

                <div
                  className={`flex items-center gap-4 py-2 px-4 rounded cursor-pointer hover:bg-gray-800 ${
                    song.id === selectedSong?.id ? "bg-blue-600" : ""
                  }`}
                  onClick={() => setSelectedSong(song)}
                >
                  <div className="flex-1">
                    <div className="text-cyan-400">{song.name}</div>
                    <div className="text-gray-400 text-sm">{song.artist}</div>
                  </div>

                  {song.difficultyGuitar && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-600 rounded-full"></div>
                      <span className="text-sm">{song.difficultyGuitar}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>

      {selectedSong && (
        <div className="flex-1 fixed right-0 w-1/4 top-16 bg-gray-800 p-4">
          <div className="bg-gray-900 border-gray-700">
            <div className="p-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">CHARTER</span>
                  <span>{selectedSong.charter}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">GENRE</span>
                  <span>{selectedSong.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">YEAR</span>
                  <span>{selectedSong.year}</span>
                  <span className="text-gray-400">LENGTH</span>
                  <span>{selectedSong.length}</span>
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 bg-gray-600 rounded-full"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SongsScreen;
