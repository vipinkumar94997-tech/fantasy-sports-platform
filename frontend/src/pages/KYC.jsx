import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import toast from "react-hot-toast";

const KYC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    aadhaarNumber: "",
    aadhaarImage: "",
    panNumber: "",
    panImage: "",
  });

  useEffect(() => {
    api
      .get("/kyc/status")
      .then((res) => setStatus(res.data.kyc))
      .finally(() => setLoading(false));
  }, []);

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 512 * 512) {
      toast.error("Image size must be under 2MB");
      return;
    }
    const base64 = await toBase64(file);
    setForm({ ...form, [field]: base64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.aadhaarNumber || form.aadhaarNumber.length !== 12) {
      toast.error("Valid 12-digit Aadhaar number required");
      return;
    }
    if (!form.panNumber || form.panNumber.length !== 10) {
      toast.error("Valid 10-character PAN number required");
      return;
    }
    setSaving(true);
    try {
      await api.post("/kyc/submit", form);
      toast.success("KYC submitted successfully!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "KYC submission failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-dark-400">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-white font-black text-2xl mb-2">
          KYC Verification
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          Complete KYC to withdraw winnings
        </p>

        {/* Status Banner */}
        {status && (
          <div
            className={`p-4 rounded-xl mb-6 border ${
              status.status === "verified"
                ? "bg-primary-500/10 border-primary-500/30"
                : status.status === "pending"
                  ? "bg-yellow-500/10 border-yellow-500/30"
                  : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <p
              className={`font-bold ${
                status.status === "verified"
                  ? "text-primary-400"
                  : status.status === "pending"
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {status.status === "verified"
                ? "✓ KYC Verified"
                : status.status === "pending"
                  ? "⏳ KYC Under Review"
                  : `✗ KYC Rejected: ${status.rejectionReason}`}
            </p>
          </div>
        )}

        {status?.status !== "verified" && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Aadhaar */}
            <div className="card p-5">
              <h3 className="text-white font-bold mb-4">Aadhaar Card</h3>
              <div className="mb-3">
                <label className="text-gray-400 text-sm mb-1.5 block">
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  placeholder="12-digit Aadhaar number"
                  value={form.aadhaarNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      aadhaarNumber: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 12),
                    })
                  }
                  maxLength={12}
                  required
                  className="w-full bg-dark-300 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">
                  Aadhaar Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "aadhaarImage")}
                  className="w-full bg-dark-300 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none"
                />
                {form.aadhaarImage && (
                  <img
                    src={form.aadhaarImage}
                    alt="Aadhaar"
                    className="w-full h-32 object-cover rounded-xl mt-2 border border-white/10"
                  />
                )}
              </div>
            </div>

            {/* PAN */}
            <div className="card p-5">
              <h3 className="text-white font-bold mb-4">PAN Card</h3>
              <div className="mb-3">
                <label className="text-gray-400 text-sm mb-1.5 block">
                  PAN Number
                </label>
                <input
                  type="text"
                  placeholder="10-character PAN (e.g. ABCDE1234F)"
                  value={form.panNumber}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      panNumber: e.target.value.toUpperCase().slice(0, 10),
                    })
                  }
                  maxLength={10}
                  required
                  className="w-full bg-dark-300 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1.5 block">
                  PAN Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, "panImage")}
                  className="w-full bg-dark-300 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none"
                />
                {form.panImage && (
                  <img
                    src={form.panImage}
                    alt="PAN"
                    className="w-full h-32 object-cover rounded-xl mt-2 border border-white/10"
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors"
            >
              {saving ? "Submitting..." : "Submit KYC"}
            </button>

            <p className="text-gray-500 text-xs text-center">
              Your documents are encrypted and secure. Only used for
              verification.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default KYC;
