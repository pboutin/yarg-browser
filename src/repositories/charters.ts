const BASE_INDEX_FILE_URL =
  "https://raw.githubusercontent.com/YARC-Official/OpenSource/refs/heads/master/base/index.json";

const EXTRA_INDEX_FILE_URL =
  "https://raw.githubusercontent.com/YARC-Official/OpenSource/refs/heads/master/extra/index.json";

const DEFAULT_CHARTER_ID = "$DEFAULT$";

export interface Charter {
  id: string;
  name: string;
  iconUrl: string;
}

interface YarcCharter {
  names: {
    "en-US": string;
  };
  icon: string;
  iconUrl: string;
  type: string;
}

const chartersMap = new Map<string, Charter>();

const loadCharters = async () => {
  const baseIndexFile = await fetch(BASE_INDEX_FILE_URL).then((res) =>
    res.json()
  );

  baseIndexFile.sources.forEach((source: YarcCharter & { ids: string[] }) => {
    source.ids.forEach((id) => {
      chartersMap.set(id, {
        id,
        name: source.names["en-US"],
        iconUrl: `https://raw.githubusercontent.com/YARC-Official/OpenSource/refs/heads/master/base/icons/${source.icon}.png`,
      });
    });
  });

  const extraIndexFile = await fetch(EXTRA_INDEX_FILE_URL).then((res) =>
    res.json()
  );

  extraIndexFile.sources.forEach((source: YarcCharter & { ids: string[] }) => {
    source.ids.forEach((id) => {
      chartersMap.set(id, {
        id,
        name: source.names["en-US"],
        iconUrl: `https://raw.githubusercontent.com/YARC-Official/OpenSource/refs/heads/master/extra/icons/${source.icon}.png`,
      });
    });
  });
};

export const getCharter = async (id: string | null) => {
  if (chartersMap.size === 0) {
    await loadCharters();
  }

  const charter =
    chartersMap.get(id ?? DEFAULT_CHARTER_ID) ??
    chartersMap.get(DEFAULT_CHARTER_ID);

  if (!charter) {
    throw new Error(`Charter not found: ${id}`);
  }

  return charter;
};
