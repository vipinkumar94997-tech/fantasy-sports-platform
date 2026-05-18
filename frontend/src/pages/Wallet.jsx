import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { walletService } from "../services/walletService";
import { useWallet } from "../hooks/useWallet";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import { formatCurrency, formatDate, calculateTDS } from "../utils/helpers";
import toast from "react-hot-toast";

const TABS = ["Add Money", "Withdraw", "Transactions"];

const Wallet = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") === "withdraw" ? "Withdraw" : "Add Money",
  );
  const { balance, bonusBalance, totalBalance, refresh } = useWallet();
  const [amount, setAmount] = useState("");
  const [upi, setUpi] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(true);

  const QUICK_AMOUNTS = [100, 500, 1000, 5000];

  useEffect(() => {
    walletService
      .getTransactions()
      .then((res) => setTransactions(res.data.transactions))
      .catch(() => {})
      .finally(() => setTxLoading(false));
  }, []);

  const handleAddMoney = async () => {
    if (!amount || amount < 10) {
      toast.error("Minimum ₹10 required");
      return;
    }
    setLoading(true);
    try {
      const orderRes = await walletService.addMoney({ amount: Number(amount) });
      const { orderId, razorpayKey } = orderRes.data;
      const options = {
        key: razorpayKey || import.meta.env.VITE_RAZORPAY_KEY,
        amount: amount * 100,
        currency: "INR",
        name: "Fantasy11",
        description: "Add Money to Wallet",
        order_id: orderId,
        handler: async (response) => {
          await walletService.verifyPayment(response);
          toast.success(`₹${amount} added to wallet!`);
          refresh();
          setAmount("");
        },
        prefill: { name: "User", email: "user@example.com" },
        theme: { color: "#16a34a" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || amount < 100) {
      toast.error("Minimum withdrawal ₹100");
      return;
    }
    if (amount > balance) {
      toast.error("Insufficient balance");
      return;
    }
    if (!upi) {
      toast.error("Please enter UPI ID");
      return;
    }
    setLoading(true);
    try {
      await walletService.withdraw({ amount: Number(amount), upiId: upi });
      toast.success("Withdrawal request submitted!");
      refresh();
      setAmount("");
      setUpi("");
    } catch (e) {
      toast.error(e.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const tds =
    amount && activeTab === "Withdraw" ? calculateTDS(Number(amount)) : 0;

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Balance Card */}
        <div className="card p-6 mb-6 bg-gradient-to-br from-primary-900/30 to-dark-200">
          <p className="text-gray-400 text-sm mb-1">Total Balance</p>
          <p className="text-white text-4xl font-black mb-4">
            {formatCurrency(totalBalance)}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-dark-300/50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Withdrawable</p>
              <p className="text-primary-400 font-bold text-lg">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="bg-dark-300/50 rounded-xl p-3">
              <p className="text-gray-500 text-xs mb-1">Bonus Cash</p>
              <p className="text-yellow-400 font-bold text-lg">
                {formatCurrency(bonusBalance)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-dark-200 rounded-xl p-1 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab
                  ? "bg-primary-600 text-white"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Add Money */}
        {activeTab === "Add Money" && (
          <div className="card p-6">
            <h3 className="text-white font-bold text-lg mb-5">Add Money</h3>

            <div className="grid grid-cols-4 gap-2 mb-5">
              {QUICK_AMOUNTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(String(a))}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-all ${
                    amount === String(a)
                      ? "bg-primary-600 border-primary-500 text-white"
                      : "border-white/10 text-gray-400 hover:border-white/20"
                  }`}
                >
                  ₹{a}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-gray-400 text-sm mb-2 block">
                Enter Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 pl-8 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 text-lg font-bold"
                />
              </div>
            </div>

            <button
              onClick={handleAddMoney}
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-lg"
            >
              {loading ? "Processing..." : `Add ₹${amount || 0} via Razorpay`}
            </button>
          </div>
        )}

        {/* Withdraw */}
        {activeTab === "Withdraw" && (
          <div className="card p-6">
            <h3 className="text-white font-bold text-lg mb-5">
              Withdraw Money
            </h3>

            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">Amount</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="Min ₹100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 pl-8 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-gray-400 text-sm mb-2 block">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>

            {tds > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
                <p className="text-yellow-400 text-sm font-semibold">
                  TDS Deduction Applicable
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  30% TDS of ₹{formatCurrency(tds)} will be deducted (winnings
                  above ₹10,000)
                </p>
                <p className="text-white text-sm font-bold mt-2">
                  You will receive: {formatCurrency(Number(amount) - tds)}
                </p>
              </div>
            )}

            <button
              onClick={handleWithdraw}
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-lg"
            >
              {loading ? "Processing..." : "Withdraw"}
            </button>
          </div>
        )}

        {/* Transactions */}
        {activeTab === "Transactions" && (
          <div className="card p-5">
            <h3 className="text-white font-bold text-lg mb-4">
              Transaction History
            </h3>
            {txLoading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No transactions yet
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="text-white text-sm font-semibold capitalize">
                        {tx.type.replace("_", " ")}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatDate(tx.createdAt)}
                      </p>
                    </div>
                    <p
                      className={`font-bold ${["deposit", "winning", "bonus", "refund"].includes(tx.type) ? "text-primary-400" : "text-red-400"}`}
                    >
                      {["deposit", "winning", "bonus", "refund"].includes(
                        tx.type,
                      )
                        ? "+"
                        : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
