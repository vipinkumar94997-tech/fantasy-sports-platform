import ContestEntry from "../models/ContestEntry.js";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Contest from "../models/Contest.js";

export const distributeWinnings = async (contestId) => {
  try {
    const contest = await Contest.findByPk(contestId);
    if (!contest) throw new Error("Contest not found");

    const entries = await ContestEntry.findAll({
      where: { contestId },
      order: [["points", "DESC"]],
    });

    if (entries.length === 0) return;

    const breakup = contest.prizeBreakup || [];

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const rank = i + 1;
      const prize = breakup.find((b) => b.rank === rank);

      if (prize && prize.amount > 0) {
        await entry.update({ rank, winning: prize.amount });

        const wallet = await Wallet.findOne({
          where: { userId: entry.userId },
        });
        if (wallet) {
          wallet.balance += prize.amount;
          await wallet.save();

          await Transaction.create({
            userId: entry.userId,
            type: "winning",
            amount: prize.amount,
            status: "success",
            note: `Won from contest: ${contest.name} (Rank #${rank})`,
          });
        }
      } else {
        await entry.update({ rank });
      }
    }

    await contest.update({ status: "completed" });
    console.log(`Prizes distributed for contest: ${contestId}`);
  } catch (err) {
    console.error("Prize distribution error:", err.message);
  }
};

export const generatePrizeBreakup = (prizePool, totalWinners) => {
  const breakup = [];
  if (totalWinners === 1) {
    breakup.push({ rank: 1, amount: Math.floor(prizePool * 0.9) });
  } else if (totalWinners === 2) {
    breakup.push({ rank: 1, amount: Math.floor(prizePool * 0.6) });
    breakup.push({ rank: 2, amount: Math.floor(prizePool * 0.3) });
  } else {
    breakup.push({ rank: 1, amount: Math.floor(prizePool * 0.4) });
    breakup.push({ rank: 2, amount: Math.floor(prizePool * 0.2) });
    breakup.push({ rank: 3, amount: Math.floor(prizePool * 0.1) });
    const remaining = prizePool * 0.3;
    const perPerson = Math.floor(remaining / (totalWinners - 3));
    for (let i = 4; i <= totalWinners; i++) {
      breakup.push({ rank: i, amount: perPerson });
    }
  }
  return breakup;
};
