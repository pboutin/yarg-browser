import { Instrument } from "@/types";
import classNames from "classnames";
import Image from "next/image";

interface Props {
  instruments: Instrument[];
  variant?: "regular" | "fc";
  size?: number;
  className?: string;
  active?: Instrument;
  onClick?: (instrument: Instrument) => void;
}

const Instruments = ({
  instruments,
  variant = "regular",
  size = 60,
  className,
  active,
  onClick,
}: Props) => {
  return (
    <div className={classNames("flex flex-wrap items-center gap-2", className)}>
      {instruments.map((instrument) => (
        <Image
          onClick={() => onClick?.(instrument)}
          className={classNames("cursor-pointer rounded-full", {
            "border-4 border-primary": active === instrument,
          })}
          key={instrument}
          src={`/instruments/${instrument}.${
            variant === "fc" ? "fc.png" : "png"
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
