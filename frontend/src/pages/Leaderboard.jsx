import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { formatCurrency, getInitials } from "../utils/helpers";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("weekly");

  useEffect(() => {
    api
      .get(`/leaderboard?period=${filter}`)
      .then((res) => setData(res.data.leaderboard))
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-white font-black text-2xl mb-4">Leaderboard 🏅</h1>

        <div className="flex gap-2 mb-6">
          {["daily", "weekly", "monthly"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-dark-200 text-gray-400 border border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        {!loading && data.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-8">
            {[data[1], data[0], data[2]].map((user, i) => {
              const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
              const heights = ["h-24", "h-32", "h-20"];
              const colors = ["bg-gray-400", "bg-yellow-400", "bg-yellow-600"];
              return (
                <div key={rank} className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-black text-lg mx-auto mb-2">
                    {getInitials(user?.userName)}
                  </div>
                  <p className="text-white text-xs font-semibold mb-2 truncate">
                    {user?.userName}
                  </p>
                  <div
                    className={`${heights[i]} ${colors[i]} rounded-t-xl flex items-center justify-center`}
                  >
                    <span className="text-black font-black text-xl">
                      #{rank}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader />
          </div>
        ) : (
          <div className="space-y-2">
            {data.map((user, i) => (
              <div
                key={i}
                className={`card p-4 flex items-center gap-4 ${i < 3 ? "border-yellow-500/20" : ""}`}
              >
                <span
                  className={`text-lg font-black w-8 text-center ${
                    i === 0
                      ? "text-yellow-400"
                      : i === 1
                        ? "text-gray-300"
                        : i === 2
                          ? "text-yellow-600"
                          : "text-gray-500"
                  }`}
                >
                  #{i + 1}
                </span>
                <div className="w-10 h-10 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold flex-shrink-0">
                  {getInitials(user.userName)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">
                    {user.userName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {user.contestsWon} contests won
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-primary-400 font-bold">
                    {formatCurrency(user.totalWinnings)}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {user.totalPoints} pts
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
