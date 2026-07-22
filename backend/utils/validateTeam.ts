export const TEAM_RULES = {
  TOTAL_PLAYERS: 11,
  MAX_CREDITS: 100,
  MAX_FROM_ONE_TEAM: 7,
  MIN_WK: 1,
  MAX_WK: 4,
  MIN_BAT: 3,
  MAX_BAT: 6,
  MIN_AR: 1,
  MAX_AR: 4,
  MIN_BOWL: 3,
  MAX_BOWL: 6,
};

interface TeamSelectionPlayer {
  credits: number;
  role: "WK" | "BAT" | "AR" | "BOWL";
  team: string;
}

export const validateTeam = (players: TeamSelectionPlayer[]) => {
  if (players.length !== TEAM_RULES.TOTAL_PLAYERS)
    return `Select exactly ${TEAM_RULES.TOTAL_PLAYERS} players`;

  const totalCredits = players.reduce((sum, p) => sum + p.credits, 0);
  if (totalCredits > TEAM_RULES.MAX_CREDITS)
    return `Credits exceeded: ${totalCredits}/${TEAM_RULES.MAX_CREDITS}`;

  const wk = players.filter((p) => p.role === "WK").length;
  const bat = players.filter((p) => p.role === "BAT").length;
  const ar = players.filter((p) => p.role === "AR").length;
  const bowl = players.filter((p) => p.role === "BOWL").length;

  if (wk < TEAM_RULES.MIN_WK || wk > TEAM_RULES.MAX_WK)
    return `WK: ${TEAM_RULES.MIN_WK}-${TEAM_RULES.MAX_WK} required`;
  if (bat < TEAM_RULES.MIN_BAT || bat > TEAM_RULES.MAX_BAT)
    return `BAT: ${TEAM_RULES.MIN_BAT}-${TEAM_RULES.MAX_BAT} required`;
  if (ar < TEAM_RULES.MIN_AR || ar > TEAM_RULES.MAX_AR)
    return `AR: ${TEAM_RULES.MIN_AR}-${TEAM_RULES.MAX_AR} required`;
  if (bowl < TEAM_RULES.MIN_BOWL || bowl > TEAM_RULES.MAX_BOWL)
    return `BOWL: ${TEAM_RULES.MIN_BOWL}-${TEAM_RULES.MAX_BOWL} required`;

  const teamGroups: Record<string, number> = {};
  players.forEach((p) => {
    teamGroups[p.team] = (teamGroups[p.team] || 0) + 1;
  });
  for (const [team, count] of Object.entries(teamGroups)) {
    if (count > TEAM_RULES.MAX_FROM_ONE_TEAM)
      return `Max ${TEAM_RULES.MAX_FROM_ONE_TEAM} players from ${team}`;
  }

  return null;
};
