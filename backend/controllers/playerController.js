import Player from "../models/Player.js";

export const getPlayersByMatch = async (req, res) => {
  try {
    const matchId = Number(req.params.matchId);

    console.log("MATCH ID:", matchId);

    const players = await Player.findAll({
      where: {
        matchId: matchId,
      },
    });

    console.log("PLAYERS:", players);

    res.status(200).json(players);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch players",
    });
  }
};
