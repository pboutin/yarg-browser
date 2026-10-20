import fs from "fs";

function stripColorTags(value: string): string {
  return value.replace(/<\/?color[^>]*>/gi, "");
}

function orderedEntriesFromFile(filePath: string): [string, string][] {
  const fileContent = fs.readFileSync(filePath, "utf8");

  const lines = fileContent.split("\n");

  return lines
    .map((line) => {
      const eqIndex = line.indexOf("=");
      if (eqIndex === -1) {
        return null;
      }

      const key = line.slice(0, eqIndex).trim();
      const value = line.slice(eqIndex + 1).trim();

      return [key, value];
    })
    .filter((entry): entry is [string, string] => entry !== null);
}

export function readIniFile(filePath: string) {
  return Object.fromEntries(
    orderedEntriesFromFile(filePath).map(([key, value]) => [
      key,
      stripColorTags(value),
    ]),
  );
}

export function writeIniFile(
  filePath: string,
  partialData: Record<string, string>,
) {
  const lines = orderedEntriesFromFile(filePath).map(
    ([key, originalValue]) => `${key} = ${partialData[key] ?? originalValue}`,
  );
  fs.writeFileSync(filePath, ["[song]", ...lines, ""].join("\n"), "utf8");
}
