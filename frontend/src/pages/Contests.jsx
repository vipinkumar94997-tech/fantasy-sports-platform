import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { contestService } from "../services/contestService";
import ContestCard from "../components/contest/ContestCard";
import SkeletonCard from "../components/common/SkeletonCard";
import EmptyState from "../components/common/EmptyState";
import Navbar from "../components/common/Navbar";
import toast from "react-hot-toast";

const TYPES = ["All", "Free", "Paid", "Head to Head", "Mega"];

const Contests = () => {
  const { id: matchId } = useParams();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    contestService
      .getByMatch(matchId)
      .then((res) => setContests(res.data.contests))
      .catch(() => toast.error("Failed to load contests"))
      .finally(() => setLoading(false));
  }, [matchId]);

  const filtered = contests.filter((c) => {
    if (filter === "All") return true;
    if (filter === "Free") return c.entryFee === 0;
    if (filter === "Paid") return c.entryFee > 0;
    if (filter === "Head to Head") return c.type === "H2H";
    if (filter === "Mega") return c.type === "MEGA";
    return true;
  });

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-white font-black text-2xl mb-4">All Contests</h1>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                filter === t
                  ? "bg-primary-600 text-white"
                  : "bg-dark-200 text-gray-400 border border-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🏆"
            title="No contests found"
            subtitle="Try a different filter"
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((c) => (
              <ContestCard key={c._id} contest={c} matchId={matchId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
