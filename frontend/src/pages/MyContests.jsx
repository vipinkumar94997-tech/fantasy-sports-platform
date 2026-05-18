import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contestService } from "../services/contestService";
import Navbar from "../components/common/Navbar";
import SkeletonCard from "../components/common/SkeletonCard";
import EmptyState from "../components/common/EmptyState";
import { formatCurrency, formatDate, getRankSuffix } from "../utils/helpers";

const MyContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    contestService
      .getMyContests()
      .then((res) => setContests(res.data.contests))
      .finally(() => setLoading(false));
  }, []);

  const filtered = contests.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Live") return c.match?.status === "live";
    if (filter === "Upcoming") return c.match?.status === "upcoming";
    if (filter === "Completed") return c.match?.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-white font-black text-2xl mb-4">My Contests 🏆</h1>

        <div className="flex gap-2 mb-6">
          {["All", "Live", "Upcoming", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-dark-200 text-gray-400 border border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🏆"
            title="No contests joined"
            subtitle="Join a contest to see it here"
            action={{
              label: "Browse Matches",
              onClick: () => navigate("/home"),
            }}
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((entry, i) => (
              <div
                key={i}
                className="card p-5 cursor-pointer hover:border-primary-500/30 transition-all"
                onClick={() =>
                  entry.match?.status === "live" &&
                  navigate(`/live/${entry.match._id}`)
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-sm">
                      {entry.contest?.name}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {entry.match?.team1?.shortName} vs{" "}
                      {entry.match?.team2?.shortName}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      entry.match?.status === "live"
                        ? "bg-red-500/20 text-red-400"
                        : entry.match?.status === "upcoming"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {entry.match?.status === "live"
                      ? "🔴 LIVE"
                      : entry.match?.status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 py-3 border-t border-white/10">
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Entry</p>
                    <p className="text-white text-sm font-bold">
                      {entry.contest?.entryFee === 0
                        ? "FREE"
                        : formatCurrency(entry.contest?.entryFee)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Prize Pool</p>
                    <p className="text-primary-400 text-sm font-bold">
                      {formatCurrency(entry.contest?.prizePool)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Rank</p>
                    <p className="text-white text-sm font-bold">
                      {entry.rank ? getRankSuffix(entry.rank) : "-"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-xs">Points</p>
                    <p className="text-white text-sm font-bold">
                      {entry.points || "-"}
                    </p>
                  </div>
                </div>

                {entry.winning > 0 && (
                  <div className="mt-3 bg-primary-500/10 border border-primary-500/30 rounded-lg p-3 text-center">
                    <p className="text-primary-400 font-bold">
                      🏆 Won {formatCurrency(entry.winning)}!
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContests;
