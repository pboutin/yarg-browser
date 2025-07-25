import * as SongRepository from "@/repositories/songs";
import SongsScreen from "@/screens/songs";

export default function Home() {
  async function search(query: string) {
    "use server";

    return SongRepository.search(query);
  }

  return <SongsScreen search={search} />;
}
