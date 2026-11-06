import { cookies } from "next/headers";
import { forPlayer } from "@/repositories/stats";
import StatsScreen from "@/screens/stats";

export const metadata = { title: "Stats | YARG Browser" };

const StatsPage = async () => {
  const cookieStore = await cookies();
  const activePlayerId = cookieStore.get("active-player")?.value;

  if (!activePlayerId) {
    return (
      <div className="h-full overflow-y-auto p-8">
        <h1 className="mb-6 text-3xl font-bold">Stats</h1>
        <div role="status" className="alert alert-info">Select a player to view their stats.</div>
      </div>
    );
  }

  return <StatsScreen stats={await forPlayer(activePlayerId)} />;
};

export default StatsPage;