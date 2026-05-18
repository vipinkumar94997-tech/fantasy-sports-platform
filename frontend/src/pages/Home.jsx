import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMatches } from "../redux/slices/matchSlice";
import MatchCard from "../components/match/MatchCard";
import SkeletonCard from "../components/common/SkeletonCard";
import EmptyState from "../components/common/EmptyState";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";

const FILTERS = ["All", "Cricket", "Football", "Live", "Upcoming"];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: matches, loading } = useSelector((s) => s.matches);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchMatches());
    const interval = setInterval(() => dispatch(fetchMatches()), 30000);
    return () => clearInterval(interval);
  }, []);

  const filtered = matches.filter((m) => {
    if (filter === "All") return true;
    if (filter === "Live") return m.status === "live";
    if (filter === "Upcoming") return m.status === "upcoming";
    return m.sport?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-white font-black text-2xl mb-1">Matches 🏏</h1>
          <p className="text-gray-500 text-sm">
            Pick a match and create your winning team
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-dark-200 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {f === "Live" ? "🔴 Live" : f}
            </button>
          ))}
        </div>

        {/* Live banner */}
        {matches.some((m) => m.status === "live") && (
          <div
            onClick={() => setFilter("Live")}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center justify-between cursor-pointer hover:bg-red-500/15 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <div>
                <p className="text-white font-bold text-sm">
                  Matches Live Now!
                </p>
                <p className="text-red-400 text-xs">Real-time scoring active</p>
              </div>
            </div>
            <span className="text-red-400 text-sm font-semibold">View →</span>
          </div>
        )}

        {/* Matches Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} lines={4} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🏏"
            title="No matches found"
            subtitle="Check back soon for upcoming matches"
            action={{
              label: "Refresh",
              onClick: () => dispatch(fetchMatches()),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
