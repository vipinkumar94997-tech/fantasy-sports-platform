import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Withdrawal from "../models/Withdrawal.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

    if (!amount || amount < 100)
      return res.status(400).json({ message: "Minimum ₹100 required" });

    // Razorpay order create karo
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100), // paise mein
      currency: "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id.toString(),
        purpose: "wallet_topup",
      },
    });

    console.log("Razorpay order created:", order.id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("Add money error:", err);
    res
      .status(500)
      .json({ message: "Payment initiation failed: " + err.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
    } = req.body;

    console.log("Verifying payment:", razorpay_payment_id);

    // Signature verify karo
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      console.error("Signature mismatch!");
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Wallet update karo
    const wallet = await Wallet.findOne({ where: { userId: req.user.id } });
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    const amountInRupees = parseFloat(amount) / 100;
    wallet.balance += amountInRupees;
    await wallet.save();

    // Transaction record banao
    await Transaction.create({
      userId: req.user.id,
      type: "deposit",
      amount: amountInRupees,
      status: "success",
      orderId: razorpay_payment_id,
      note: `Added via Razorpay — ${razorpay_payment_id}`,
    });

    console.log(`Wallet updated: +₹${amountInRupees} for user ${req.user.id}`);

    res.json({
      message: "Payment successful!",
      balance: wallet.balance,
      amountAdded: amountInRupees,
    });
  } catch (err) {
    console.error("Verify payment error:", err);
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
