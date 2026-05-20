import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { matchService } from "../services/matchService";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import Badge from "../components/common/Badge";
import { timeUntilMatch } from "../utils/helpers";
import toast from "react-hot-toast";

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchService
      .getById(id)
      .then((res) => setMatch(res.data))
      .catch(() => toast.error("Match not found"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <Loader size="lg" text="Loading match..." />
      </div>
    );

  if (!match)
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <p className="text-gray-400">Match not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />

      {/* Match Header */}
      <div className="bg-dark-200 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/home")}
              className="text-gray-400 hover:text-white text-sm"
            >
              ← Back
            </button>
            <Badge
              label={
                match.status === "live"
                  ? "LIVE"
                  : match.status === "upcoming"
                    ? timeUntilMatch(match.matchTime)
                    : "Completed"
              }
              variant={
                match.status === "live"
                  ? "live"
                  : match.status === "upcoming"
                    ? "upcoming"
                    : "completed"
              }
              pulse={match.status === "live"}
            />
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center flex-1 gap-2">
              <div className="w-16 h-16 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center overflow-hidden">
                {match.team1Logo ? (
                  <img
                    src={match.team1Logo}
                    alt={match.team1ShortName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-black text-lg">
                    {match.team1ShortName}
                  </span>
                )}
              </div>
              <p className="text-white font-bold">{match.team1Name}</p>
              {match.status === "live" && (
                <p className="text-primary-400 font-black text-xl">
                  {match.team1Score || "0/0"}
                </p>
              )}
            </div>

            <div className="text-center px-4">
              <p className="text-gray-500 text-sm font-bold">VS</p>
              <p className="text-gray-500 text-xs mt-1">{match.venue}</p>
            </div>

            <div className="flex flex-col items-center flex-1 gap-2">
              <div className="w-16 h-16 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center overflow-hidden">
                {match.team2Logo ? (
                  <img
                    src={match.team2Logo}
                    alt={match.team2ShortName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-black text-lg">
                    {match.team2ShortName}
                  </span>
                )}
              </div>
              <p className="text-white font-bold">{match.team2Name}</p>
              {match.status === "live" && (
                <p className="text-primary-400 font-black text-xl">
                  {match.team2Score || "0/0"}
                </p>
              )}
            </div>
          </div>

          {/* Create Team Button */}
          {match.status !== "completed" && (
            <button
              onClick={() => navigate(`/match/${id}/create-team`)}
              className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl transition-colors text-lg"
            >
              🏏 Create Team
            </button>
          )}
        </div>
      </div>

      {/* Match Info */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Sport</p>
            <p className="text-white font-bold">{match.sport}</p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Prize Pool</p>
            <p className="text-primary-400 font-bold">
              {match.totalPrize
                ? `₹${(match.totalPrize / 100000).toFixed(1)}L`
                : "Free"}
            </p>
          </div>
          <div className="card p-4 text-center">
            <p className="text-gray-400 text-xs mb-1">Contests</p>
            <p className="text-white font-bold">{match.totalContests || 0}</p>
          </div>
        </div>

        {/* View Contests Button */}
        <button
          onClick={() => navigate(`/match/${id}/contests`)}
          className="w-full border border-primary-500/50 hover:border-primary-500 text-primary-400 font-bold py-3 rounded-xl transition-colors"
        >
          View All Contests
        </button>
      </div>
    </div>
  );
};

export default MatchDetail;
