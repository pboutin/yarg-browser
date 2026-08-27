import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Link from "next/link";
import "./globals.css";
import LiveScoresToggle from "@/components/live-scores-toggle/index";
import PlayerDropdown from "@/components/player-dropdown/index";
import * as PlayersRepository from "@/repositories/players";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YARG Browser",
  description: "YARG Browser",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const players = await PlayersRepository.getAll();
  const cookieStore = await cookies();
  const activePlayerId = cookieStore.get("active-player")?.value;

  return (
    <html lang="en">
      <body
        className={`${interFont.variable} antialiased h-screen overflow-hidden flex flex-col`}
      >
        <nav className="navbar bg-background border-b-8 border-layout-light">
          <Link href="/" className="btn btn-ghost text-xl">
            YARG Browser
          </Link>
          <Link href="/" className="btn btn-ghost">
            Library
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <PlayerDropdown
              players={players}
              activePlayerId={activePlayerId}
            />
            <LiveScoresToggle />
          </div>
        </nav>
        <main className="bg-background flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
