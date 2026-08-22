import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import * as ScoresRepository from "@/repositories/scores";
import * as SongsRepository from "@/repositories/songs";
import LiveScoresToggle from "@/components/live-scores-toggle";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YARG Browser",
  description: "YARG Browser",
};

const PLAYER_ID = "316bd1b0-f06f-4526-b316-d4d50fa6c056"; // InfaMc

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fetchLatestSongId = async () => {
    "use server";

    const latestScore = await ScoresRepository.findLatestForPlayer(PLAYER_ID);
    if (!latestScore) return null;
    const song = await SongsRepository.getByChecksum(latestScore.songChecksum);
    if (!song) return null;
    return song.id;
  };

  return (
    <html lang="en">
      <body
        className={`${interFont.variable} antialiased h-screen overflow-hidden flex flex-col`}
      >
        <nav className="navbar bg-background border-b-8 border-layout-light">
          <a className="btn btn-ghost text-xl">YARG Browser</a>
          <a href="/" className="btn btn-ghost">
            Library
          </a>
          <div className="ml-auto">
            <LiveScoresToggle fetchLatestSongId={fetchLatestSongId} />
          </div>
        </nav>
        <main className="bg-background flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
