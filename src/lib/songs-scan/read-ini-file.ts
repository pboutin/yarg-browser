import fs from "fs";

function stripColorTags(value: string): string {
  return value.replace(/<\/?color[^>]*>/gi, "");
}

export default function readIniFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf8");

  const lines = fileContent.split("\n");

  return lines.reduce((acc: Record<string, string>, line) => {
    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) {
      return acc;
    }

    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim();
    acc[key] = stripColorTags(value);

    return acc;
  }, {});
}
