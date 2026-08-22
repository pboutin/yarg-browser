import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YARG Browser",
  description: "YARG Browser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
        </nav>
        <main className="bg-background flex-1 min-h-0 overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
