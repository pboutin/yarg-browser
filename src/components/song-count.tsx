interface Props {
  count: number;
  className?: string;
}

const SongCount = ({ count, className }: Props) => {
  return (
    <div className={`ml-auto ${className}`}>
      <span className="text-2xl text-primary font-bold">{count}</span>
      <span className="text-xl text-primary/80 ml-2 font-semibold">
        SONG{count !== 1 ? "S" : ""}
      </span>
    </div>
  );
};

export default SongCount;
