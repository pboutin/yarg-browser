"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchLatestSongId } from "./actions";

const POLL_INTERVAL_MS = 5000;

const LiveScoresToggle = () => {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const lastSongIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      lastSongIdRef.current = null;
      return;
    }

    let cancelled = false;

    const poll = async () => {
      const latestSongId = await fetchLatestSongId();
      if (cancelled || !latestSongId) return;

      if (lastSongIdRef.current === null) {
        lastSongIdRef.current = latestSongId;
        return;
      }

      if (latestSongId !== lastSongIdRef.current) {
        lastSongIdRef.current = latestSongId;
        router.push(`/song/${latestSongId}`);
      }
    };

    void poll();
    const intervalId = setInterval(() => {
      void poll();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [enabled, router]);

  return (
    <label className="label cursor-pointer gap-2">
      <span className="label-text">Live Scores</span>
      <input
        type="checkbox"
        className="toggle toggle-accent"
        checked={enabled}
        onChange={(event) => setEnabled(event.target.checked)}
      />
    </label>
  );
};

export default LiveScoresToggle;
