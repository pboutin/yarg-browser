"use server";

import fs from "node:fs";
import { Song } from "@/types";
import * as SongsRepository from "@/repositories/songs";
import { resolveEnv } from "@/utilities/environment";

export const deleteSong = async (song: Song): Promise<void> => {
  const SONGS_DIRECTORY = resolveEnv("SONGS_PATH");
  const songDirectory = `${SONGS_DIRECTORY}/${song.directory}`;

  await fs.promises.rm(songDirectory, { recursive: true });
  await SongsRepository.destroy(song.id);
};
