import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/common/Navbar";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReferEarn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.referralCode || "");
    toast.success("Referral code copied!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join Fantasy11",
        text: `Join Fantasy11 and win real cash! Use my referral code: ${user?.referralCode}`,
        url: window.location.origin,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="text-gray-400 hover:text-white"
          >
            ←
          </button>
          <h1 className="text-white font-black text-2xl">Refer & Earn</h1>
        </div>

        {/* Hero */}
        <div className="card p-6 mb-6 text-center bg-gradient-to-br from-primary-900/40 to-dark-200">
          <p className="text-6xl mb-4">🎁</p>
          <h2 className="text-white font-black text-2xl mb-2">
            Earn ₹50 Per Referral
          </h2>
          <p className="text-gray-400 text-sm">
            Invite friends and earn bonus cash for every successful referral
          </p>
        </div>

        {/* Referral Code */}
        <div className="card p-6 mb-6">
          <p className="text-gray-400 text-sm mb-3">Your Referral Code</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-dark-300 border border-primary-500/30 rounded-xl px-4 py-3">
              <p className="text-primary-400 font-black text-2xl tracking-widest text-center">
                {user?.referralCode || "N/A"}
              </p>
            </div>
            <button
              onClick={handleCopy}
              className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-3 rounded-xl font-semibold text-sm"
            >
              Copy
            </button>
          </div>
        </div>

        {/* How it works */}
        <div className="card p-6 mb-6">
          <h3 className="text-white font-bold mb-4">How it works?</h3>
          <div className="space-y-4">
            {[
              { step: "1", text: "Share your referral code with friends" },
              { step: "2", text: "Friend registers using your code" },
              { step: "3", text: "Friend adds money & plays first contest" },
              { step: "4", text: "You get ₹50 bonus in your wallet!" },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-black flex-shrink-0">
                  {item.step}
                </div>
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl text-lg"
        >
          📤 Share & Invite Friends
        </button>
      </div>
    </div>
  );
};

export default ReferEarn;
