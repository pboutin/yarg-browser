/**
 * Return the score with commas as thousands separators.
 * @param score The score to format.
 * @returns The formatted score.
 */
const formatScore = (score: number): string => {
  return score.toLocaleString("en-US");
};

export default formatScore;
