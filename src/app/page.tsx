import type { SearchQuery } from "@/repositories/songs";
import * as SongsRepository from "@/repositories/songs";
import * as AlbumImageRepository from "@/repositories/album-images";
import SongsScreen from "@/screens/songs";

const Home = () => {
  const search = async (searchQuery: SearchQuery, skip?: number) => {
    "use server";
    return SongsRepository.search(searchQuery, skip);
  };

  const countForArtist = async (artist: string, searchQuery: SearchQuery) => {
    "use server";
    return SongsRepository.countForArtist(artist, searchQuery);
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
