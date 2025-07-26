import * as SongRepository from "@/repositories/songs";
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

  return <SongsScreen search={search} countForArtist={countForArtist} />;
};

export default Home;
