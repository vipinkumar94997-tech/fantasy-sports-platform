import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import { formatCurrency } from "../utils/helpers";

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/contests/winners")
      .then((res) => setWinners(res.data.winners || []))
      .catch(() => setWinners([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-white font-black text-2xl mb-6">🏆 Winners</h1>
        {loading ? (
          <p className="text-gray-400 text-center py-10">Loading...</p>
        ) : winners.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">🏆</p>
            <p className="text-white font-bold text-lg">No winners yet</p>
            <p className="text-gray-400 text-sm mt-2">Join contests to win!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {winners.map((w, i) => (
              <div key={i} className="card p-4 flex items-center gap-4">
                <span className="text-2xl">
                  {i === 0
                    ? "🥇"
                    : i === 1
                      ? "🥈"
                      : i === 2
                        ? "🥉"
                        : `#${i + 1}`}
                </span>
                <div className="flex-1">
                  <p className="text-white font-semibold">
                    {w.user?.name || "Player"}
                  </p>
                  <p className="text-gray-500 text-xs">{w.contest?.name}</p>
                </div>
                <p className="text-primary-400 font-bold">
                  {formatCurrency(w.winning)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Winners;
