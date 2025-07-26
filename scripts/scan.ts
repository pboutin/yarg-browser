import { PrismaClient, Song } from "@/generated/prisma";
import dotenv from "dotenv";
import fs from "fs";
import readIniFile from "./utilities/read-ini-file";
import crypto from "crypto";

dotenv.config();

const SONGS_DIRECTORY = process.env.SONGS_PATH;

if (!SONGS_DIRECTORY) {
  console.error("SONGS_PATH env is not set");
  process.exit(1);
}

(async () => {
  const prismaClient = new PrismaClient();

  console.time("Runtime");
  for (const songDirectory of fs.readdirSync(SONGS_DIRECTORY)) {
    const songIniPath = `${SONGS_DIRECTORY}/${songDirectory}/song.ini`;

    if (!fs.existsSync(songIniPath)) {
      console.warn(`${songDirectory} has no song.ini`);
      continue;
    }

    const songIniContent = readIniFile(songIniPath);

    const songId = crypto.createHash("md5").update(songDirectory).digest("hex");

    const song: Omit<Song, "id"> = {
      name: songIniContent.name,
      artist: songIniContent.artist,
      album: songIniContent.album,
      genre: songIniContent.genre,
      year: parseInt(songIniContent.year),
      charter: songIniContent.charter,
      charterId: songIniContent.icon,
      length: parseInt(songIniContent.song_length),
      difficultyGuitar: parseInt(songIniContent.diff_guitar),
      difficultyBass: parseInt(songIniContent.diff_bass),
      difficultyDrums: parseInt(songIniContent.diff_drums),
      difficultyVocals: parseInt(songIniContent.diff_vocals),
    };

    await prismaClient.song.upsert({
      where: { id: songId },
      update: song,
      create: {
        id: songId,
        ...song,
      },
    });
  }

  console.timeEnd("Runtime");

  const totalSongs = await prismaClient.song.count();

  await prismaClient.$disconnect();
  console.log(`Done. Total songs: ${totalSongs}`);
  process.exit(0);
})();
