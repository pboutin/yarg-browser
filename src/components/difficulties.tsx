import { Difficulty } from "@/types";
import classNames from "classnames";

const DIFFICULTY_LABELS = {
  [Difficulty.Beginner]: "Beginner",
  [Difficulty.Easy]: "Easy",
  [Difficulty.Medium]: "Medium",
  [Difficulty.Hard]: "Hard",
  [Difficulty.Expert]: "Expert",
  [Difficulty.ExpertPlus]: "Expert+",
} as const;

interface Props {
  difficulties: Difficulty[];
  active: Difficulty;
  onClick: (difficulty: Difficulty) => void;
}

const Difficulties = ({ difficulties, active, onClick }: Props) => {
  return (
    <div className="join mr-2">
      {difficulties.map((difficulty) => (
        <button
          key={difficulty}
          onClick={() => onClick(difficulty)}
          className={classNames("btn join-item flex-1", {
            "btn-primary": difficulty === active,
          })}
        >
          {DIFFICULTY_LABELS[difficulty]}
        </button>
      ))}
    </div>
  );
};

export default Difficulties;
