import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const Privacy = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Information We Collect",
      content:
        "We collect personal information including name, email, phone number, date of birth, and government ID for KYC verification. We also collect usage data and transaction history.",
    },
    {
      title: "2. How We Use Your Information",
      content:
        "Your information is used to provide our services, process transactions, verify identity, prevent fraud, and improve our platform. We do not sell your personal data to third parties.",
    },
    {
      title: "3. Data Security",
      content:
        "We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information.",
    },
    {
      title: "4. KYC Data",
      content:
        "Aadhaar and PAN card details are collected solely for identity verification and compliance with Indian financial regulations. This data is encrypted and stored securely.",
    },
    {
      title: "5. Cookies",
      content:
        "We use cookies to improve your experience on our platform. You can control cookie settings through your browser preferences.",
    },
    {
      title: "6. Third Party Services",
      content:
        "We use trusted third-party services for payment processing (Razorpay) and SMS verification (Twilio). These services have their own privacy policies.",
    },
    {
      title: "7. Your Rights",
      content:
        "You have the right to access, correct, or delete your personal data. Contact our support team to exercise these rights.",
    },
    {
      title: "8. Contact Us",
      content:
        "For privacy-related queries, contact us at privacy@fantasy11.com or through our support portal.",
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
          <h1 className="text-white font-black text-2xl">Privacy Policy</h1>
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

export default Privacy;
