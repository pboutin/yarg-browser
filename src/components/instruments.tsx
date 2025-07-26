import Image from "next/image";

interface Props {
  size: number;
  guitar: number | boolean | null;
  bass: number | boolean | null;
  drums: number | boolean | null;
  vocals: number | boolean | null;
  className?: string;
}

export const Instruments = ({
  guitar,
  bass,
  drums,
  vocals,
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
        className={guitar ? "opacity-100" : "opacity-25"}
      />
      <Image
        src="/instruments/bass.png"
        alt="Bass"
        width={size}
        height={size}
        className={bass ? "opacity-100" : "opacity-25"}
      />
      <Image
        src="/instruments/drums.png"
        alt="Drums"
        width={size}
        height={size}
        className={drums ? "opacity-100" : "opacity-25"}
      />
      <Image
        src="/instruments/vocals.png"
        alt="Vocals"
        width={size}
        height={size}
        className={vocals ? "opacity-100" : "opacity-25"}
      />
      <Image
        src="/instruments/band.png"
        alt="Band"
        width={size}
        height={size}
        className={bandStatus ? "opacity-100" : "opacity-25"}
      />
    </div>
  );
};
