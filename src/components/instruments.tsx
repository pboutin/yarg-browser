import { Instrument } from "@/types";
import classNames from "classnames";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  instruments: Instrument[];
  filteredInstruments?: Instrument[];
  masteredInstruments?: Instrument[];
  size?: number;
  className?: string;
  active?: Instrument;
  onClick?: (instrument: Instrument) => void;
}

const Instruments = ({
  instruments,
  filteredInstruments,
  masteredInstruments = [],
  size = 60,
  className,
  active,
  onClick,
}: Props) => {
  const displayedInstruments = useMemo(() => {
    if (!filteredInstruments) return instruments;

    return instruments.filter((instrument) =>
      filteredInstruments.includes(instrument),
    );
  }, [instruments, filteredInstruments]);

  return (
    <div className={classNames("flex flex-wrap items-center gap-2", className)}>
      {displayedInstruments.map((instrument) => (
        <Image
          onClick={() => onClick?.(instrument)}
          className={classNames("cursor-pointer rounded-full", {
            "border-4 border-primary": active === instrument,
          })}
          key={instrument}
          src={`/instruments/${instrument}.${
            masteredInstruments.includes(instrument) ? "fc.png" : "png"
          }`}
          alt={instrument.toString()}
          width={size}
          height={size}
        />
      ))}
    </div>
  );
};

export default Instruments;
