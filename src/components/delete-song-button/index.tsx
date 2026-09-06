"use client";

import { isLocalhost } from "@/utilities/is-localhost";
import dynamic from "next/dynamic";
import { deleteSong } from "@/components/delete-song-button/actions";
import { useState } from "react";
import { LoaderCircle, Trash } from "lucide-react";
import { Song } from "@/types";

interface Props {
  song: Song;
  onDeleted: (song: Song) => void;
}

const DeleteSongButton = ({ song, onDeleted }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  if (!isLocalhost()) return null;

  const handleClick = () => {
    if (confirm("Are you sure you want to delete this song?")) {
      setIsDeleting(true);

      deleteSong(song).then(() => {
        setIsDeleting(false);
        onDeleted?.(song);
      });
    }
  };

  return (
    <button
      className="btn btn-error"
      onClick={handleClick}
      disabled={isDeleting}
    >
      {isDeleting ? (
        <LoaderCircle className="animate-spin" />
      ) : (
        <>
          <Trash className="w-4 h-4" /> Delete song
        </>
      )}
    </button>
  );
};

export default dynamic(() => Promise.resolve(DeleteSongButton), {
  ssr: false,
});
