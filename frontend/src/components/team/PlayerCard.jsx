const roleColors = {
  WK: "text-yellow-400 bg-yellow-400/10",
  BAT: "text-blue-400 bg-blue-400/10",
  AR: "text-purple-400 bg-purple-400/10",
  BOWL: "text-red-400 bg-red-400/10",
};

const PlayerCard = ({
  player,
  selected,
  onSelect,
  captain,
  viceCaptain,
  onSetCaptain,
  onSetViceCaptain,
  captainMode,
}) => {
  const { id, name, role, credits, team, image, points, selectionPercent } =
    player;

  return (
    <div
      onClick={() => !captainMode && onSelect(player)}
      className={`relative p-3 rounded-xl border transition-all cursor-pointer ${
        selected
          ? "border-primary-500 bg-primary-500/10"
          : "border-white/10 bg-dark-200 hover:border-white/20"
      }`}
    >
      {/* Captain / VC badges */}
      {captain && (
        <span className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 text-black text-xs font-black rounded-full flex items-center justify-center">
          C
        </span>
      )}
      {viceCaptain && (
        <span className="absolute top-2 right-2 w-6 h-6 bg-gray-400 text-black text-xs font-black rounded-full flex items-center justify-center">
          VC
        </span>
      )}

      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-dark-300 border border-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-sm font-bold">{name?.[0]}</span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-xs px-1.5 py-0.5 rounded font-semibold ${roleColors[role]}`}
            >
              {role}
            </span>
            <span className="text-gray-500 text-xs">{team}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold text-sm">{credits} cr</p>
          <p className="text-gray-500 text-xs">{selectionPercent}% sel</p>
        </div>
      </div>

      {/* Captain mode buttons */}
      {captainMode && selected && (
        <div className="flex gap-2 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetCaptain(id);
            }}
            className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-colors ${
              captain
                ? "bg-yellow-500 text-black border-yellow-500"
                : "border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
            }`}
          >
            Captain (2x)
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSetViceCaptain(id);
            }}
            className={`flex-1 py-1 text-xs font-bold rounded-lg border transition-colors ${
              viceCaptain
                ? "bg-gray-400 text-black border-gray-400"
                : "border-gray-400/50 text-gray-400 hover:bg-gray-400/10"
            }`}
          >
            Vice Cap (1.5x)
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
