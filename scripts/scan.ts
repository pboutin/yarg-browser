import dotenv from "dotenv";
import fs from "fs";
import readIniFile from "./utilities/read-ini-file";

import { computeSongChecksum } from "./utilities/checksum";
import { listChartedInstruments } from "./utilities/instruments";
import { Song } from "@/types";
import * as SongsRepository from "@/repositories/songs";

dotenv.config();

const SONGS_DIRECTORY = process.env.SONGS_PATH;

if (!SONGS_DIRECTORY) {
  console.error("SONGS_PATH env is not set");
  process.exit(1);
}

(async () => {
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
    };

    await SongsRepository.upsert(song);
  }

  console.timeEnd("Runtime");

  const totalSongs = await SongsRepository.countAll();

  console.log(`Donezo. Total songs: ${totalSongs}`);
  process.exit(0);
})();
