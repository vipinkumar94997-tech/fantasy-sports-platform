import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GiCricketBat } from "react-icons/gi";
import { FiShield, FiZap, FiTrendingUp, FiUsers } from "react-icons/fi";
import api from "../services/api";

const Landing = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMatches: 0,
    totalContests: 0,
    totalWinners: 0,
    dailyPrizePool: "₹10 Crore",
  });

  useEffect(() => {
    api
      .get("/auth/public-stats")
      .then((res) => setStats(res.data))
      .catch(() => {});
  }, []);

  const formatNumber = (num) => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr+`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L+`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K+`;
    return num?.toString() || "0";
  };

  const features = [
    {
      icon: <FiZap className="text-2xl text-yellow-400" />,
      title: "Real-Time Scoring",
      desc: "Live fantasy points updated ball by ball",
    },
    {
      icon: <FiShield className="text-2xl text-blue-400" />,
      title: "100% Secure",
      desc: "RBI compliant payments & data encryption",
    },
    {
      icon: <FiTrendingUp className="text-2xl text-primary-400" />,
      title: "Big Winnings",
      desc: "Win crores every day across all contests",
    },
    {
      icon: <FiUsers className="text-2xl text-purple-400" />,
      title: "50L+ Players",
      desc: "Indias fastest growing fantasy platform",
    },
  ];

  const liveStats = [
    { label: "Daily Prize Pool", value: stats.dailyPrizePool },
    { label: "Registered Users", value: formatNumber(stats.totalUsers) },
    {
      label: "Matches Daily",
      value: stats.totalMatches > 0 ? `${stats.totalMatches}+` : "100+",
    },
    {
      label: "Winners Today",
      value:
        stats.totalWinners > 0 ? formatNumber(stats.totalWinners) : "2 Lakh+",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-400">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-dark-200 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <GiCricketBat className="text-primary-500 text-2xl" />
            <span className="text-white font-bold text-xl">
              fantasy<span className="text-primary-500">11</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Register Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-400 to-dark-400" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
            <span className="text-primary-400 text-sm font-semibold">
              India's #1 Fantasy Sports Platform
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <GiCricketBat className="text-primary-500 text-5xl md:text-7xl" />
            <h1 className="text-5xl md:text-7xl font-black text-white">
              Fantasy<span className="text-primary-500">11</span>
            </h1>
          </div>
          <p className="text-gray-300 text-xl md:text-2xl mb-4 font-medium">
            Create Your Dream Team & Win Real Cash
          </p>
          <p className="text-gray-500 text-base mb-10 max-w-xl mx-auto">
            Pick players, join contests and win crores every match day
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-primary-600 hover:bg-primary-500 text-white font-bold text-lg px-10 py-4 rounded-xl transition-all hover:scale-105"
            >
              Start Playing Free 🏏
            </Link>
            <Link
              to="/login"
              className="border border-white/20 hover:border-primary-500 text-white font-semibold text-lg px-10 py-4 rounded-xl transition-all"
            >
              Login
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-6">
            ✓ Free to join &nbsp; ✓ Instant withdrawals &nbsp; ✓ 24/7 Support
          </p>
        </div>
      </div>

      {/* Live Stats */}
      <div className="bg-dark-200 py-10 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {liveStats.map((stat, i) => (
            <div key={i}>
              <p className="text-primary-400 font-black text-3xl mb-1">
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-white font-black text-3xl text-center mb-12">
          Why Choose <span className="text-primary-500">Fantasy11?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="card p-6 text-center hover:border-primary-500/30 transition-all"
            >
              <div className="flex justify-center mb-4">{f.icon}</div>
              <h3 className="text-white font-bold mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How to Play */}
      <div className="bg-dark-200 py-20 border-y border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-white font-black text-3xl text-center mb-12">
            How to Play?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Select a Match",
                desc: "Choose from upcoming cricket or football matches",
              },
              {
                step: "02",
                title: "Create Your Team",
                desc: "Pick 11 players within the 100 credit budget",
              },
              {
                step: "03",
                title: "Win Real Cash",
                desc: "Join contests and win based on player performance",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-400 font-black text-lg">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-white font-bold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Matches Preview */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-white font-black text-3xl text-center mb-4">
          Live & Upcoming Contests
        </h2>
        <p className="text-gray-500 text-center mb-12">
          Join now and start winning
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              sport: "🏏",
              title: "Mega Contest",
              prize: "₹1 Crore",
              entry: "₹49",
              spots: "1,00,000",
            },
            {
              sport: "🏏",
              title: "Small League",
              prize: "₹10,000",
              entry: "₹29",
              spots: "500",
            },
            {
              sport: "⚽",
              title: "Head to Head",
              prize: "₹180",
              entry: "₹99",
              spots: "100",
            },
          ].map((contest, i) => (
            <div
              key={i}
              className="card p-5 hover:border-primary-500/30 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{contest.sport}</span>
                <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                  {contest.title}
                </span>
              </div>
              <p className="text-gray-400 text-xs mb-1">Prize Pool</p>
              <p className="text-primary-400 font-black text-2xl mb-3">
                {contest.prize}
              </p>
              <div className="flex justify-between text-xs text-gray-500 mb-4">
                <span>Entry: {contest.entry}</span>
                <span>{contest.spots} spots</span>
              </div>
              <Link
                to="/register"
                className="block w-full bg-primary-600 hover:bg-primary-500 text-white text-center text-sm font-bold py-2.5 rounded-lg transition-colors"
              >
                Join Now
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-dark-200 border-y border-white/10 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-white font-black text-4xl mb-4">
            Ready to Win Big? 🏆
          </h2>
          <p className="text-gray-400 mb-8">
            Join {formatNumber(stats.totalUsers) || "50 lakh+"} players and
            start winning today
          </p>
          <Link
            to="/register"
            className="inline-block bg-primary-600 hover:bg-primary-500 text-white font-bold text-xl px-12 py-5 rounded-2xl transition-all hover:scale-105"
          >
            Create Free Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-200 border-t border-white/10 py-8 px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <GiCricketBat className="text-primary-500 text-xl" />
          <span className="text-white font-bold">
            Fantasy<span className="text-primary-500">11</span>
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          © 2025 Fantasy11 · This game involves an element of financial risk.
          Play responsibly. 18+ only.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          {[
            { label: "Terms", path: "/login/terms" },
            { label: "Privacy", path: "/login/privacy" },
            { label: "Responsible Gaming", path: "/login/responsible-gaming" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
