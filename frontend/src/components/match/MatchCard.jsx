import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { timeUntilMatch } from "../../utils/helpers";

const MatchCard = ({ match }) => {
  const {
    _id,
    team1,
    team2,
    matchTime,
    status,
    sport,
    venue,
    totalContests,
    totalPrize,
  } = match;

  return (
    <Link to={`/match/${_id}`}>
      <div className="card p-4 hover:border-primary-500/40 transition-all cursor-pointer group">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {sport}
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-500">{venue}</span>
          </div>
          <Badge
            label={
              status === "live"
                ? "LIVE"
                : status === "upcoming"
                  ? timeUntilMatch(matchTime)
                  : "Done"
            }
            variant={
              status === "live"
                ? "live"
                : status === "upcoming"
                  ? "upcoming"
                  : "completed"
            }
            pulse={status === "live"}
          />
        </div>

        {/* Teams */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center overflow-hidden">
              {team1.logo ? (
                <img
                  src={team1.logo}
                  alt={team1.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {team1.shortName}
                </span>
              )}
            </div>
            <span className="text-white font-semibold text-sm">
              {team1.shortName}
            </span>
          </div>

          <div className="flex flex-col items-center px-4">
            <span className="text-gray-500 text-xs">VS</span>
            {status === "live" && (
              <div className="mt-1 text-center">
                <p className="text-white text-xs font-bold">{team1.score}</p>
                <p className="text-white text-xs font-bold">{team2.score}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-12 h-12 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center overflow-hidden">
              {team2.logo ? (
                <img
                  src={team2.logo}
                  alt={team2.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {team2.shortName}
                </span>
              )}
            </div>
            <span className="text-white font-semibold text-sm">
              {team2.shortName}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Prize Pool</p>
            <p className="text-primary-400 font-bold text-sm">
              ₹{(totalPrize / 100000).toFixed(1)}L
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Contests</p>
            <p className="text-white font-semibold text-sm">{totalContests}</p>
          </div>
          <button className="bg-primary-600 group-hover:bg-primary-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors">
            Play Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
