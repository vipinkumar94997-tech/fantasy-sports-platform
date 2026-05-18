import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { contestService } from "../services/contestService";
import { teamService } from "../services/teamService";
import { walletService } from "../services/walletService";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { formatCurrency } from "../utils/helpers";
import toast from "react-hot-toast";

const ContestDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const matchId = location.state?.matchId;
  const [contest, setContest] = useState(null);
  const [myTeams, setMyTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    Promise.all([
      contestService.getById(id),
      matchId
        ? teamService.getMyTeams(matchId)
        : Promise.resolve({ data: { teams: [] } }),
    ])
      .then(([cRes, tRes]) => {
        setContest(cRes.data.contest);
        setMyTeams(tRes.data.teams);
      })
      .catch(() => toast.error("Failed to load contest"))
      .finally(() => setLoading(false));
  }, [id, matchId]);

  const handleJoin = async () => {
    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }
    setJoining(true);
    try {
      if (contest.entryFee > 0) {
        const walletRes = await walletService.getBalance();
        if (walletRes.data.balance < contest.entryFee) {
          toast.error("Insufficient balance. Please add money.");
          navigate("/wallet");
          return;
        }
      }
      await contestService.join({ contestId: id, teamId: selectedTeam });
      toast.success("Contest joined successfully! 🎉");
      navigate(`/live/${matchId}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to join contest");
    } finally {
      setJoining(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );

  if (!contest) return null;

  const fillPercent = Math.round(
    (contest.filledSpots / contest.totalSpots) * 100,
  );

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6 pb-28">
        {/* Contest Info */}
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-white font-bold text-xl">{contest.name}</h1>
              {contest.isGuaranteed && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30 mt-1 inline-block">
                  ✓ Guaranteed Prize Pool
                </span>
              )}
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-xs">Prize Pool</p>
              <p className="text-primary-400 font-black text-2xl">
                {formatCurrency(contest.prizePool)}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <div className="w-full bg-dark-300 rounded-full h-2 mb-2">
              <div
                className="bg-primary-500 h-2 rounded-full"
                style={{ width: `${fillPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>{contest.filledSpots} Teams Joined</span>
              <span>{contest.totalSpots - contest.filledSpots} Spots Left</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Entry</p>
              <p className="text-white font-bold">
                {contest.entryFee === 0 ? (
                  <span className="text-primary-400">FREE</span>
                ) : (
                  formatCurrency(contest.entryFee)
                )}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">1st Prize</p>
              <p className="text-white font-bold">
                {formatCurrency(contest.firstPrize)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs mb-1">Winners</p>
              <p className="text-white font-bold">{contest.totalWinners}</p>
            </div>
          </div>
        </div>

        {/* Prize Breakup */}
        <div className="card p-5 mb-6">
          <h3 className="text-white font-bold mb-4">Prize Breakup</h3>
          <div className="space-y-3">
            {contest.prizeBreakup?.map((prize, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-gray-400 text-sm">
                  Rank #{prize.rank}
                </span>
                <span className="text-primary-400 font-semibold">
                  {formatCurrency(prize.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Select Team */}
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold">Select Team</h3>
            {matchId && (
              <button
                onClick={() => navigate(`/match/${matchId}/create-team`)}
                className="text-primary-400 text-sm font-semibold hover:text-primary-300"
              >
                + Create New
              </button>
            )}
          </div>

          {myTeams.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-3">No teams created yet</p>
              <button
                onClick={() => navigate(`/match/${matchId}/create-team`)}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-semibold"
              >
                Create Team
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myTeams.map((team) => (
                <div
                  key={team._id}
                  onClick={() => setSelectedTeam(team._id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedTeam === team._id
                      ? "border-primary-500 bg-primary-500/10"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">
                        {team.name || `Team ${team.teamNumber}`}
                      </p>
                      <p className="text-gray-400 text-xs mt-0.5">
                        C: {team.captainName} · VC: {team.viceCaptainName}
                      </p>
                    </div>
                    {selectedTeam === team._id && (
                      <span className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Join Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-200 border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleJoin}
            disabled={joining || !selectedTeam}
            className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            {joining
              ? "Joining..."
              : `Join Contest · ${contest.entryFee === 0 ? "FREE" : formatCurrency(contest.entryFee)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContestDetail;
