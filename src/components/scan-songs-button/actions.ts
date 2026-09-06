"use server";

import scanAllSongs from "@/lib/songs-scan";

export const scanSongs = async (): Promise<void> => {
  await scanAllSongs();
};
