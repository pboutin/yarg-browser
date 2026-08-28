import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { Readable } from "stream";
import * as SongsRepository from "@/repositories/songs";
import * as AlbumImageRepository from "@/repositories/album-images";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const song = await SongsRepository.get(id);

  if (!song) {
    return new NextResponse("Song not found", { status: 404 });
  }

  const albumImage = await AlbumImageRepository.getAlbumImagePath(
    song.directory,
  );

  if (!albumImage) {
    return new NextResponse("Album artwork not found", { status: 404 });
  }

  const stat = await fs.promises.stat(albumImage.filePath);
  const stream = Readable.toWeb(fs.createReadStream(albumImage.filePath));

  return new Response(stream as ReadableStream, {
    headers: {
      "Content-Type": albumImage.mimeType,
      "Content-Length": stat.size.toString(),
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
