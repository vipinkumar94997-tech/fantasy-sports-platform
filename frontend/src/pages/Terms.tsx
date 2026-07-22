import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const Terms = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing and using Fantasy11, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.",
    },
    {
      title: "2. Eligibility",
      content:
        "You must be at least 18 years of age to use Fantasy11. Users from Assam, Odisha, Telangana, Andhra Pradesh, Nagaland, and Sikkim are not eligible to participate in paid contests as per Indian law.",
    },
    {
      title: "3. Fantasy Sports",
      content:
        "Fantasy11 is a game of skill. Users create virtual teams based on real players and earn points based on their actual performance in real matches.",
    },
    {
      title: "4. Payments & Withdrawals",
      content:
        "All deposits are processed through secure payment gateways. Withdrawals are subject to KYC verification. TDS of 30% is deducted on net winnings above ₹10,000 as per Indian tax laws.",
    },
    {
      title: "5. Fair Play",
      content:
        "Any attempt to manipulate results, use multiple accounts, or engage in fraudulent activity will result in immediate account termination and forfeiture of winnings.",
    },
    {
      title: "6. Privacy",
      content:
        "We collect and process your personal data as described in our Privacy Policy. By using our services, you consent to such processing.",
    },
    {
      title: "7. Limitation of Liability",
      content:
        "Fantasy11 shall not be liable for any indirect, incidental, or consequential damages arising from the use of our platform.",
    },
    {
      title: "8. Changes to Terms",
      content:
        "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.",
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
          <h1 className="text-white font-black text-2xl">Terms & Conditions</h1>
        </div>

        <div className="card p-6 mb-4">
          <p className="text-gray-400 text-sm">Last updated: May 2026</p>
        </div>

        <div className="space-y-4">
          {sections.map((section, i) => (
            <div key={i} className="card p-6">
              <h3 className="text-white font-bold mb-3">{section.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Terms;
