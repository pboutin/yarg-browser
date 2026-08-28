"use client";

import { useTransition } from "react";
import { Player } from "@/types";
import { setActivePlayer } from "./actions";
import PlayerDropdown from "@/components/player-dropdown";

interface Props {
  players: Player[];
  activePlayerId?: string;
}

const ActivePlayerSelector = ({ players, activePlayerId }: Props) => {
  const [, startTransition] = useTransition();

  const handleSelect = (playerId: string) => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    startTransition(async () => {
      await setActivePlayer(playerId);
      window.location.reload();
    });
  };

  return (
    <PlayerDropdown
      players={players}
      selectedPlayerId={activePlayerId}
      onChange={handleSelect}
    />
  );
};

export default ActivePlayerSelector;
