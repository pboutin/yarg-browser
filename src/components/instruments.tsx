import { Difficulty, Instrument } from "@/types";
import classNames from "classnames";
import Image from "next/image";
import { useMemo } from "react";

interface Props {
  instruments?: Instrument[];
  instrumentPersonalBests?: Array<{
    instrument: Instrument;
    difficulty: Difficulty;
    stars: number;
    isFc: boolean;
  }>;
  size?: number;
  className?: string;
  active?: Instrument;
  onClick?: (instrument: Instrument) => void;
}

const PERSONAL_BEST_DISPLAY_RATIO = 0.8;

const Instruments = ({
  instruments = [],
  instrumentPersonalBests,
  size = 60,
  className,
  active,
  onClick,
}: Props) => {
  const displayedInstruments = useMemo<
    Array<
      [
        Instrument,
        { difficulty: Difficulty; stars: number; isFc: boolean } | null,
      ]
    >
  >(() => {
    if (instrumentPersonalBests) {
      return instrumentPersonalBests.map((personalBest) => [
        personalBest.instrument,
        personalBest,
      ]);
    }

    return instruments.map((instrument) => [instrument, null]);
  }, [instrumentPersonalBests, instruments]);

  return (
    <div className={classNames("flex flex-wrap items-center gap-2", className)}>
      {displayedInstruments.map(([instrument, personalBest]) => (
        <div key={instrument} className="flex items-center">
          <Image
            onClick={() => onClick?.(instrument)}
            className={classNames("rounded-full z-5", {
              "border-4 border-primary": active === instrument,
              "cursor-pointer": !!onClick,
            })}
            src={`/instruments/${instrument}.png`}
            alt={instrument.toString()}
            width={size}
            height={size}
          />
          {personalBest ? (
            <>
              <Image
                src={`/difficulties/${personalBest.difficulty}.png`}
                className="-ml-2 z-4"
                alt={instrument.toString()}
                width={size * PERSONAL_BEST_DISPLAY_RATIO}
                height={size * PERSONAL_BEST_DISPLAY_RATIO}
              />
              <Image
                src={`/stars/${
                  personalBest.stars === 6 || personalBest.isFc
                    ? "gold"
                    : "standard"
                }.png`}
                className={classNames("-ml-2", {
                  "gold-to-primary-hue-rotate": personalBest.isFc,
                  "opacity-60": personalBest.stars === 4,
                  "opacity-20": personalBest.stars <= 3,
                })}
                alt={personalBest.stars.toString()}
                width={size * PERSONAL_BEST_DISPLAY_RATIO}
                height={size * PERSONAL_BEST_DISPLAY_RATIO}
              />
            </>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default Instruments;
