import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { formatCurrency, formatDate } from "../../utils/helpers";

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [processing, setProcessing] = useState(null);
  const [totalPending, setTotalPending] = useState(0);

  const fetchWithdrawals = () => {
    setLoading(true);
    api
      .get("/admin/withdrawals", { params: { status: filter } })
      .then((res) => {
        setWithdrawals(res.data.withdrawals || []);
        setTotalPending(res.data.totalPendingAmount || 0);
      })
      .catch(() => setWithdrawals([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWithdrawals();
  }, [filter]);

  const handleProcess = async (id, action) => {
    const reason = action === "reject" ? prompt("Rejection reason:") : null;
    if (action === "reject" && !reason) return;
    setProcessing(id);
    try {
      await api.put(`/admin/withdrawals/${id}/process`, { action, reason });
      toast.success(`Withdrawal ${action}ed!`);
      fetchWithdrawals();
    } catch {
      toast.error("Action failed");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="min-h-screen bg-dark-400">
      <div className="bg-dark-200 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="text-gray-400 hover:text-white text-sm">
            ← Dashboard
          </Link>
          <h1 className="text-white font-black text-xl">Withdrawals</h1>
        </div>
        {filter === "pending" && totalPending > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded-lg">
            <span className="text-yellow-400 text-sm font-semibold">
              Total Pending: {formatCurrency(totalPending)}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6">
          {["pending", "approved", "rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                filter === f
                  ? "bg-primary-600 text-white"
                  : "bg-dark-200 text-gray-400 border border-white/10"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">💸</p>
            <p className="text-gray-400">No {filter} withdrawals</p>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {[
                      "User",
                      "Amount",
                      "UPI ID",
                      "TDS",
                      "Net Amount",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-gray-500 text-xs font-semibold uppercase px-5 py-4"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.map((w) => (
                    <tr
                      key={w.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="text-white text-sm font-medium">
                          {w.user?.name}
                        </p>
                        <p className="text-gray-500 text-xs">{w.user?.phone}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white font-bold">
                          {formatCurrency(w.amount)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-300 text-sm">{w.upiId}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-red-400 text-sm">
                          {w.tdsAmount > 0
                            ? `-${formatCurrency(w.tdsAmount)}`
                            : "—"}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-primary-400 font-bold">
                          {formatCurrency(w.amount - (w.tdsAmount || 0))}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-gray-400 text-sm">
                          {formatDate(w.createdAt)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        {filter === "pending" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleProcess(w.id, "approve")}
                              disabled={processing === w.id}
                              className="bg-primary-500/20 hover:bg-primary-500/30 text-primary-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-primary-500/30 disabled:opacity-50"
                            >
                              {processing === w.id ? "..." : "✓ Approve"}
                            </button>
                            <button
                              onClick={() => handleProcess(w.id, "reject")}
                              disabled={processing === w.id}
                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold px-3 py-1.5 rounded-lg border border-red-500/30 disabled:opacity-50"
                            >
                              ✕ Reject
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                              w.status === "approved"
                                ? "bg-primary-500/20 text-primary-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {w.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminWithdrawals;
