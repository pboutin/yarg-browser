"use client";

import CharterIcon from "@/components/charter-icon";
import { Instruments } from "@/components/instruments";
import SongCount from "@/components/song-count";
import { Song } from "@/generated/prisma";
import useDebouncedValue from "@/hooks/use-debounced-value";
import ArtistHeader from "@/screens/songs/artist-header";
import SongDetails from "@/screens/songs/song-details";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import * as SongRepository from "@/repositories/songs";

interface Props {
  search: (
    searchQuery: SongRepository.SearchQuery,
    skip?: number
  ) => Promise<{
    songs: Song[];
    hasMore: boolean;
    total: number | null;
  }>;
  countForArtist: (
    artist: string,
    searchQuery: SongRepository.SearchQuery
  ) => Promise<number>;
  fetchAlbumImage: (songDirectory: string) => Promise<string>;
}

const SongsScreen = ({ search, countForArtist, fetchAlbumImage }: Props) => {
  const [query, setQuery] = useState("");
  const [guitarSelected, setGuitarSelected] = useState(false);
  const [bassSelected, setBassSelected] = useState(false);
  const [drumsSelected, setDrumsSelected] = useState(false);
  const [vocalsSelected, setVocalsSelected] = useState(false);

  const [songs, setSongs] = useState<Song[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  const debouncedQuery = useDebouncedValue(query, 1000);

  const searchQuery = useMemo(() => {
    return {
      query: debouncedQuery,
      guitar: guitarSelected,
      bass: bassSelected,
      drums: drumsSelected,
      vocals: vocalsSelected,
    };
  }, [
    debouncedQuery,
    guitarSelected,
    bassSelected,
    drumsSelected,
    vocalsSelected,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setSongs([]);
    setHasMore(false);
    setTotal(null);

    search(searchQuery).then(({ songs, hasMore, total }) => {
      setSongs(songs);
      setHasMore(hasMore);
      if (total !== null) setTotal(total);
    });
  }, [debouncedQuery, search, searchQuery]);

  const handleLoadMore = () => {
    search(searchQuery, songs.length).then(({ songs, hasMore }) => {
      setSongs((prevSongs) => prevSongs.concat(songs));
      setHasMore(hasMore);
    });
  };

  const handleBandSelect = () => {
    const value =
      guitarSelected && bassSelected && drumsSelected && vocalsSelected;

    setGuitarSelected(!value);
    setBassSelected(!value);
    setDrumsSelected(!value);
    setVocalsSelected(!value);
  };

  let latestRenderedArtist: string | null = null;

  return (
    <>
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

            <Instruments
              size={44}
              guitar={guitarSelected}
              bass={bassSelected}
              drums={drumsSelected}
              vocals={vocalsSelected}
              onGuitarSelect={() => setGuitarSelected((prev) => !prev)}
              onBassSelect={() => setBassSelected((prev) => !prev)}
              onDrumsSelect={() => setDrumsSelected((prev) => !prev)}
              onVocalsSelect={() => setVocalsSelected((prev) => !prev)}
              onBandSelect={handleBandSelect}
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
          {songs.map((song) => {
            const shouldRenderArtistHeader =
              latestRenderedArtist !== song.artist;

            latestRenderedArtist = song.artist;

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

                  <Instruments
                    className="ml-auto"
                    size={32}
                    guitar={song.difficultyGuitar}
                    bass={song.difficultyBass}
                    drums={song.difficultyDrums}
                    vocals={song.difficultyVocals}
                  />
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
