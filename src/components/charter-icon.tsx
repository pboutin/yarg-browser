import { useState } from "react";
import { useEffect } from "react";
import { getCharter, Charter } from "@/repositories/charters";
import Image from "next/image";

interface Props {
  charterId: string | null;
  size: number;
}

const CharterIcon = ({ charterId, size }: Props) => {
  const [charter, setCharter] = useState<Charter | null>(null);

  useEffect(() => {
    getCharter(charterId).then(setCharter);
  }, [charterId]);

  if (!charter) {
    return null;
  }

  return (
    <Image
      src={charter.iconUrl}
      alt={charter.name}
      width={size}
      height={size}
    />
  );
};

export default CharterIcon;
