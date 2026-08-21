"use client";

import CharterIcon from "@/components/charter-icon";
import { Instruments } from "@/components/instruments";
import SongCount from "@/components/song-count";
import useDebouncedValue from "@/hooks/use-debounced-value";
import ArtistHeader from "@/screens/songs/artist-header";
import SongDetails from "@/screens/songs/song-details";
import { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import * as SongRepository from "@/repositories/songs";
import ShareButton from "@/components/share-button";
import useLocalStoredState from "@/hooks/use-local-stored-state";
import RequestInfoModal from "@/screens/songs/request-info-modal";
import RequestInfoButton from "@/screens/songs/request-info-button";
import { RequestInfo } from "@/types";
import RequestsFilterButton from "@/screens/songs/requests-filter-button";
import { SongWithRequests } from "@/repositories/songs";
import RequestInfoBadge from "@/components/request-info-badge";
interface Props {
  search: (
    searchQuery: SongRepository.SearchQuery,
    skip?: number
  ) => Promise<{
    songs: SongWithRequests[];
    hasMore: boolean;
    total: number | null;
  }>;
  countForArtist: (
    artist: string,
    searchQuery: SongRepository.SearchQuery
  ) => Promise<number>;
  fetchAlbumImage: (songDirectory: string) => Promise<string>;

  requestSong: (songId: string, requestedBy: string) => Promise<void>;
  countSongRequests: () => Promise<number>;
}

const SongsScreen = ({
  search,
  countForArtist,
  fetchAlbumImage,
  requestSong,
  countSongRequests,
}: Props) => {
  const [requestInfo, setRequestInfo] = useLocalStoredState<{
    color: string;
    name: string;
  } | null>("requestInfo");

  const [requestInfoModalOpened, setRequestInfoModalOpened] = useState(false);
  const [query, setQuery] = useState("");
  const [guitarSelected, setGuitarSelected] = useState(false);
  const [bassSelected, setBassSelected] = useState(false);
  const [drumsSelected, setDrumsSelected] = useState(false);
  const [vocalsSelected, setVocalsSelected] = useState(false);
  const [requestsSelected, setRequestsSelected] = useState(false);

  const [songs, setSongs] = useState<SongWithRequests[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [selectedSong, setSelectedSong] = useState<SongWithRequests | null>(
    null
  );

  const debouncedQuery = useDebouncedValue(query, 1000);

  const searchQuery = useMemo(() => {
    return {
      query: debouncedQuery,
      guitar: guitarSelected,
      bass: bassSelected,
      drums: drumsSelected,
      vocals: vocalsSelected,
      requested: requestsSelected,
    };
  }, [
    debouncedQuery,
    guitarSelected,
    bassSelected,
    drumsSelected,
    vocalsSelected,
    requestsSelected,
  ]);

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

  const handleBandSelect = () => {
    const value =
      guitarSelected && bassSelected && drumsSelected && vocalsSelected;

    setGuitarSelected(!value);
    setBassSelected(!value);
    setDrumsSelected(!value);
    setVocalsSelected(!value);
  };

  const handleRequestInfoChange = (requestInfo: RequestInfo) => {
    setRequestInfo(requestInfo);
    setRequestInfoModalOpened(false);
  };

  const handleRequestSong = (songId: string) => {
    if (!requestInfo) return;

    requestSong(songId, JSON.stringify(requestInfo));
  };

  return (
    <>
      <ShareButton />
      <RequestInfoButton
        hasRequestInfo={!!requestInfo}
        onClick={() => setRequestInfoModalOpened(true)}
      />

      {requestInfoModalOpened ? (
        <RequestInfoModal
          requestInfo={requestInfo}
          onClose={() => setRequestInfoModalOpened(false)}
          onChange={handleRequestInfoChange}
        />
      ) : null}

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

            <RequestsFilterButton
              countSongRequests={countSongRequests}
              onClick={() => setRequestsSelected((prev) => !prev)}
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

                  {song.requests.length > 0 ? (
                    <div className="flex items-center gap-2">
                      {song.requests.map((request) => (
                        <RequestInfoBadge
                          key={request.id}
                          rawRequestInfo={request.requestedBy}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-secondary text-md italic flex-1">
                      {song.artist}
                    </div>
                  )}

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
        <SongDetails
          song={selectedSong}
          fetchAlbumImage={fetchAlbumImage}
          onRequestSong={handleRequestSong}
        />
      ) : null}
    </>
  );
};

export default SongsScreen;
