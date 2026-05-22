import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import toast from "react-hot-toast";
import { formatDate, formatCurrency } from "../../utils/helpers";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/admin/users", { params: { search, page, limit: LIMIT } })
      .then((res) => {
        setUsers(res.data.users);
        setTotal(res.data.total);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [search, page]);

  const handleBan = async (id, banned) => {
    try {
      await api.put(`/admin/users/${id}`, { banned: !banned });
      toast.success(banned ? "User unbanned" : "User banned");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-dark-400">
      <div className="bg-dark-200 border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <Link to="/admin" className="text-gray-400 hover:text-white text-sm">
          ← Dashboard
        </Link>
        <h1 className="text-white font-black text-xl">Users ({total})</h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full max-w-md bg-dark-200 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader />
          </div>
        ) : (
          <>
            <div className="card overflow-hidden mb-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      {[
                        "User",
                        "Phone",
                        "State",
                        "KYC",
                        "Balance",
                        "Contests",
                        "Joined",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left text-gray-500 text-xs font-semibold uppercase px-4 py-4"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className={`border-b border-white/5 hover:bg-white/2 transition-colors ${user.banned ? "opacity-50" : ""}`}
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 font-bold text-sm flex-shrink-0">
                              {user.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-white text-sm font-medium">
                                {user.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-300 text-sm">
                          {user.phone}
                        </td>
                        <td className="px-4 py-4 text-gray-300 text-sm">
                          {user.state}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                              user.kycStatus === "verified"
                                ? "bg-primary-500/20 text-primary-400"
                                : user.kycStatus === "pending"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {user.kycStatus || "none"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-primary-400 text-sm font-semibold">
                          {formatCurrency(user.wallet?.balance || 0)}
                        </td>
                        <td className="px-4 py-4 text-gray-300 text-sm">
                          {user.totalContests || 0}
                        </td>
                        <td className="px-4 py-4 text-gray-500 text-xs">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleBan(user.id, user.banned)}
                            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                              user.banned
                                ? "bg-primary-500/20 text-primary-400 hover:bg-primary-500/30"
                                : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            }`}
                          >
                            {user.banned ? "Unban" : "Ban"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && (
                  <p className="text-gray-500 text-center py-10">
                    No users found
                  </p>
                )}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 disabled:opacity-30 hover:text-white text-sm"
                >
                  ← Prev
                </button>
                <span className="text-gray-400 text-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-white/10 text-gray-400 disabled:opacity-30 hover:text-white text-sm"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
