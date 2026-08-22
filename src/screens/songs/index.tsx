"use client";

import CharterIcon from "@/components/charter-icon";
import SongCount from "@/components/song-count";
import useDebouncedValue from "@/hooks/use-debounced-value";
import ArtistHeader from "@/screens/songs/artist-header";
import SongSidePanel from "@/components/song-side-panel";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import type { SearchQuery } from "@/repositories/songs";
import ShareButton from "@/components/share-button";
import { Song } from "@/generated/prisma/client";
import classNames from "classnames";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
    document.getElementById("songs-scroll")?.scrollTo(0, 0);
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

  const handleNavigatingToSong = (song: Song) => {
    router.push(`/song/${song.id}`);
  };

  return (
    <>
      <ShareButton />

      <div className="flex h-full">
        <div className="flex flex-1 flex-col min-h-0 min-w-0">
          <div className="py-4 px-4 w-full gap-6 bg-black border-b-8 border-layout-light items-center">
            <div className="flex gap-8 items-center">
              <div className="flex gap-8 flex-1 items-center">
                <div className="text-white uppercase font-extrabold text-4xl">
                  library
                </div>

                <input
                  type="text"
                  value={query}
                  className="input input-md w-full"
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="">
                {total ? <SongCount count={total} /> : null}
              </div>
            </div>
          </div>

          <div id="songs-scroll" className="flex-1 min-h-0 overflow-y-auto">
            <InfiniteScroll
              dataLength={songs.length}
              next={handleLoadMore}
              hasMore={hasMore}
              loader={<h4>Loading...</h4>}
              scrollableTarget="songs-scroll"
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
                      className={classNames(
                        "flex items-center gap-4 py-2 px-4 rounded cursor-pointer border-y-1 border-layout-dark hover:bg-layout-dark",
                        {
                          "bg-layout-light": song.id === selectedSong?.id,
                        },
                      )}
                      onClick={() => setSelectedSong(song)}
                      onDoubleClick={() => handleNavigatingToSong(song)}
                    >
                      <CharterIcon charterId={song.charterId} size={32} />

                      <div
                        className={classNames(
                          "text-xl flex-1",
                          song.id === selectedSong?.id
                            ? "text-white font-bold"
                            : "text-primary",
                        )}
                      >
                        {song.name}
                      </div>
                      <div
                        className={classNames(
                          "text-md italic flex-1",
                          song.id === selectedSong?.id
                            ? "text-white font-bold"
                            : "text-secondary",
                        )}
                      >
                        {song.artist}
                      </div>
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>

        {selectedSong ? (
          <SongSidePanel
            song={selectedSong}
            fetchAlbumImage={fetchAlbumImage}
          />
        ) : null}
      </div>
    </>
  );
};

export default SongsScreen;
