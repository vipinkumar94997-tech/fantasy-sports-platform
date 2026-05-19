import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

// ================= GET WALLET =================

export const getWallet = async (req, res) => {
  try {
    let wallet = await Wallet.findOne({
      where: { userId: req.user.id },
    });

    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user.id,
      });
    }

    res.json(wallet);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= ADD MONEY =================

export const addMoney = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const wallet = await Wallet.findOne({
      where: { userId: req.user.id },
    });

    wallet.balance += Number(amount);
    await wallet.save();

    // Transaction entry
    await Transaction.create({
      userId: req.user.id,
      type: "deposit",
      amount,
      status: "success",
      orderId,
      note: "Money added to wallet",
    });

    res.json({
      message: "Money added successfully",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= WITHDRAW MONEY =================

export const withdrawMoney = async (req, res) => {
  try {
    const { amount, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const wallet = await Wallet.findOne({
      where: { userId: req.user.id },
    });

    if (wallet.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    wallet.balance -= Number(amount);
    await wallet.save();

    await Transaction.create({
      userId: req.user.id,
      type: "withdrawal",
      amount,
      status: "pending",
      note: note || "Withdrawal request",
    });

    res.json({
      message: "Withdrawal request submitted",
      wallet,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ================= TRANSACTION HISTORY =================

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
