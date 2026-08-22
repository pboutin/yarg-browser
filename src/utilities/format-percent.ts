/**
 * Return the percent as a string with a percentage sign.
 * @param percent The percent to format.
 * @returns The formatted percent.
 */
export const formatPercent = (percent: number): string => {
  return `${(percent * 100).toFixed(2)} %`;
};

export default formatPercent;
