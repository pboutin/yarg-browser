import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import * as PlayersRepository from "@/repositories/players";
import MainNav from "@/components/main-nav";

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
        className={`${interFont.variable} antialiased flex flex-col h-screen overflow-hidden`}
      >
        <MainNav players={players} activePlayerId={activePlayerId} />

        <main className="bg-background flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
