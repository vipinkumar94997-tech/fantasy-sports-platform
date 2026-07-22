import { useAuth } from "../hooks/useAuth";
import { useWallet } from "../hooks/useWallet";
import Navbar from "../components/common/Navbar";
import { formatCurrency } from "../utils/helpers";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const { totalBalance } = useWallet();

  const menuItems = [
    { icon: "👤", label: "Edit Profile", path: "/profile/edit" },
    { icon: "📋", label: "KYC Verification", path: "/profile/kyc" },
    { icon: "🏆", label: "My Contests", path: "/my-contests" },
    { icon: "👥", label: "My Teams", path: "/my-teams" },
    { icon: "🎁", label: "Refer & Earn", path: "/profile/refer" },
    { icon: "📜", label: "Terms & Conditions", path: "/terms" },
    { icon: "🔒", label: "Privacy Policy", path: "/privacy" },
    { icon: "🎮", label: "Responsible Gaming", path: "/responsible-gaming" },
  ];

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="card p-6 mb-6 text-center">
          <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <h2 className="text-white font-black text-xl mb-1">{user?.name}</h2>
          <p className="text-gray-400 text-sm mb-1">{user?.email}</p>
          <p className="text-gray-500 text-sm mb-4">{user?.phone}</p>

          {user?.kycStatus === "verified" ? (
            <span className="inline-flex items-center gap-1 bg-primary-500/20 text-primary-400 text-xs px-3 py-1 rounded-full border border-primary-500/30">
              ✓ KYC Verified
            </span>
          ) : (
            <Link
              to="/profile/kyc"
              className="inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30"
            >
              ⚠ Complete KYC
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Wallet", value: formatCurrency(totalBalance) },
            { label: "Contests", value: user?.totalContests || 0 },
            {
              label: "Winnings",
              value: formatCurrency(user?.totalWinnings || 0),
            },
          ].map((stat, i) => (
            <div key={i} className="card p-4 text-center">
              <p className="text-primary-400 font-black text-lg">
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Referral */}
        {user?.referralCode && (
          <div className="card p-5 mb-6 bg-gradient-to-r from-primary-900/30 to-dark-200">
            <p className="text-gray-400 text-sm mb-2">Your Referral Code</p>
            <div className="flex items-center justify-between">
              <p className="text-primary-400 font-black text-2xl tracking-widest">
                {user.referralCode}
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.referralCode);
                }}
                className="bg-primary-600 text-white text-sm px-4 py-2 rounded-lg font-semibold"
              >
                Copy
              </button>
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Earn ₹50 for every friend who joins
            </p>
          </div>
        )}

        {/* Menu */}
        <div className="card overflow-hidden mb-6">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="flex items-center justify-between px-5 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-white text-sm font-medium">
                  {item.label}
                </span>
              </div>
              <span className="text-gray-600">›</span>
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="w-full border border-red-500/30 text-red-400 hover:bg-red-500/10 font-semibold py-4 rounded-xl transition-colors"
        >
          Logout
        </button>

        <p className="text-center text-gray-600 text-xs mt-6">
          Fantasy11 v1.0.0 · 18+ only · Play Responsibly
        </p>
      </div>
    </div>
  );
};

export default Profile;
