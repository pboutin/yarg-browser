import { Instrument } from "@/types";
import classNames from "classnames";
import Image from "next/image";

interface Props {
  instruments: Instrument[];
  active?: Instrument;
  onClick?: (instrument: Instrument) => void;
}

const Instruments = ({ instruments, active, onClick }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {instruments.map((instrument) => (
        <Image
          onClick={() => onClick?.(instrument)}
          className={classNames("cursor-pointer rounded-full", {
            "border-4 border-primary": active === instrument,
          })}
          key={instrument}
          src={`/instruments/${instrument}.png`}
          alt={instrument.toString()}
          width={60}
          height={60}
        />
      ))}
    </div>
  );
};

export default Instruments;
