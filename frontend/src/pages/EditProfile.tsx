import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/common/Navbar";
import api from "../services/api";
import toast from "react-hot-toast";

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/auth/profile", form);
      toast.success("Profile updated!");
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setSaving(false);
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
          <h1 className="text-white font-black text-2xl">Edit Profile</h1>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-dark-300 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-dark-300 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">
                Phone
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                maxLength={10}
                className="w-full bg-dark-300 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
