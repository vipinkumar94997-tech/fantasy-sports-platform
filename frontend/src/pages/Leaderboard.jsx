import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { formatCurrency, getInitials } from "../utils/helpers";
import { useAuth } from "../hooks/useAuth";

const Leaderboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("weekly");
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/leaderboard?period=${filter}`)
      .then((res) => {
        const lb = res.data.leaderboard || [];
        setData(lb);
        const me = lb.find(
          (u) => u.userId === user?.id || u.userId === user?._id,
        );
        if (me) setMyRank(me);
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [filter]);

  const getMedalColor = (rank) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-yellow-600";
    return "text-gray-500";
  };

  const getPodiumHeight = (rank) => {
    if (rank === 1) return "h-24";
    if (rank === 2) return "h-16";
    return "h-12";
  };

  const getPodiumColor = (rank) => {
    if (rank === 1) return "bg-yellow-400";
    if (rank === 2) return "bg-gray-400";
    return "bg-yellow-700";
  };

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-white font-black text-2xl mb-1">
            Leaderboard 🏅
          </h1>
          <p className="text-gray-500 text-sm">Top players by winnings</p>
        </div>

        {/* Period Filter */}
        <div className="flex bg-dark-200 rounded-xl p-1 mb-6">
          {["daily", "weekly", "monthly"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
                filter === f ? "bg-primary-600 text-white" : "text-gray-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader size="lg" text="Loading leaderboard..." />
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🏆</p>
            <p className="text-white font-bold text-lg mb-2">No data yet</p>
            <p className="text-gray-400 text-sm">
              Join contests to appear on leaderboard
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            {data.length >= 3 && (
              <div className="card p-6 mb-6">
                <h3 className="text-white font-bold text-center mb-6">
                  🏆 Top 3 Players
                </h3>
                <div className="flex items-end justify-center gap-4">
                  {/* 2nd Place */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-gray-400/20 border-2 border-gray-400 flex items-center justify-center text-white font-black mb-2">
                      {getInitials(data[1]?.userName)}
                    </div>
                    <p className="text-white text-xs font-semibold mb-1 truncate w-full text-center">
                      {data[1]?.userName}
                    </p>
                    <p className="text-gray-400 text-xs mb-2">
                      {formatCurrency(data[1]?.totalWinnings)}
                    </p>
                    <div className="w-full h-16 bg-gray-400 rounded-t-lg flex items-center justify-center">
                      <span className="text-black font-black text-xl">2</span>
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="text-2xl mb-1">👑</div>
                    <div className="w-14 h-14 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center text-white font-black mb-2">
                      {getInitials(data[0]?.userName)}
                    </div>
                    <p className="text-white text-xs font-semibold mb-1 truncate w-full text-center">
                      {data[0]?.userName}
                    </p>
                    <p className="text-primary-400 text-xs font-bold mb-2">
                      {formatCurrency(data[0]?.totalWinnings)}
                    </p>
                    <div className="w-full h-24 bg-yellow-400 rounded-t-lg flex items-center justify-center">
                      <span className="text-black font-black text-2xl">1</span>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="flex flex-col items-center flex-1">
                    <div className="w-12 h-12 rounded-full bg-yellow-700/20 border-2 border-yellow-700 flex items-center justify-center text-white font-black mb-2">
                      {getInitials(data[2]?.userName)}
                    </div>
                    <p className="text-white text-xs font-semibold mb-1 truncate w-full text-center">
                      {data[2]?.userName}
                    </p>
                    <p className="text-gray-400 text-xs mb-2">
                      {formatCurrency(data[2]?.totalWinnings)}
                    </p>
                    <div className="w-full h-12 bg-yellow-700 rounded-t-lg flex items-center justify-center">
                      <span className="text-black font-black text-xl">3</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Rank Card */}
            {myRank && (
              <div className="bg-primary-600/20 border border-primary-500/40 rounded-xl p-4 mb-4">
                <p className="text-primary-400 text-xs font-semibold mb-2">
                  YOUR RANK
                </p>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-2xl font-black ${getMedalColor(myRank.rank)}`}
                  >
                    #{myRank.rank}
                  </span>
                  <div className="flex-1">
                    <p className="text-white font-bold">{myRank.userName}</p>
                    <p className="text-gray-400 text-xs">
                      {myRank.contestsWon} contests won
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-400 font-bold">
                      {formatCurrency(myRank.totalWinnings)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {myRank.totalPoints} pts
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Full List */}
            <div className="space-y-2">
              {data.map((entry) => (
                <div
                  key={entry.userId}
                  className={`card p-4 flex items-center gap-4 ${
                    entry.userId === user?.id || entry.userId === user?._id
                      ? "border-primary-500/40"
                      : ""
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-10 text-center font-black text-lg flex-shrink-0 ${getMedalColor(entry.rank)}`}
                  >
                    {entry.rank <= 3
                      ? entry.rank === 1
                        ? "🥇"
                        : entry.rank === 2
                          ? "🥈"
                          : "🥉"
                      : `#${entry.rank}`}
                  </div>

                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      entry.rank === 1
                        ? "bg-yellow-400/20 text-yellow-400 border border-yellow-400/50"
                        : entry.rank === 2
                          ? "bg-gray-400/20 text-gray-300 border border-gray-400/50"
                          : entry.rank === 3
                            ? "bg-yellow-700/20 text-yellow-600 border border-yellow-700/50"
                            : "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                    }`}
                  >
                    {getInitials(entry.userName)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white font-semibold text-sm truncate">
                        {entry.userName}
                      </p>
                      {(entry.userId === user?.id ||
                        entry.userId === user?._id) && (
                        <span className="text-primary-400 text-xs bg-primary-500/20 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs">
                      {entry.contestsWon} won · {entry.contestsPlayed} played
                    </p>
                  </div>

                  {/* Winnings */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-primary-400 font-bold text-sm">
                      {formatCurrency(entry.totalWinnings)}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {entry.totalPoints} pts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
