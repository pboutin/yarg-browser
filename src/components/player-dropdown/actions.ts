"use server";

import { cookies } from "next/headers";

export const setActivePlayer = async (playerId: string) => {
  const cookieStore = await cookies();
  cookieStore.set("active-player", playerId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false,
  });
};
