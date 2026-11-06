export interface StatsHistoryScore {
  id: number;
  checksum: string;
  date: Date;
  name: string;
  artist: string;
  stars: number | null;
  isFc: boolean;
  instrument: number | null;
  difficulty: number | null;
}

export interface StatsSong {
  id: string;
  checksum: string;
  name: string;
  artist: string;
  length: number;
}

export const buildPlayerStats = (
  history: StatsHistoryScore[],
  songs: StatsSong[],
) => {
  const songsByChecksum = new Map(
    songs.map((song) => [song.checksum.toUpperCase(), song]),
  );
  const scores = history.map((score) => {
    const checksum = score.checksum.toUpperCase();
    const song = songsByChecksum.get(checksum);
    return {
      ...score,
      checksum,
      songId: song?.id,
      name: song?.name ?? score.name,
      artist: song?.artist ?? score.artist,
      length: song?.length ?? 0,
    };
  }).sort((first, second) =>
    second.date.getTime() - first.date.getTime() || second.id - first.id,
  );

  const artists = new Map<string, { name: string; plays: number }>();
  const favoriteSongs = new Map<string, {
    checksum: string;
    songId: string | undefined;
    name: string;
    artist: string;
    plays: number;
  }>();
  let totalSessions = 0;
  let totalPlaytime = 0;

  scores.forEach((score, index) => {
    totalPlaytime += score.length;
    if (index === 0 || scores[index - 1].date.getTime() - score.date.getTime() >= 3_600_000) {
      totalSessions += 1;
    }

    const artist = artists.get(score.artist) ?? { name: score.artist, plays: 0 };
    artist.plays += 1;
    artists.set(score.artist, artist);

    const song = favoriteSongs.get(score.checksum) ?? {
      checksum: score.checksum,
      songId: score.songId,
      name: score.name,
      artist: score.artist,
      plays: 0,
    };
    song.plays += 1;
    favoriteSongs.set(score.checksum, song);
  });

  const achievements = (matches: typeof scores) => ({
    total: matches.length,
    distinct: new Set(matches.map((score) => score.checksum)).size,
    recent: matches.slice(0, 20),
  });
  const byPlays = (first: { plays: number; name: string }, second: { plays: number; name: string }) =>
    second.plays - first.plays || first.name.localeCompare(second.name);

  return {
    totalSongsPlayed: scores.length,
    totalPlaytime,
    totalSessions,
    topArtists: [...artists.values()].sort(byPlays).slice(0, 10),
    topSongs: [...favoriteSongs.values()].sort(byPlays).slice(0, 10),
    goldStars: achievements(scores.filter((score) => score.stars === 6)),
    fullCombos: achievements(scores.filter((score) => score.isFc)),
  };
};

export type PlayerStats = ReturnType<typeof buildPlayerStats>;