import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import "./globals.css";
import * as PlayersRepository from "@/repositories/players";
import MainNav from "@/components/main-nav";

const barlowFont = localFont({
  variable: "--font-barlow",
  display: "swap",
  preload: false,
  src: [
    {
      path: "../../public/fonts/Barlow/Barlow-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-ThinItalic.ttf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-ExtraLightItalic.ttf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-LightItalic.ttf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-MediumItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-SemiBoldItalic.ttf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-Black.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Barlow/Barlow-BlackItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
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
        className={`${barlowFont.variable} font-sans antialiased flex flex-col h-screen overflow-hidden`}
      >
        <MainNav players={players} activePlayerId={activePlayerId} />

        <main className="bg-background flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
