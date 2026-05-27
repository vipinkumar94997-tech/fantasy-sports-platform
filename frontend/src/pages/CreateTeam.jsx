import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { matchService } from "../services/matchService";
import { teamService } from "../services/teamService";
import PlayerCard from "../components/team/PlayerCard";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import toast from "react-hot-toast";
import { TEAM_RULES } from "../utils/constants";

const ROLES = ["ALL", "WK", "BAT", "AR", "BOWL"];

const CreateTeam = () => {
  const { id: matchId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [captainMode, setCaptainMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    matchService
      .getPlayers(matchId)
      .then((res) => setPlayers(res.data.players))
      .catch(() => toast.error("Failed to load players"))
      .finally(() => setLoading(false));
  }, [matchId]);

  const creditsUsed = selected.reduce((sum, p) => sum + p.credits, 0);
  const creditsLeft = TEAM_RULES.MAX_CREDITS - creditsUsed;

  const getRoleCount = (role) => selected.filter((p) => p.role === role).length;

  const canSelect = (player) => {
    if (selected.find((p) => p.id === player.id)) return true;
    if (selected.length >= TEAM_RULES.TOTAL_PLAYERS) return false;
    if (creditsLeft < player.credits) return false;
    const sameTeam = selected.filter((p) => p.team === player.team).length;
    if (sameTeam >= TEAM_RULES.MAX_FROM_ONE_TEAM) return false;
    const role = player.role;
    const count = getRoleCount(role);
    if (role === "WK" && count >= TEAM_RULES.MAX_WK) return false;
    if (role === "BAT" && count >= TEAM_RULES.MAX_BAT) return false;
    if (role === "AR" && count >= TEAM_RULES.MAX_AR) return false;
    if (role === "BOWL" && count >= TEAM_RULES.MAX_BOWL) return false;
    return true;
  };

  const togglePlayer = (player) => {
    if (selected.find((p) => p.id === player.id)) {
      setSelected(selected.filter((p) => p._id !== player._id));
      if (captain === player._id) setCaptain(null);
      if (viceCaptain === player._id) setViceCaptain(null);
    } else {
      if (!canSelect(player)) {
        toast.error("Cannot select this player");
        return;
      }
      setSelected([...selected, player]);
    }
  };

  const validateTeam = () => {
    if (selected.length !== TEAM_RULES.TOTAL_PLAYERS)
      return `Select exactly ${TEAM_RULES.TOTAL_PLAYERS} players`;
    if (getRoleCount("WK") < TEAM_RULES.MIN_WK)
      return `Min ${TEAM_RULES.MIN_WK} Wicket Keeper required`;
    if (getRoleCount("BAT") < TEAM_RULES.MIN_BAT)
      return `Min ${TEAM_RULES.MIN_BAT} Batsmen required`;
    if (getRoleCount("AR") < TEAM_RULES.MIN_AR)
      return `Min ${TEAM_RULES.MIN_AR} All Rounder required`;
    if (getRoleCount("BOWL") < TEAM_RULES.MIN_BOWL)
      return `Min ${TEAM_RULES.MIN_BOWL} Bowlers required`;
    if (!captain) return "Select a Captain";
    if (!viceCaptain) return "Select a Vice Captain";
    return null;
  };

  const handleSave = async () => {
    if (!captainMode) {
      setCaptainMode(true);
      return;
    }
    const err = validateTeam();
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      await teamService.create({
        matchId,
        players: selected.map((p) => p._id),
        captain,
        viceCaptain,
      });
      toast.success("Team saved! 🎉");
      navigate(`/match/${matchId}`);
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to save team");
    } finally {
      setSaving(false);
    }
  };

  const filtered = (players || []).filter(
    (p) => roleFilter === "ALL" || p.role === roleFilter,
  );
  // console.log("Players:", players);
  // console.log("Filtered:", filtered);

  if (loading)
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <Loader size="lg" text="Loading players..." />
      </div>
    );

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />

      {/* Top Bar */}
      <div className="sticky top-16 z-40 bg-dark-200 border-b border-white/10 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="grid grid-cols-4 gap-3 flex-1">
            {["WK", "BAT", "AR", "BOWL"].map((role) => (
              <div key={role} className="text-center">
                <p className="text-gray-500 text-xs">{role}</p>
                <p className="text-white font-bold text-sm">
                  {getRoleCount(role)}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs">Players</p>
            <p className="text-white font-bold">{selected.length}/11</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500 text-xs">Credits Left</p>
            <p
              className={`font-bold ${creditsLeft < 10 ? "text-red-400" : "text-primary-400"}`}
            >
              {creditsLeft.toFixed(1)}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {captainMode ? (
          <>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4 text-center">
              <p className="text-yellow-400 font-bold">
                Select Captain & Vice Captain
              </p>
              <p className="text-gray-400 text-sm mt-1">
                C gets 2x points · VC gets 1.5x points
              </p>
            </div>
            <div className="space-y-3">
              {selected.map((player) => (
                <PlayerCard
                  key={player._id}
                  player={player}
                  selected={true}
                  captain={captain === player._id}
                  viceCaptain={viceCaptain === player._id}
                  captainMode={true}
                  onSetCaptain={(id) => {
                    setCaptain(id);
                    if (viceCaptain === id) setViceCaptain(null);
                  }}
                  onSetViceCaptain={(id) => {
                    setViceCaptain(id);
                    if (captain === id) setCaptain(null);
                  }}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Role Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    roleFilter === r
                      ? "bg-primary-600 text-white"
                      : "bg-dark-200 text-gray-400 border border-white/10"
                  }`}
                >
                  {r} {r !== "ALL" && `(${getRoleCount(r)})`}
                </button>
              ))}
            </div>

            {/* Players List */}
            <div className="space-y-3">
              {filtered.map((player) => (
                <PlayerCard
                  key={player._id}
                  player={player}
                  selected={!!selected.find((p) => p.id === player.id)}
                  captain={captain === player._id}
                  viceCaptain={viceCaptain === player._id}
                  captainMode={false}
                  onSelect={togglePlayer}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-200 border-t border-white/10 p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          {captainMode && (
            <button
              onClick={() => setCaptainMode(false)}
              className="flex-shrink-0 border border-white/20 text-white px-4 py-3 rounded-xl text-sm font-semibold"
            >
              ← Back
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving || selected.length < 11}
            className="flex-1 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            {saving
              ? "Saving..."
              : captainMode
                ? "Save Team 🎉"
                : `Next: Pick C & VC (${selected.length}/11)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTeam;
