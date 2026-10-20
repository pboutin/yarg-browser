"use client";

import Link from "next/link";
import LiveScoresToggle from "@/components/live-scores-toggle/index";
import ActivePlayerSelector from "@/components/active-player-selector/index";
import ScanSongsButton from "@/components/scan-songs-button";
import { useState } from "react";
import { Player } from "@/types";
import classNames from "classnames";

interface Props {
  players: Player[];
  activePlayerId: string | undefined;
}

const MainNav = ({ players, activePlayerId }: Props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <>
      <div
        className="h-4 fixed top-0 left-0 right-0 z-100"
        onMouseEnter={() => setIsVisible(true)}
      />
      <nav
        className={classNames(
          "z-100 fixed top-[-1px] navbar bg-background border-b-8 border-layout-light transition-transform",
          isVisible ? "translate-y-0" : "-translate-y-full",
        )}
        onMouseLeave={() => setIsVisible(false)}
      >
        <Link href="/" className="btn btn-ghost text-xl">
          YARG Browser
        </Link>
        <Link href="/" className="btn btn-ghost">
          Library
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <ActivePlayerSelector
            players={players}
            activePlayerId={activePlayerId}
          />
          <LiveScoresToggle />

          <ScanSongsButton />
        </div>
      </nav>
    </>
  );
};

export default MainNav;
