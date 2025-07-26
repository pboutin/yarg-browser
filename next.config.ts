import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://raw.githubusercontent.com/YARC-Official/**"),
    ],
  },
};

export default nextConfig;
