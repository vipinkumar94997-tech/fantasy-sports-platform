import { Link } from "react-router-dom";
import { GiCricketBat } from "react-icons/gi";
import { FiShield, FiZap, FiTrendingUp, FiUsers } from "react-icons/fi";

const Landing = () => {
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

  return (
    <div className="min-h-screen bg-dark-400">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 via-dark-400 to-dark-400" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GiCricketBat className="text-primary-500 text-5xl" />
            <h1 className="text-5xl md:text-7xl font-black text-white">
              Fantasy<span className="text-primary-500">11</span>
            </h1>
          </div>
          <p className="text-gray-300 text-xl md:text-2xl mb-4 font-medium">
            Indias #1 Fantasy Cricket & Football Platform
          </p>
          <p className="text-gray-500 text-base mb-10 max-w-xl mx-auto">
            Create your dream team, join contests and win real cash prizes every
            match day
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
            ✓ Free to join ✓ Instant withdrawals ✓ 24/7 Support
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-dark-200 py-10 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Daily Prize Pool", value: "₹10 Crore" },
            { label: "Registered Users", value: "50 Lakh+" },
            { label: "Matches Daily", value: "100+" },
            { label: "Winners Today", value: "2 Lakh+" },
          ].map((stat, i) => (
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

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-white font-black text-4xl mb-4">
          Ready to Win Big? 🏆
        </h2>
        <p className="text-gray-400 mb-8">
          Join 50 lakh+ players and start winning today
        </p>
        <Link
          to="/register"
          className="inline-block bg-primary-600 hover:bg-primary-500 text-white font-bold text-xl px-12 py-5 rounded-2xl transition-all hover:scale-105"
        >
          Create Free Account
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-dark-200 border-t border-white/10 py-8 px-4 text-center">
        <p className="text-gray-600 text-sm">
          © 2025 Fantasy11 · This game involves an element of financial risk.
          Play responsibly. 18+ only.
        </p>
        <div className="flex justify-center gap-6 mt-4">
          {["Terms", "Privacy", "Responsible Gaming", "Contact"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default Landing;
