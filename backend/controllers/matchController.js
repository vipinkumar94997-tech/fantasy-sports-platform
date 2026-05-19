import Match from "../models/Match.js";
import Player from "../models/Player.js";

// ================= GET ALL MATCHES =================

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.findAll({
      order: [["matchTime", "ASC"]],
    });

    res.json(matches);
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

    res.json(match);
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
