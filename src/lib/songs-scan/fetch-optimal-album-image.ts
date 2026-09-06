import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const CACHE_DIR = path.join(process.cwd(), "src/lib/songs-scan/.cache");
const RATE_LIMIT_WAIT_MS = 60_000;

type AudioDbAlbumResponse = {
  album: Array<{ strAlbumThumb: string | null }> | null;
};

function sanitizeCachePart(value: string): string {
  console.log("sanitizeCachePart", value);
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "");
}

function albumImageCacheKey(artist: string, album: string): string {
  return `${sanitizeCachePart(artist)}__${sanitizeCachePart(album)}.jpg`;
}

async function readCache(cachePath: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(cachePath);
  } catch {
    return null;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRateLimitRetry(
  input: string | URL,
  init?: RequestInit,
): Promise<Response> {
  while (true) {
    const response = await fetch(input, init);

    if (response.status !== 429) {
      return response;
    }

    console.warn(
      `TheAudioDB rate limit hit (429). Waiting ${
        RATE_LIMIT_WAIT_MS / 1000
      }s before retrying...`,
    );
    await sleep(RATE_LIMIT_WAIT_MS);
  }
}

async function fetchAndResizeAlbumImage(
  artist: string,
  album: string,
): Promise<Buffer | null> {
  const searchUrl = new URL(
    "https://www.theaudiodb.com/api/v1/json/123/searchalbum.php",
  );
  searchUrl.searchParams.set("s", artist);
  searchUrl.searchParams.set("a", album);

  const searchResponse = await fetchWithRateLimitRetry(searchUrl);
  if (!searchResponse.ok) {
    return null;
  }

  const data = (await searchResponse.json()) as AudioDbAlbumResponse;
  const thumbUrl = data.album?.[0]?.strAlbumThumb;

  if (!thumbUrl) {
    return null;
  }

  const imageResponse = await fetchWithRateLimitRetry(thumbUrl);
  if (!imageResponse.ok) {
    return null;
  }

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  return sharp(imageBuffer).resize(512, 512).jpeg().toBuffer();
}

export default async function fetchOptimalAlbumImage(
  artist: string,
  album: string,
  songDirectory: string,
): Promise<boolean> {
  await fs.mkdir(CACHE_DIR, { recursive: true });

  const cachePath = path.join(CACHE_DIR, albumImageCacheKey(artist, album));
  let resized = await readCache(cachePath);

  if (!resized) {
    resized = await fetchAndResizeAlbumImage(artist, album);
    if (!resized) {
      return false;
    }
    await fs.writeFile(cachePath, resized);
  }

  const albumPath = path.join(songDirectory, "album.jpg");
  const originalCandidates = ["album.png", "album.jpeg", "album.jpg"] as const;

  for (const filename of originalCandidates) {
    const originalPath = path.join(songDirectory, filename);
    const ext = path.extname(filename);
    const backupPath = path.join(songDirectory, `album-backup${ext}`);

    try {
      await fs.rename(originalPath, backupPath);
      break;
    } catch {
      // Original may not exist under this extension
    }
  }

  await fs.writeFile(albumPath, resized);

  return true;
}
