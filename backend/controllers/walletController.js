import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Withdrawal from "../models/Withdrawal.js";

export const getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ where: { userId: req.user.id } });
    res.json({
      balance: wallet?.balance || 0,
      bonusBalance: wallet?.bonusBalance || 0,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount < 10)
      return res.status(400).json({ message: "Minimum ₹10 required" });

    const wallet = await Wallet.findOne({ where: { userId: req.user.id } });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    wallet.balance += parseFloat(amount);
    await wallet.save();

    await Transaction.create({
      userId: req.user.id,
      type: "deposit",
      amount: parseFloat(amount),
      status: "success",
      note: "Added via wallet",
    });

    res.json({ message: "Money added", balance: wallet.balance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const withdrawMoney = async (req, res) => {
  try {
    const { amount, upiId } = req.body;

    if (!amount || amount < 100)
      return res.status(400).json({ message: "Minimum withdrawal ₹100" });

    if (!upiId) return res.status(400).json({ message: "UPI ID required" });

    const wallet = await Wallet.findOne({ where: { userId: req.user.id } });
    if (!wallet || wallet.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    const tdsAmount = amount > 10000 ? amount * 0.3 : 0;

    wallet.balance -= parseFloat(amount);
    await wallet.save();

    await Withdrawal.create({
      userId: req.user.id,
      amount: parseFloat(amount),
      upiId,
      tdsAmount,
      status: "pending",
    });

    await Transaction.create({
      userId: req.user.id,
      type: "withdrawal",
      amount: parseFloat(amount),
      status: "pending",
      note: `Withdrawal to ${upiId}`,
    });

    res.json({ message: "Withdrawal request submitted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      limit: 50,
    });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { amount } = req.body;
    const wallet = await Wallet.findOne({ where: { userId: req.user.id } });
    if (wallet) {
      wallet.balance += parseFloat(amount || 0);
      await wallet.save();
      await Transaction.create({
        userId: req.user.id,
        type: "deposit",
        amount: parseFloat(amount),
        status: "success",
        note: "Payment verified",
      });
    }
    res.json({ message: "Payment verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
