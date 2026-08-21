"use client";

import CharterIcon from "@/components/charter-icon";
import SongCount from "@/components/song-count";
import useDebouncedValue from "@/hooks/use-debounced-value";
import ArtistHeader from "@/screens/songs/artist-header";
import SongDetails from "@/screens/songs/song-details";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { SearchQuery } from "@/repositories/songs";
import ShareButton from "@/components/share-button";
import { Song } from "@/generated/prisma/client";

interface Props {
  search: (
    searchQuery: SearchQuery,
    skip?: number,
  ) => Promise<{
    songs: Song[];
    hasMore: boolean;
    total: number | null;
  }>;
  countForArtist: (artist: string, searchQuery: SearchQuery) => Promise<number>;
  fetchAlbumImage: (songDirectory: string) => Promise<string>;
}

const SongsScreen = ({ search, countForArtist, fetchAlbumImage }: Props) => {
  const [query, setQuery] = useState("");

  const [songs, setSongs] = useState<Song[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const debouncedQuery = useDebouncedValue(query, 1000);

  const searchQuery = useMemo(() => {
    return {
      query: debouncedQuery,
    };
  }, [debouncedQuery]);

  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setSongs([]);
    setHasMore(false);
    setTotal(null);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    let cancelled = false;

    search(searchQuery).then(({ songs, hasMore, total }) => {
      if (cancelled) return;
      setSongs(songs);
      setHasMore(hasMore);
      if (total !== null) setTotal(total);
    });

    return () => {
      cancelled = true;
    };
  }, [search, searchQuery]);

  const handleLoadMore = () => {
    search(searchQuery, songs.length).then(({ songs, hasMore }) => {
      setSongs((prevSongs) => prevSongs.concat(songs));
      setHasMore(hasMore);
    });
  };

  return (
    <>
      <ShareButton />

      <div className={`${selectedSong ? "w-3/4" : "w-full"}`}>
        <div className="pt-6 pb-2 px-4 w-full gap-6 sticky top-0 bg-black border-b-8 border-layout-light items-center z-10">
          <div className="flex pb-2 gap-4 items-center">
            <div className="text-white uppercase font-extrabold text-5xl">
              library
            </div>

            <input
              type="text"
              value={query}
              className="flex-1 px-6 py-2 rounded-4xl bg-white text-black text-xl font-semibold"
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {total ? (
            <div className="flex justify-end">
              <SongCount count={total} />
            </div>
          ) : null}
        </div>

        <InfiniteScroll
          dataLength={songs.length}
          next={handleLoadMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
        >
          {songs.map((song, index) => {
            const shouldRenderArtistHeader =
              index === 0 || songs[index - 1].artist !== song.artist;

            return (
              <div key={song.id}>
                {shouldRenderArtistHeader ? (
                  <ArtistHeader
                    artist={song.artist}
                    searchQuery={searchQuery}
                    countForArtist={countForArtist}
                  />
                ) : null}

                <div
                  className={`flex items-center gap-4 py-2 px-4 rounded cursor-pointer border-y-1 border-layout-dark hover:bg-layout-dark ${
                    song.id === selectedSong?.id && "bg-layout-dark"
                  }`}
                  onClick={() => setSelectedSong(song)}
                >
                  <CharterIcon charterId={song.charterId} size={32} />

                  <div className="text-primary text-xl flex-1">{song.name}</div>
                  <div className="text-secondary text-md italic flex-1">
                    {song.artist}
                  </div>
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>

      {selectedSong ? (
        <SongDetails song={selectedSong} fetchAlbumImage={fetchAlbumImage} />
      ) : null}
    </>
  );
};

export default SongsScreen;
