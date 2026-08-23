"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchLatestScoreMetadata, fetchSongId } from "./actions";

const POLL_INTERVAL_MS = 5000;

const LiveScoresToggle = () => {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const lastSongChecksumRef = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      lastSongChecksumRef.current = null;
      return;
    }

    let cancelled = false;

    const poll = async () => {
      const scoreMetadata = await fetchLatestScoreMetadata();
      if (cancelled || !scoreMetadata) return;

      if (lastSongChecksumRef.current === null) {
        lastSongChecksumRef.current = scoreMetadata.songChecksum;
        return;
      }

      if (scoreMetadata.songChecksum === lastSongChecksumRef.current) return;
      lastSongChecksumRef.current = scoreMetadata.songChecksum;

      const songId = await fetchSongId(scoreMetadata.songChecksum);
      console.log("songId", songId);
      if (!songId || cancelled) return;

      router.push(`/song/${songId}`);
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
