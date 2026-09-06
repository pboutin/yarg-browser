"use client";

import { CompleteScore } from "@/types";
import { isLocalhost } from "@/utilities/is-localhost";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { fixInvalidGoldStars } from "@/components/fix-stars-button/actions";

interface Props {
  scores: CompleteScore[];
}

const FixStarsButton = ({ scores }: Props) => {
  const erroredScoreIds = useMemo(() => {
    if (!isLocalhost()) return [];

    const bestFiveStars = scores.reduce((acc, { stars, score }) => {
      if (stars === 6) return acc;
      return Math.max(acc, score);
    }, 0);

    return scores
      .filter(({ stars, score }) => stars === 6 && score <= bestFiveStars)
      .map(({ id }) => id);
  }, [scores]);

  if (erroredScoreIds.length === 0) return null;

  const handleClick = () => {
    if (
      confirm(`${erroredScoreIds.length} scores will be updated. Are you sure?`)
    ) {
      fixInvalidGoldStars(erroredScoreIds).then(() => location.reload());
    }
  };

  return (
    <button className="btn btn-warning" onClick={handleClick}>
      Fix invalid gold stars ({erroredScoreIds.length})
    </button>
  );
};

export default dynamic(() => Promise.resolve(FixStarsButton), {
  ssr: false,
});
