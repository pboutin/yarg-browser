import ScoreStars from "@/components/score-stars";
import { CompleteScore } from "@/types";
import formatPercent from "@/utilities/format-percent";
import formatScore from "@/utilities/format-score";
import { match } from "ts-pattern";
import { formatDistanceToNow } from "date-fns";

interface Props {
  scores: CompleteScore[];
  bestScore: CompleteScore;
}

const ScoresHistory = ({ scores, bestScore }: Props) => {
  return (
    <div className="flex-1 max-w-(--sidebar-width) min-h-0 overflow-y-auto flex flex-col gap-2 p-2">
      {scores.map((score) => (
        <div
          key={score.id}
          className={match({
            isFc: score.isFc,
            isPb: score.id === bestScore.id,
          })
            .with({ isFc: true }, () => "aura aura-gold")
            .with({ isPb: true }, () => "aura aura-silver")
            .otherwise(() => "")}
        >
          <div className="card w-full bg-tertiary card-sm">
            <div className="card-body">
              <h2 className="card-title">
                <div className="flex w-full justify-between items-center">
                  <span className="text-2xl font-bold">
                    {formatScore(score.score)}
                  </span>
                  <ScoreStars stars={score.stars} size={32} />
                </div>
              </h2>
              <h2 className="card-title">
                <div className="flex w-full justify-between items-center">
                  {formatPercent(score.percent)}
                </div>

                <div className="badge badge-sm badge-secondary text-nowrap">
                  {formatDistanceToNow(score.date, { addSuffix: true })}
                </div>
              </h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScoresHistory;
