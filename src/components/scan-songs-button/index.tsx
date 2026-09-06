"use client";

import { isLocalhost } from "@/utilities/is-localhost";
import dynamic from "next/dynamic";
import { scanSongs } from "@/components/scan-songs-button/actions";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const ScanSongsButton = () => {
  const [isScanning, setIsScanning] = useState(false);
  if (!isLocalhost()) return null;

  const handleClick = () => {
    if (confirm("Are you sure you want to scan songs?")) {
      setIsScanning(true);

      scanSongs().then(() => {
        setIsScanning(false);
        location.reload();
      });
    }
  };

  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={handleClick}
      disabled={isScanning}
    >
      {isScanning ? <LoaderCircle className="animate-spin" /> : "Scan songs"}
    </button>
  );
};

export default dynamic(() => Promise.resolve(ScanSongsButton), {
  ssr: false,
});
