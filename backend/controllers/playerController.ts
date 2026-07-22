// import Player from "../models/Player.js";

// export const getPlayersByMatch = async (req, res) => {
//   try {
//     const matchId = Number(req.params.matchId);

//     console.log("MATCH ID:", matchId);

//     const players = await Player.findAll({
//       where: {
//         matchId: matchId,
//       },
//     });

//     console.log("PLAYERS:", players);

//     res.status(200).json(players);
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Failed to fetch players",
//     });
//   }
// };

import Player from "../models/Player.js";
import Match from "../models/Match.js";

export const getPlayersByMatch = async (req, res) => {
  try {
    const matchId = Number(req.params.matchId);

    console.log("MATCH ID:", matchId);

    // 🔥 STEP 1: match fetch karo (to get sport)
    const match = await Match.findByPk(matchId);

    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    console.log("MATCH SPORT:", match.sport);

    // 🔥 STEP 2: sport ke basis pe players filter karo
    const players = await Player.findAll({
      where: {
        matchId: matchId,
        sport: match.sport, // ⭐ MAIN FIX
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
