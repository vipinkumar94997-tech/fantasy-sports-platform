import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const ResponsibleGaming = () => {
  const navigate = useNavigate();

  const tips = [
    {
      icon: "💰",
      title: "Set a Budget",
      desc: "Only play with money you can afford to lose. Set a monthly budget and stick to it.",
    },
    {
      icon: "⏰",
      title: "Time Management",
      desc: "Limit the time you spend on fantasy gaming. Take regular breaks.",
    },
    {
      icon: "🧠",
      title: "Play with Knowledge",
      desc: "Fantasy gaming is a game of skill. Research players and teams before creating your team.",
    },
    {
      icon: "🚫",
      title: "Avoid Chasing Losses",
      desc: "Never try to recover losses by playing more. Accept losses as part of the game.",
    },
    {
      icon: "👨‍👩‍👧",
      title: "Keep Family First",
      desc: "Never let gaming affect your family, work, or personal relationships.",
    },
    {
      icon: "🔞",
      title: "18+ Only",
      desc: "Fantasy gaming is strictly for adults above 18 years of age.",
    },
  ];

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white"
          >
            ←
          </button>
          <h1 className="text-white font-black text-2xl">Responsible Gaming</h1>
        </div>

        {/* Hero */}
        <div className="card p-6 mb-6 bg-gradient-to-br from-primary-900/30 to-dark-200 text-center">
          <p className="text-5xl mb-3">🎮</p>
          <h2 className="text-white font-bold text-xl mb-2">
            Play Responsibly
          </h2>
          <p className="text-gray-400 text-sm">
            Fantasy11 promotes responsible gaming. Play for fun, not as a source
            of income.
          </p>
        </div>

        {/* Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {tips.map((tip, i) => (
            <div key={i} className="card p-5">
              <div className="text-3xl mb-3">{tip.icon}</div>
              <h3 className="text-white font-bold mb-2">{tip.title}</h3>
              <p className="text-gray-400 text-sm">{tip.desc}</p>
            </div>
          ))}
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-6">
          <h3 className="text-yellow-400 font-bold mb-2">
            ⚠️ Problem Gaming Warning Signs
          </h3>
          <ul className="space-y-2">
            {[
              "Playing with money you cannot afford to lose",
              "Neglecting work, family, or health",
              "Feeling anxious or irritable when not playing",
              "Borrowing money to play fantasy games",
              "Lying about the amount of time or money spent",
            ].map((sign, i) => (
              <li
                key={i}
                className="text-gray-400 text-sm flex items-start gap-2"
              >
                <span className="text-yellow-400 mt-0.5">•</span>
                {sign}
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div className="card p-5 text-center">
          <h3 className="text-white font-bold mb-2">Need Help?</h3>
          <p className="text-gray-400 text-sm mb-4">
            If you think you have a gaming problem, please seek help
            immediately.
          </p>
          <div className="space-y-2">
            <p className="text-primary-400 text-sm font-semibold">
              📞 Helpline: 1800-XXX-XXXX
            </p>
            <p className="text-primary-400 text-sm font-semibold">
              📧 help@fantasy11.com
            </p>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl"
          >
            Self Exclude Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResponsibleGaming;
