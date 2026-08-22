import SongScreen from "@/screens/song";
import * as SongsRepository from "@/repositories/songs";
import { notFound } from "next/navigation";
import * as AlbumImageRepository from "@/repositories/album-images";

interface Props {
  params: Promise<{ id: string }>;
}

const SongPage = async ({ params }: Props) => {
  const { id } = await params;

  const song = await SongsRepository.get(id);

  if (!song) {
    notFound();
  }

  const fetchAlbumImage = async (songDirectory: string) => {
    "use server";
    return AlbumImageRepository.fetch(songDirectory);
  };

  return <SongScreen song={song} fetchAlbumImage={fetchAlbumImage} />;
};

export default SongPage;
