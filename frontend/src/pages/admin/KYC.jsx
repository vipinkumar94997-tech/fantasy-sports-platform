import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { formatDate } from "../../utils/helpers";

const AdminKYC = () => {
  const [kycList, setKycList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [selected, setSelected] = useState(null);

  const fetchKYC = () => {
    setLoading(true);
    api
      .get("/admin/kyc", { params: { status: filter } })
      .then((res) => setKycList(res.data.kycList))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchKYC();
  }, [filter]);

  const handleAction = async (userId, action, reason = "") => {
    try {
      await api.put(`/admin/kyc/${userId}/${action}`, { reason });
      toast.success(`KYC ${action}d successfully`);
      setSelected(null);
      fetchKYC();
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark-400">
      <div className="bg-dark-200 border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white text-sm">
          ← Dashboard
        </Link>
        <h1 className="text-white font-black text-xl">KYC Verification</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {["pending", "verified", "rejected"].map((f) => (
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

        {/* Detail Modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
            <div className="bg-dark-200 border border-white/10 rounded-2xl p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-lg">KYC Details</h2>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="card p-3">
                    <p className="text-gray-500 text-xs mb-1">Name</p>
                    <p className="text-white text-sm font-semibold">
                      {selected.user?.name}
                    </p>
                  </div>
                  <div className="card p-3">
                    <p className="text-gray-500 text-xs mb-1">Phone</p>
                    <p className="text-white text-sm font-semibold">
                      {selected.user?.phone}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="card p-3">
                    <p className="text-gray-500 text-xs mb-2">Aadhaar Card</p>
                    {selected.aadhaarImage ? (
                      <img
                        src={selected.aadhaarImage}
                        alt="Aadhaar"
                        className="w-full rounded-lg object-cover"
                      />
                    ) : (
                      <p className="text-gray-500 text-xs">Not uploaded</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      #{selected.aadhaarNumber}
                    </p>
                  </div>
                  <div className="card p-3">
                    <p className="text-gray-500 text-xs mb-2">PAN Card</p>
                    {selected.panImage ? (
                      <img
                        src={selected.panImage}
                        alt="PAN"
                        className="w-full rounded-lg object-cover"
                      />
                    ) : (
                      <p className="text-gray-500 text-xs">Not uploaded</p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">
                      {selected.panNumber}
                    </p>
                  </div>
                </div>

                <div className="card p-3">
                  <p className="text-gray-500 text-xs mb-1">Submitted</p>
                  <p className="text-white text-sm">
                    {formatDate(selected.createdAt)}
                  </p>
                </div>
              </div>

              {filter === "pending" && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(selected.user._id, "approve")}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl transition-colors"
                  >
                    ✓ Approve KYC
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt("Rejection reason:");
                      if (reason)
                        handleAction(selected.user._id, "reject", reason);
                    }}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold py-3 rounded-xl border border-red-500/30 transition-colors"
                  >
                    ✕ Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : kycList.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-gray-400">No {filter} KYC requests</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kycList.map((kyc) => (
              <div
                key={kyc._id}
                onClick={() => setSelected(kyc)}
                className="card p-5 cursor-pointer hover:border-primary-500/30 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 font-bold">
                    {kyc.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {kyc.user?.name}
                    </p>
                    <p className="text-gray-500 text-xs">{kyc.user?.phone}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Aadhaar</span>
                    <span
                      className={
                        kyc.aadhaarImage ? "text-primary-400" : "text-red-400"
                      }
                    >
                      {kyc.aadhaarImage ? "✓ Uploaded" : "✗ Missing"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">PAN</span>
                    <span
                      className={
                        kyc.panImage ? "text-primary-400" : "text-red-400"
                      }
                    >
                      {kyc.panImage ? "✓ Uploaded" : "✗ Missing"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-gray-500 text-xs">
                    {formatDate(kyc.createdAt)}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-semibold ${
                      filter === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : filter === "verified"
                          ? "bg-primary-500/20 text-primary-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {filter}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminKYC;
