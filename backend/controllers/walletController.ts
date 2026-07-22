import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Withdrawal from "../models/Withdrawal.js";
import crypto from "crypto";
import razorpay from "../config/razorpay.js";
import { requireEnv } from "../config/env.js";
import sequelize from "../config/db.js";

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

    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount < 100)
      return res.status(400).json({ message: "Minimum ₹100 required" });

    // Razorpay order create karo
    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100), // paise mein
      currency: "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id.toString(),
        purpose: "wallet_topup",
      },
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch {
    res
      .status(500)
      .json({ message: "Payment initiation failed" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment details required" });
    }

    // Signature verify karo
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", requireEnv("RAZORPAY_KEY_SECRET"))
      .update(sign)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSign, "utf8");
    const receivedBuffer = Buffer.from(String(razorpay_signature), "utf8");
    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.order_id !== razorpay_order_id || payment.status !== "captured") {
      return res.status(400).json({ message: "Payment is not captured" });
    }

    const order = await razorpay.orders.fetch(razorpay_order_id);
    const orderUserId = order.notes?.userId;
    if (
      String(orderUserId) !== String(req.user.id) ||
      Number(order.amount) !== Number(payment.amount) ||
      order.currency !== payment.currency
    ) {
      return res.status(400).json({ message: "Payment order mismatch" });
    }

    const amountInRupees = Number(payment.amount) / 100;
    const transaction = await sequelize.transaction();
    try {
    // Lock the wallet first so concurrent verification requests serialize.
    const wallet = await Wallet.findOne({
      where: { userId: req.user.id },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!wallet) {
      await transaction.rollback();
      return res.status(404).json({ message: "Wallet not found" });
    }

    const alreadyProcessed = await Transaction.findOne({
      where: { orderId: razorpay_payment_id, type: "deposit" },
      transaction,
    });
    if (alreadyProcessed) {
      await transaction.rollback();
      if (alreadyProcessed.userId !== req.user.id) {
        return res.status(400).json({ message: "Payment already processed" });
      }
      return res.json({
        message: "Payment successful!",
        balance: wallet.balance,
        amountAdded: alreadyProcessed.amount,
      });
    }

    wallet.balance += amountInRupees;
    await wallet.save({ transaction });

    // Transaction record banao
    await Transaction.create({
      userId: req.user.id,
      type: "deposit",
      amount: amountInRupees,
      status: "success",
      orderId: razorpay_payment_id,
      note: `Added via Razorpay — ${razorpay_payment_id}`,
    }, { transaction });

    await transaction.commit();

    res.json({
      message: "Payment successful!",
      balance: wallet.balance,
      amountAdded: amountInRupees,
    });
    } catch (error) {
      try {
        await transaction.rollback();
      } catch {
        // Transaction was already completed; preserve the original error.
      }
      throw error;
    }
  } catch {
    res.status(500).json({ message: "Payment verification failed" });
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
