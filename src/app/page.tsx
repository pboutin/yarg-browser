import * as SongRepository from "@/repositories/songs";
import SongsScreen from "@/screens/songs";

export default function Home() {
  async function search(query: string, skip?: number) {
    "use server";

    return SongRepository.search(query, skip);
  }

  return <SongsScreen search={search} />;
}
