"use client";

import { useTransition } from "react";
import { Player } from "@/types";
import { setActivePlayer } from "./actions";

interface Props {
  players: Player[];
  activePlayerId?: string;
}

const PlayerDropdown = ({ players, activePlayerId }: Props) => {
  const [, startTransition] = useTransition();

  const activePlayer = players.find((p) => p.id === activePlayerId);

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
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
        <span className="text-gray-400 text-sm">Player:</span>
        <span className="font-semibold text-primary">
          {activePlayer?.name ?? "Select Player"}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 fill-current opacity-70"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
      <ul
        tabIndex={-1}
        className="dropdown-content menu bg-base-200 rounded-box z-50 mt-2 w-56 p-2 shadow-lg"
      >
        {players.length === 0 ? (
          <li className="px-2 py-1 text-sm text-gray-400">No players found</li>
        ) : (
          players.map((player) => {
            const isSelected = player.id === activePlayerId;
            return (
              <li key={player.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(player.id)}
                  className={`flex justify-between items-center ${
                    isSelected ? "active font-bold" : ""
                  }`}
                >
                  <span>{player.name || player.id}</span>
                  {isSelected && <span>✓</span>}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
};

export default PlayerDropdown;
