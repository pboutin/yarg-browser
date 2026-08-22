"use server";

import * as AlbumImageRepository from "@/repositories/album-images";

export const fetchAlbumImage = async (songDirectory: string) => {
  return AlbumImageRepository.fetch(songDirectory);
};
