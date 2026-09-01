"use client";

import CharterIcon from "@/components/charter-icon";
import SongCount from "@/components/song-count";
import useDebouncedValue from "@/hooks/use-debounced-value";
import ArtistHeader from "@/screens/songs/artist-header";
import SongSidePanel from "@/components/song-side-panel";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ShareButton from "@/components/share-button";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { search, SearchResult } from "./actions";
import Instruments from "@/components/instruments";
import { Song } from "@/types";
import { formatDistanceToNow } from "date-fns";

const SongsScreen = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const [songs, setSongs] = useState<SearchResult["songs"]>([]);
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
  }, [searchQuery]);

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
                      />
                    ) : null}

                    <div
                      className={classNames(
                        "flex items-center gap-4 px-4 h-14 rounded cursor-pointer border-y border-layout-dark hover:bg-layout-dark",
                        {
                          "bg-layout-light": song.id === selectedSong?.id,
                        },
                      )}
                      onClick={() => setSelectedSong(song)}
                      onDoubleClick={() => handleNavigatingToSong(song)}
                    >
                      <CharterIcon charterId={song.charterId} size={32} />

                      <div className="flex-1 flex items-center">
                        <span
                          className={classNames(
                            "text-xl",
                            song.id === selectedSong?.id
                              ? "text-white font-bold"
                              : "text-primary",
                          )}
                        >
                          {song.name}
                        </span>
                        {song.album ? (
                          <span
                            className={classNames(
                              "text-md ml-2",
                              song.id === selectedSong?.id
                                ? "text-white font-bold"
                                : "text-secondary",
                            )}
                          >
                            {song.album}
                          </span>
                        ) : null}
                      </div>

                      <div
                        className={classNames(
                          "text-sm italic flex-1 font-semibold",
                          song.id === selectedSong?.id
                            ? "text-white font-bold"
                            : "text-secondary",
                        )}
                      >
                        {song.latestPlayedAt
                          ? formatDistanceToNow(song.latestPlayedAt, {
                              addSuffix: true,
                            })
                          : null}
                      </div>

                      <Instruments
                        instruments={song.instruments}
                        instrumentPersonalBests={song.personalBests}
                        size={42}
                        className="flex-1 justify-end "
                      />
                    </div>
                  </div>
                );
              })}
            </InfiniteScroll>
          </div>
        </div>

        {selectedSong ? <SongSidePanel song={selectedSong} /> : null}
      </div>
    </>
  );
};

export default SongsScreen;
