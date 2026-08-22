import Image from "next/image";

interface Props {
  stars: number;
  size?: number;
}

const STAR_SRC = {
  gold: "/stars/gold.png",
  standard: "/stars/standard.png",
  missing: "/stars/missing.png",
} as const;

const starSrc = (stars: number, index: number) => {
  if (stars > 5) return STAR_SRC.gold;
  if (index < stars) return STAR_SRC.standard;
  return STAR_SRC.missing;
};

const ScoreStars = ({ stars, size = 24 }: Props) => {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, index) => (
        <Image
          key={index}
          src={starSrc(stars, index)}
          alt=""
          width={size}
          height={size}
        />
      ))}
    </div>
  );
};

export default ScoreStars;
