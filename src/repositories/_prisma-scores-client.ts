import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@/generated/prisma-scores/client";

const scoresPath =
  process.env.YARG_SCORES_DB_PATH ?? "./scores.db";
const scoresUrl = scoresPath.startsWith("file:")
  ? scoresPath
  : `file:${scoresPath}`;

const adapter = new PrismaBetterSqlite3({
  url: scoresUrl,
  // External DB owned by YARG — open read-only so we never mutate it.
  readonly: true,
});

const scoresPrismaClient = new PrismaClient({ adapter });

export default scoresPrismaClient;
