import { useState } from "react";
import { useEffect } from "react";
import {
  getCharter,
  Charter,
  getDefaultCharter,
} from "@/repositories/charters";
import Image from "next/image";

interface Props {
  charterId: string | null;
  size: number;
  className?: string;
}

const CharterIcon = ({ charterId, size, className }: Props) => {
  const [charter, setCharter] = useState<Charter | null>(null);

  useEffect(() => {
    getCharter(charterId).then(setCharter);
  }, [charterId]);

  if (!charter) {
    return null;
  }

  const handleError = () => {
    getDefaultCharter().then((charter) => {
      setCharter(charter);
    });
  };

  return (
    <Image
      src={charter.iconUrl}
      alt={charter.name}
      width={size}
      height={size}
      className={className}
      onError={handleError}
    />
  );
};

export default CharterIcon;
