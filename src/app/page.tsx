import * as SongRepository from "@/repositories/songs";
import * as SongRequestRepository from "@/repositories/song-requests";
import * as AlbumImageRepository from "@/repositories/album-images";
import SongsScreen from "@/screens/songs";

const Home = () => {
  const search = async (
    searchQuery: SongRepository.SearchQuery,
    skip?: number
  ) => {
    "use server";
    return SongRepository.search(searchQuery, skip);
  };

  const countForArtist = async (
    artist: string,
    searchQuery: SongRepository.SearchQuery
  ) => {
    "use server";
    return SongRepository.countForArtist(artist, searchQuery);
  };

  const fetchAlbumImage = async (songDirectory: string) => {
    "use server";
    return AlbumImageRepository.fetch(songDirectory);
  };

  const requestSong = async (songId: string, requestedBy: string) => {
    "use server";
    await SongRequestRepository.create(songId, requestedBy);
  };

  const countSongRequests = async () => {
    "use server";
    return SongRequestRepository.count();
  };

  return (
    <SongsScreen
      search={search}
      countForArtist={countForArtist}
      fetchAlbumImage={fetchAlbumImage}
      requestSong={requestSong}
      countSongRequests={countSongRequests}
    />
  );
};

export default Home;
