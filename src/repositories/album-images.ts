import { resolveEnv } from "@/utilities/environment";
import fs from "fs";
import path from "path";

export const fetch = async (songDirectory: string) => {
  const imagePath = path.join(
    resolveEnv("SONGS_PATH"),
    songDirectory,
    "album.jpg"
  );

  if (!fs.existsSync(imagePath)) {
    throw new Error(`Album image not found for ${songDirectory}`);
  }

  const image = fs.readFileSync(imagePath);
  return image.toString("base64");
};
