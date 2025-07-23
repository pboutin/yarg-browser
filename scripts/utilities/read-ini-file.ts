import fs from "fs";

export default function readIniFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf8");

  const lines = fileContent.split("\n");

  return lines.reduce((acc: Record<string, string>, line) => {
    const parts = line.split("=");

    if (parts.length !== 2) {
      return acc;
    }

    const [key, value] = parts;
    acc[key.trim()] = value.trim();

    return acc;
  }, {});
}
