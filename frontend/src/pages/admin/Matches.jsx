import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/helpers";

const SPORTS = ["Cricket", "Football"];
const STATUS = ["upcoming", "live", "completed"];

const emptyForm = {
  sport: "Cricket",
  venue: "",
  matchTime: "",
  team1Name: "",
  team1ShortName: "",
  team1Logo: "",
  team2Name: "",
  team2ShortName: "",
  team2Logo: "",
};

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchMatches = () => {
    api
      .get("/admin/matches")
      .then((res) => setMatches(res.data.matches || []))
      .catch(() => toast.error("Failed to load matches"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/admin/matches/add", form);
      toast.success("Match added!");
      setShowForm(false);
      setForm(emptyForm);
      fetchMatches();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add match");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/matches/${id}`, { status });
      toast.success("Status updated!");
      fetchMatches();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this match?")) return;
    try {
      await api.delete(`/admin/matches/${id}`);
      toast.success("Match deleted");
      fetchMatches();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = matches.filter(
    (m) => filter === "all" || m.status === filter,
  );

  return (
    <div className="min-h-screen bg-dark-400">
      <div className="bg-dark-200 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-400 hover:text-white text-sm">
            ← Dashboard
          </Link>
          <h1 className="text-white font-black text-xl">Manage Matches</h1>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
        >
          + Add Match
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["all", "upcoming", "live", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-dark-200 text-gray-400 border border-white/10"
              }`}
            >
              {f === "live" ? "🔴 Live" : f}
            </button>
          ))}
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-dark-200 border border-white/10 rounded-2xl p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">Add New Match</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">
                      Sport
                    </label>
                    <select
                      value={form.sport}
                      onChange={(e) =>
                        setForm({ ...form, sport: e.target.value })
                      }
                      className="w-full bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    >
                      {SPORTS.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs mb-1 block">
                      Match Time
                    </label>
                    <input
                      type="datetime-local"
                      value={form.matchTime}
                      onChange={(e) =>
                        setForm({ ...form, matchTime: e.target.value })
                      }
                      required
                      className="w-full bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-xs mb-1 block">
                    Venue
                  </label>
                  <input
                    type="text"
                    placeholder="Wankhede Stadium, Mumbai"
                    value={form.venue}
                    onChange={(e) =>
                      setForm({ ...form, venue: e.target.value })
                    }
                    required
                    className="w-full bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Team 1 */}
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs font-semibold mb-3 uppercase">
                    Team 1
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Full Name (India)"
                      value={form.team1Name}
                      onChange={(e) =>
                        setForm({ ...form, team1Name: e.target.value })
                      }
                      required
                      className="bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Short Name (IND)"
                      value={form.team1ShortName}
                      onChange={(e) =>
                        setForm({ ...form, team1ShortName: e.target.value })
                      }
                      required
                      className="bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Logo URL (https://...)"
                    value={form.team1Logo}
                    onChange={(e) =>
                      setForm({ ...form, team1Logo: e.target.value })
                    }
                    className="w-full bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                  {form.team1Logo && (
                    <img
                      src={form.team1Logo}
                      alt="logo"
                      className="w-10 h-10 rounded-full mt-2 object-cover border border-white/20"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>

                {/* Team 2 */}
                <div className="border border-white/10 rounded-xl p-4">
                  <p className="text-gray-400 text-xs font-semibold mb-3 uppercase">
                    Team 2
                  </p>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Full Name (Australia)"
                      value={form.team2Name}
                      onChange={(e) =>
                        setForm({ ...form, team2Name: e.target.value })
                      }
                      required
                      className="bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                    <input
                      type="text"
                      placeholder="Short Name (AUS)"
                      value={form.team2ShortName}
                      onChange={(e) =>
                        setForm({ ...form, team2ShortName: e.target.value })
                      }
                      required
                      className="bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Logo URL (https://...)"
                    value={form.team2Logo}
                    onChange={(e) =>
                      setForm({ ...form, team2Logo: e.target.value })
                    }
                    className="w-full bg-dark-300 border border-white/10 text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:border-primary-500"
                  />
                  {form.team2Logo && (
                    <img
                      src={form.team2Logo}
                      alt="logo"
                      className="w-10 h-10 rounded-full mt-2 object-cover border border-white/20"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-white/20 text-white py-3 rounded-xl text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Add Match"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {["Match", "Sport", "Time", "Status", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-gray-500 text-xs font-semibold uppercase px-5 py-4"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((match) => (
                    <tr
                      key={match.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {match.team1Logo && (
                            <img
                              src={match.team1Logo}
                              className="w-6 h-6 rounded-full object-cover"
                              alt=""
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          )}
                          <p className="text-white font-semibold text-sm">
                            {match.team1ShortName} vs {match.team2ShortName}
                          </p>
                          {match.team2Logo && (
                            <img
                              src={match.team2Logo}
                              className="w-6 h-6 rounded-full object-cover"
                              alt=""
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          )}
                        </div>
                        <p className="text-gray-500 text-xs mt-0.5">
                          {match.venue}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-gray-300 text-sm">
                          {match.sport}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-gray-300 text-sm">
                          {formatDate(match.matchTime)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={match.status}
                          onChange={(e) =>
                            handleStatusChange(match.id, e.target.value)
                          }
                          className={`bg-transparent border rounded-lg px-2 py-1 text-xs font-semibold cursor-pointer focus:outline-none ${
                            match.status === "live"
                              ? "border-red-500/50 text-red-400"
                              : match.status === "upcoming"
                                ? "border-blue-500/50 text-blue-400"
                                : "border-gray-500/50 text-gray-400"
                          }`}
                        >
                          {STATUS.map((s) => (
                            <option key={s} value={s} className="bg-dark-200">
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(match.id)}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="text-gray-500 text-center py-10">
                  No matches found
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMatches;
