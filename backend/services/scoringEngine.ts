export const CRICKET_POINTS = {
  RUN: 1,
  BOUNDARY: 1,
  SIX: 2,
  WICKET: 25,
  MAIDEN: 8,
  CATCH: 8,
  DUCK: -2,
  FIFTY_BONUS: 8,
  HUNDRED_BONUS: 16,
  THREE_WICKET_BONUS: 4,
  FIVE_WICKET_BONUS: 16,
  CAPTAIN_MULTIPLIER: 2,
  VC_MULTIPLIER: 1.5,
};

export const calculatePlayerPoints = (stats, role) => {
  let points = 0;

  // Batting
  if (stats.runs) {
    points += stats.runs * CRICKET_POINTS.RUN;
    points += (stats.fours || 0) * CRICKET_POINTS.BOUNDARY;
    points += (stats.sixes || 0) * CRICKET_POINTS.SIX;
    if (stats.runs >= 100) points += CRICKET_POINTS.HUNDRED_BONUS;
    else if (stats.runs >= 50) points += CRICKET_POINTS.FIFTY_BONUS;
    if (stats.runs === 0 && stats.ballsFaced > 0) points += CRICKET_POINTS.DUCK;
  }

  // Bowling
  if (stats.wickets) {
    points += stats.wickets * CRICKET_POINTS.WICKET;
    if (stats.wickets >= 5) points += CRICKET_POINTS.FIVE_WICKET_BONUS;
    else if (stats.wickets >= 3) points += CRICKET_POINTS.THREE_WICKET_BONUS;
    points += (stats.maidens || 0) * CRICKET_POINTS.MAIDEN;
  }

  // Fielding
  points += (stats.catches || 0) * CRICKET_POINTS.CATCH;
  points += (stats.stumpings || 0) * CRICKET_POINTS.CATCH;
  points += (stats.runouts || 0) * 6;

  return Math.max(0, points);
};

export const applyMultipliers = (points, isCaptain, isViceCaptain) => {
  if (isCaptain) return points * CRICKET_POINTS.CAPTAIN_MULTIPLIER;
  if (isViceCaptain) return points * CRICKET_POINTS.VC_MULTIPLIER;
  return points;
};

export const calculateTeamPoints = (players, captainId, viceCaptainId) => {
  return players.reduce((total, player) => {
    const base = calculatePlayerPoints(player.stats || {}, player.role);
    return (
      total +
      applyMultipliers(
        base,
        player.id === captainId,
        player.id === viceCaptainId,
      )
    );
  }, 0);
};
