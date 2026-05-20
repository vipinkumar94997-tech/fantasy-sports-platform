import { Link } from "react-router-dom";
import Badge from "../common/Badge";
import { timeUntilMatch } from "../../utils/helpers";

const MatchCard = ({ match }) => {
  const {
    id,
    sport,
    venue,
    matchTime,
    status,
    team1Name,
    team1ShortName,
    team1Logo,
    team2Name,
    team2ShortName,
    team2Logo,
    totalContests,
    totalPrize,
  } = match;

  const TeamAvatar = ({ logo, shortName }) => (
    <div className="w-12 h-12 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center overflow-hidden">
      {logo ? (
        <img
          src={logo}
          alt={shortName}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white font-bold text-sm">{shortName}</span>
      )}
    </div>
  );

  return (
    <Link to={`/match/${id}`}>
      <div className="card p-4 hover:border-primary-500/40 transition-all cursor-pointer group">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 uppercase">{sport}</span>
            <span className="text-gray-600">•</span>
            <span className="text-xs text-gray-500 truncate max-w-24">
              {venue}
            </span>
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
            <TeamAvatar logo={team1Logo} shortName={team1ShortName} />
            <span className="text-white font-semibold text-sm">
              {team1ShortName}
            </span>
          </div>
          <span className="text-gray-500 text-sm font-bold px-4">VS</span>
          <div className="flex flex-col items-center gap-2 flex-1">
            <TeamAvatar logo={team2Logo} shortName={team2ShortName} />
            <span className="text-white font-semibold text-sm">
              {team2ShortName}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Prize Pool</p>
            <p className="text-primary-400 font-bold text-sm">
              {totalPrize ? `₹${(totalPrize / 100000).toFixed(1)}L` : "Free"}
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Contests</p>
            <p className="text-white font-semibold text-sm">
              {totalContests || 0}
            </p>
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
