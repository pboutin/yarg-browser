import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

/** Same order as IniSubEntry.CHART_FILE_TYPES — first match wins when song.ini exists. */
const CHART_FILE_TYPES = [
  "notes.mid",
  "notes.midi",
  "notes.chart",
  "notes.txt",
] as const;

function findChartFile(songDir: string): string {
  const hasIni = existsSync(join(songDir, "song.ini"));
  // Without song.ini, YARG only considers UltraStar (notes.txt) — index 3.
  const startIndex = hasIni ? 0 : 3;
  for (let i = startIndex; i < CHART_FILE_TYPES.length; i++) {
    const candidate = join(songDir, CHART_FILE_TYPES[i]);
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  throw new Error(
    `No chart file found in "${songDir}". Expected one of: ${CHART_FILE_TYPES.join(", ")}`,
  );
}

export function computeSongChecksum(songDir: string): string {
  const chartPath = findChartFile(songDir);
  const bytes = readFileSync(chartPath);
  const hash = createHash("sha1").update(bytes).digest("hex").toUpperCase();
  return hash;
}
