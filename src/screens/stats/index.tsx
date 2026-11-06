import Link from "next/link";
import { Fragment } from "react";
import { format } from "date-fns";
import { Music, Star, Trophy } from "lucide-react";
import ScoreStars from "@/components/score-stars";
import type { PlayerStats } from "@/utilities/player-stats";

const number = (value: number) => value.toLocaleString("en-US");

const AchievementSection = ({ title, achievement, fullCombo = false }: {
  title: string;
  achievement: PlayerStats["goldStars"];
  fullCombo?: boolean;
}) => (
  <section className="min-w-0 border-t-2 border-layout-light bg-tertiary/40 p-4">
    <h2 className="flex items-center gap-2 text-xl font-semibold">
      {fullCombo ? <Trophy className="size-5 text-success" /> : <Star className="size-5 text-accent" />}
      {title}
    </h2>
    <div className="stats my-4 grid w-full grid-cols-2 bg-base-200">
      <div className="stat min-w-0 px-4">
        <div className="stat-title">Total</div>
        <div className="stat-value text-2xl">{number(achievement.total)}</div>
      </div>
      <div className="stat min-w-0 px-4">
        <div className="stat-title">Distinct</div>
        <div className="stat-value text-2xl">{number(achievement.distinct)}</div>
      </div>
    </div>
    <h3 className="mb-2 text-sm font-semibold text-base-content/60">Last 20</h3>
    {achievement.recent.length === 0 ? (
      <p className="py-6 text-sm text-base-content/60">No {title.toLowerCase()} yet.</p>
    ) : (
      <ul className="list">
        {achievement.recent.map((score) => (
          <li key={score.id} className="border-b border-base-content/10 py-3 last:border-0">
            <div className="flex min-w-0 items-start gap-3">
              {score.songId ? (
                <Link href={`/song/${score.songId}${score.instrument != null && score.difficulty != null ? `?instrument=${score.instrument}&difficulty=${score.difficulty}` : ""}`} className="link link-hover min-w-0 flex-1 break-words font-semibold">
                  {score.name}
                </Link>
              ) : <span className="min-w-0 flex-1 break-words font-semibold">{score.name}</span>}
              {fullCombo ? <span className="badge badge-success badge-sm shrink-0">FC</span> : <ScoreStars stars={6} size={14} />}
            </div>
            <p className="mt-1 break-words text-sm text-base-content/70">{score.artist}</p>
            <time dateTime={score.date.toISOString()} className="mt-1 block text-xs text-base-content/50">
              {format(score.date, "PP p")}
            </time>
          </li>
        ))}
      </ul>
    )}
  </section>
);

const StatsScreen = ({ stats }: { stats: PlayerStats }) => {
  const totalSeconds = Math.floor(stats.totalPlaytime / 1000);
  const playtime = `${number(Math.floor(totalSeconds / 3600))}h ${Math.floor(totalSeconds / 60) % 60}m ${totalSeconds % 60}s`;
  const favorites = [
    { kind: "artists", items: stats.topArtists.map((artist) => ({
      ...artist, checksum: artist.name, songId: undefined, artist: undefined,
    })) },
    { kind: "songs", items: stats.topSongs },
  ];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-8 sm:px-6">
        <h1 className="mb-6 text-3xl font-bold">Stats</h1>
        <div className="grid items-start gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6">
            <section className="border-t-2 border-layout-light bg-tertiary/40 p-4">
              <h2 className="text-xl font-semibold">Misc</h2>
              <div className="stats stats-vertical mt-4 w-full bg-base-200">
                {[
                  ["Total songs played", number(stats.totalSongsPlayed)],
                  ["Total playtime", playtime],
                  ["Total sessions", number(stats.totalSessions)],
                ].map(([label, value]) => (
                  <div key={label} className="stat min-w-0 px-4">
                    <div className="stat-title">{label}</div>
                    <div className="stat-value whitespace-normal break-words text-2xl">{value}</div>
                  </div>
                ))}
              </div>
            </section>
            <section className="min-w-0 border-t-2 border-layout-light bg-tertiary/40 p-4">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Music className="size-5 text-primary" />Favorites</h2>
              <div className="tabs tabs-border">
                {favorites.map(({ kind, items }) => (
                  <Fragment key={kind}>
                    <input type="radio" name="favorites" className="tab px-3" aria-label={`Top 10 ${kind}`} defaultChecked={kind === "artists"} />
                    <div className="tab-content pt-3">
                      {items.length === 0 ? (
                        <p className="py-6 text-sm text-base-content/60">No songs played yet.</p>
                      ) : (
                        <table className="table table-sm w-full table-fixed">
                          <thead><tr><th className="w-9">#</th><th>{kind === "artists" ? "Artist" : "Song"}</th><th className="w-16 text-right">Plays</th></tr></thead>
                          <tbody>
                            {items.map((item, index) => (
                              <tr key={item.checksum}>
                                <td className="text-base-content/50">{index + 1}</td>
                                <td className="break-words whitespace-normal">
                                  {item.songId ? <Link className="link link-hover font-semibold" href={`/song/${item.songId}`}>{item.name}</Link> : <span className="font-semibold">{item.name}</span>}
                                  {item.artist && <div className="mt-1 text-xs text-base-content/60">{item.artist}</div>}
                                </td>
                                <td className="text-right font-semibold tabular-nums">{number(item.plays)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
            </section>
          </div>
          <AchievementSection title="Gold Stars" achievement={stats.goldStars} />
          <AchievementSection title="Full Combos" achievement={stats.fullCombos} fullCombo />
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;