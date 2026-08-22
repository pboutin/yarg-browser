import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const scoresPath = env("YARG_SCORES_DB_PATH");
const scoresUrl = scoresPath.startsWith("file:")
  ? scoresPath
  : `file:${scoresPath}`;

export default defineConfig({
  schema: "prisma/scores/schema.prisma",
  datasource: {
    url: scoresUrl,
  },
});
