import { resolveEnv } from "@/utilities/environment";
import fs from "fs";
import path from "path";

const POSSIBLE_EXTENSIONS = [".jpg", ".jpeg", ".png"];

export const fetch = async (songDirectory: string) => {
  for (const extension of POSSIBLE_EXTENSIONS) {
    const imagePath = path.join(
      resolveEnv("SONGS_PATH"),
      songDirectory,
      `album${extension}`,
    );
    if (fs.existsSync(imagePath)) {
      return fs.readFileSync(imagePath).toString("base64");
    }
  }

  throw new Error(`Album image not found for ${songDirectory}`);
};
