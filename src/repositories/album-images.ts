import { resolveEnv } from "@/utilities/environment";
import fs from "fs/promises";
import path from "path";

const EXTENSION_MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

export interface AlbumImageFile {
  filePath: string;
  mimeType: string;
}

export const getAlbumImagePath = async (
  songDirectory: string,
): Promise<AlbumImageFile | null> => {
  const songsBase = resolveEnv("SONGS_PATH");
  const safeDirectory = path
    .normalize(songDirectory)
    .replace(/^(\.\.(\/|\\|$))+/, "");

  for (const [extension, mimeType] of Object.entries(EXTENSION_MIME_TYPES)) {
    const filePath = path.join(songsBase, safeDirectory, `album${extension}`);
    try {
      await fs.access(filePath);
      return { filePath, mimeType };
    } catch (error) {
      console.warn("Error fetching album image: ", songDirectory, error);
      // Image with this extension does not exist, check the next one
    }
  }

  return null;
};
