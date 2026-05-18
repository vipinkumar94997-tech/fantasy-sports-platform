import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import { matchService } from "../services/matchService";
import { contestService } from "../services/contestService";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { getRankSuffix } from "../utils/helpers";
import toast from "react-hot-toast";

const LiveMatch = () => {
  const { matchId } = useParams();
  const { on, off } = useSocket(matchId);
  const [match, setMatch] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [commentary, setCommentary] = useState([]);
  const [activeTab, setActiveTab] = useState("score");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    matchService
      .getById(matchId)
      .then((res) => setMatch(res.data.match))
      .catch(() => toast.error("Failed to load match"))
      .finally(() => setLoading(false));
  }, [matchId]);

  useEffect(() => {
    on("score-update", (data) => {
      setMatch((prev) => ({ ...prev, ...data }));
    });
    on("leaderboard-update", (data) => {
      setLeaderboard(data);
    });
    on("commentary", (data) => {
      setCommentary((prev) => [data, ...prev].slice(0, 50));
    });
    return () => {
      off("score-update");
      off("leaderboard-update");
      off("commentary");
    };
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <Loader size="lg" text="Loading live match..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />

      {/* Live Score Banner */}
      <div className="bg-dark-200 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-400 text-sm font-bold">LIVE</span>
            </div>
            <span className="text-gray-500 text-xs">{match?.venue}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <p className="text-white font-black text-lg">
                {match?.team1?.shortName}
              </p>
              <p className="text-primary-400 font-black text-2xl">
                {match?.team1?.score || "0/0"}
              </p>
              <p className="text-gray-500 text-xs">
                {match?.team1?.overs || "0"} ov
              </p>
            </div>
            <div className="text-center px-4">
              <p className="text-gray-500 text-xs">VS</p>
              {match?.currentBowler && (
                <p className="text-gray-400 text-xs mt-1">
                  🎳 {match.currentBowler}
                </p>
              )}
              {match?.currentBatsman && (
                <p className="text-gray-400 text-xs">
                  🏏 {match.currentBatsman}
                </p>
              )}
            </div>
            <div className="text-center flex-1">
              <p className="text-white font-black text-lg">
                {match?.team2?.shortName}
              </p>
              <p className="text-primary-400 font-black text-2xl">
                {match?.team2?.score || "Yet to bat"}
              </p>
              <p className="text-gray-500 text-xs">
                {match?.team2?.overs || "0"} ov
              </p>
            </div>
          </div>

          {match?.lastBall && (
            <div className="mt-3 text-center">
              <p className="text-yellow-400 text-sm font-semibold">
                {match.lastBall}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex border-b border-white/10 mb-6">
          {[
            { id: "score", label: "Score" },
            { id: "leaderboard", label: "Leaderboard" },
            { id: "commentary", label: "Commentary" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "text-primary-400 border-primary-500"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Score Tab */}
        {activeTab === "score" && (
          <div className="space-y-3 pb-6">
            {match?.playerPoints?.map((p, i) => (
              <div
                key={i}
                className="card p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark-300 flex items-center justify-center text-white text-xs font-bold">
                    {p.name?.[0]}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{p.name}</p>
                    <p className="text-gray-500 text-xs">
                      {p.role} · {p.team}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-primary-400 font-black text-lg">
                    {p.points}
                  </p>
                  <p className="text-gray-500 text-xs">pts</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === "leaderboard" && (
          <div className="space-y-2 pb-6">
            {leaderboard.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                Leaderboard updating soon...
              </p>
            ) : (
              leaderboard.map((entry, i) => (
                <div
                  key={i}
                  className={`card p-4 flex items-center gap-4 ${entry.isMe ? "border-primary-500/50" : ""}`}
                >
                  <span className="text-lg font-bold w-8 text-center">
                    {getRankSuffix(i + 1)}
                  </span>
                  <div className="flex-1">
                    <p className="text-white font-semibold text-sm">
                      {entry.userName}{" "}
                      {entry.isMe && (
                        <span className="text-primary-400 text-xs">(You)</span>
                      )}
                    </p>
                    <p className="text-gray-500 text-xs">{entry.teamName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary-400 font-bold">
                      {entry.points} pts
                    </p>
                    {entry.prize && (
                      <p className="text-yellow-400 text-xs">₹{entry.prize}</p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Commentary Tab */}
        {activeTab === "commentary" && (
          <div className="space-y-3 pb-6">
            {commentary.length === 0 ? (
              <p className="text-gray-500 text-center py-10">
                Commentary will appear here during the match
              </p>
            ) : (
              commentary.map((c, i) => (
                <div key={i} className="card p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                        c.type === "WICKET"
                          ? "bg-red-500/20 text-red-400"
                          : c.type === "SIX"
                            ? "bg-purple-500/20 text-purple-400"
                            : c.type === "FOUR"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-dark-300 text-gray-400"
                      }`}
                    >
                      {c.ball}
                    </span>
                    <div>
                      <p className="text-white text-sm">{c.text}</p>
                      <p className="text-gray-600 text-xs mt-1">
                        {c.over} over
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatch;
