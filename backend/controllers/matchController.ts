import Match from "../models/Match.js";
import Player from "../models/Player.js";
import Contest from "../models/Contest.js";
import { Op } from "sequelize";

const withContestCount = (
  match,
  contestCounts: ReadonlyMap<number, number>,
) => ({
  ...match.toJSON(),
  totalContests: contestCounts.get(Number(match.id)) ?? 0,
});

// ================= GET ALL MATCHES =================

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      order: [["matchTime", "ASC"]],
    });

    const matchIds = matches.map((match) => Number(match.id));
    const groupedCounts =
      matchIds.length === 0
        ? []
        : await Contest.count({
            where: { matchId: { [Op.in]: matchIds } },
            group: ["matchId"],
          });
    const contestCounts = new Map(
      groupedCounts.map((row) => [
        Number(row.matchId),
        Number(row.count),
      ]),
    );

    res.json(matches.map((match) => withContestCount(match, contestCounts)));
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET SINGLE MATCH =================

export const getMatchById = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    const totalContests = await Contest.count({
      where: { matchId: match.id },
    });

    res.json({
      ...match.toJSON(),
      totalContests,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= GET MATCH PLAYERS =================

export const getMatchPlayers = async (req, res) => {
  try {
    const players = await Player.findAll({
      where: {
        matchId: req.params.id,
      },
    });

    res.json(players);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= CREATE MATCH =================

export const createMatch = async (req, res) => {
  try {
    const match = await Match.create(req.body);

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= UPDATE MATCH =================

export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    await match.update(req.body);

    res.json(match);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= DELETE MATCH =================

export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);

    if (!match) {
      return res.status(404).json({
        message: "Match not found",
      });
    }

    await match.destroy();

    res.json({
      message: "Match deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
