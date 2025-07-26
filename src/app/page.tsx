import * as SongRepository from "@/repositories/songs";
import * as AlbumImageRepository from "@/repositories/album-images";
import SongsScreen from "@/screens/songs";

const Home = () => {
  const search = async (query: string, skip?: number) => {
    "use server";
    return SongRepository.search(query, skip);
  };

  const countForArtist = async (artist: string, query?: string) => {
    "use server";
    return SongRepository.countForArtist(artist, query);
  };

  const fetchAlbumImage = async (songDirectory: string) => {
    "use server";
    return AlbumImageRepository.fetch(songDirectory);
  };

  return (
    <SongsScreen
      search={search}
      countForArtist={countForArtist}
      fetchAlbumImage={fetchAlbumImage}
    />
  );
};

export default Home;
