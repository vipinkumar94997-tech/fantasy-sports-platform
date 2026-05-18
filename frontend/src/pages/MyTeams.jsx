import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import SkeletonCard from "../components/common/SkeletonCard";
import EmptyState from "../components/common/EmptyState";

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/teams/all")
      .then((res) => setTeams(res.data.teams))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <h1 className="text-white font-black text-2xl mb-6">My Teams 👥</h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : teams.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No teams yet"
            subtitle="Create a team for an upcoming match"
            action={{
              label: "Browse Matches",
              onClick: () => navigate("/home"),
            }}
          />
        ) : (
          <div className="space-y-4">
            {teams.map((team, i) => (
              <div key={team._id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold">
                      {team.name || `Team ${i + 1}`}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {team.match?.team1?.shortName} vs{" "}
                      {team.match?.team2?.shortName}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      team.match?.status === "live"
                        ? "bg-red-500/20 text-red-400"
                        : team.match?.status === "upcoming"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {team.match?.status?.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {team.players?.slice(0, 6).map((p) => (
                    <span
                      key={p._id}
                      className="text-xs bg-dark-300 px-2 py-1 rounded-lg text-gray-300"
                    >
                      {p.name?.split(" ").pop()}
                    </span>
                  ))}
                  {team.players?.length > 6 && (
                    <span className="text-xs text-gray-500">
                      +{team.players.length - 6} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-gray-500 text-xs">Captain</p>
                      <p className="text-yellow-400 text-sm font-semibold">
                        {team.captainName}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Vice Captain</p>
                      <p className="text-gray-300 text-sm font-semibold">
                        {team.viceCaptainName}
                      </p>
                    </div>
                  </div>
                  {team.match?.status === "upcoming" && (
                    <button
                      onClick={() => navigate(`/teams/${team._id}/edit`)}
                      className="text-primary-400 text-sm font-semibold hover:text-primary-300"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeams;
