"use server";

import * as ScoresRepository from "@/repositories/scores";

export const fixInvalidGoldStars = async (
  scoreIds: string[],
): Promise<void> => {
  await ScoresRepository.fixInvalidGoldStars(scoreIds);
};
