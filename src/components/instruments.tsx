import Image from "next/image";
import classNames from "classnames";

interface Props {
  size: number;
  guitar: number | boolean | null;
  bass: number | boolean | null;
  drums: number | boolean | null;
  vocals: number | boolean | null;
  onGuitarSelect?: () => void;
  onBassSelect?: () => void;
  onDrumsSelect?: () => void;
  onVocalsSelect?: () => void;
  onBandSelect?: () => void;
  className?: string;
}

export const Instruments = ({
  guitar,
  bass,
  drums,
  vocals,
  onGuitarSelect,
  onBassSelect,
  onDrumsSelect,
  onVocalsSelect,
  onBandSelect,
  className,
  size,
}: Props) => {
  const bandStatus = !!guitar && !!bass && !!drums && !!vocals;

  return (
    <div className={`flex flex-row gap-2 ${className}`}>
      <Image
        src="/instruments/guitar.png"
        alt="Guitar"
        width={size}
        height={size}
        className={classNames(
          "transition-opacity duration-300",
          guitar ? "opacity-100" : "opacity-25",
          onGuitarSelect && "cursor-pointer hover:opacity-75"
        )}
        onClick={onGuitarSelect}
      />
      <Image
        src="/instruments/bass.png"
        alt="Bass"
        width={size}
        height={size}
        className={classNames(
          "transition-opacity duration-300",
          bass ? "opacity-100" : "opacity-25",
          onBassSelect && "cursor-pointer hover:opacity-75"
        )}
        onClick={onBassSelect}
      />
      <Image
        src="/instruments/drums.png"
        alt="Drums"
        width={size}
        height={size}
        className={classNames(
          "transition-opacity duration-300",
          drums ? "opacity-100" : "opacity-25",
          onDrumsSelect && "cursor-pointer hover:opacity-75"
        )}
        onClick={onDrumsSelect}
      />
      <Image
        src="/instruments/vocals.png"
        alt="Vocals"
        width={size}
        height={size}
        className={classNames(
          "transition-opacity duration-300",
          vocals ? "opacity-100" : "opacity-25",
          onVocalsSelect && "cursor-pointer hover:opacity-75"
        )}
        onClick={onVocalsSelect}
      />
      <Image
        src="/instruments/band.png"
        alt="Band"
        width={size}
        height={size}
        className={classNames(
          "transition-opacity duration-300",
          bandStatus ? "opacity-100" : "opacity-25",
          onBandSelect && "cursor-pointer hover:opacity-75"
        )}
        onClick={onBandSelect}
      />
    </div>
  );
};
