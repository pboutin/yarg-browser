"use server";

import fs from "fs";
import { Song } from "@/types";
import * as SongsRepository from "@/repositories/songs";
import readIniFile from "@/lib/songs-scan/read-ini-file";
import { computeSongChecksum } from "@/lib/songs-scan/checksum";
import { listChartedInstruments } from "@/lib/songs-scan/instruments";
import fetchOptimalAlbumImage from "@/lib/songs-scan/fetch-optimal-album-image";
import { resolveEnv } from "@/utilities/environment";

export default async function scanAllSongs() {
  const SONGS_DIRECTORY = resolveEnv("SONGS_PATH");

  if (!SONGS_DIRECTORY) {
    console.error("SONGS_PATH env is not set");
    return;
  }

  console.time("Runtime");
  for (const songDirectory of fs.readdirSync(SONGS_DIRECTORY)) {
    const currentSongDirectory = `${SONGS_DIRECTORY}/${songDirectory}`;
    const songIniPath = `${currentSongDirectory}/song.ini`;

    console.log(`Processing ${songDirectory}...`);

    if (!fs.existsSync(songIniPath)) {
      console.warn(`${songDirectory} has no song.ini`);
      continue;
    }

    const songIniContent = readIniFile(songIniPath);
    const checksum = computeSongChecksum(currentSongDirectory);
    const instruments = listChartedInstruments(currentSongDirectory);

    const existingSong = await SongsRepository.getByChecksum(checksum);
    let albumImageOptimized = existingSong?.albumImageOptimized ?? null;

    const shouldReprocessAlbumImage =
      songIniContent.album !== existingSong?.album ||
      songIniContent.artist !== existingSong?.artist;

    if (
      (albumImageOptimized === null || shouldReprocessAlbumImage) &&
      songIniContent.album &&
      songIniContent.artist
    ) {
      albumImageOptimized = await fetchOptimalAlbumImage(
        songIniContent.artist,
        songIniContent.album,
        currentSongDirectory,
      );
    }

    const song: Omit<Song, "id"> = {
      name: songIniContent.name,
      directory: songDirectory,
      artist: songIniContent.artist,
      album: songIniContent.album,
      genre: songIniContent.genre,
      year: songIniContent.year,
      charter: songIniContent.charter,
      charterId: songIniContent.icon,
      length: parseInt(songIniContent.song_length),
      checksum,
      instruments,
      albumImageOptimized,
    };

    await SongsRepository.upsert(song);
  }

  console.timeEnd("Runtime");

  const totalSongs = await SongsRepository.countAll();

  console.log(`Donezo. Total songs: ${totalSongs}`);
}
