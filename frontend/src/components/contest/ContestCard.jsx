import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/helpers";

const ContestCard = ({ contest, matchId }) => {
  const navigate = useNavigate();
  const {
    _id,
    name,
    type,
    entryFee,
    prizePool,
    totalSpots,
    filledSpots,
    firstPrize,
    isGuaranteed,
  } = contest;

  const fillPercent = Math.round((filledSpots / totalSpots) * 100);

  return (
    <div className="card p-4 hover:border-primary-500/30 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-sm">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            {isGuaranteed && (
              <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full border border-yellow-500/30">
                ✓ Guaranteed
              </span>
            )}
            <span className="text-xs text-gray-500">{type}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-xs">Prize Pool</p>
          <p className="text-primary-400 font-bold">
            {formatCurrency(prizePool)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-dark-300 rounded-full h-1.5 mb-1">
          <div
            className="bg-primary-500 h-1.5 rounded-full transition-all"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{filledSpots} joined</span>
          <span>{totalSpots - filledSpots} spots left</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10">
        <div>
          <p className="text-gray-400 text-xs">1st Prize</p>
          <p className="text-white font-bold text-sm">
            {formatCurrency(firstPrize)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-xs">Entry</p>
          <p className="text-white font-semibold text-sm">
            {entryFee === 0 ? (
              <span className="text-primary-400">FREE</span>
            ) : (
              formatCurrency(entryFee)
            )}
          </p>
        </div>
        <button
          onClick={() => navigate(`/contest/${_id}`, { state: { matchId } })}
          className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-5 py-2 rounded-lg transition-colors"
        >
          Join
        </button>
      </div>
    </div>
  );
};

export default ContestCard;
