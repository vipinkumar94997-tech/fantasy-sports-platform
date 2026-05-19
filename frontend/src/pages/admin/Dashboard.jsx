import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import { formatCurrency } from "../../utils/helpers";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const StatCard = ({ icon, label, value, sub, color = "text-primary-400" }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-2xl">{icon}</span>
      <span
        className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/5 ${color}`}
      >
        {sub}
      </span>
    </div>
    <p className={`font-black text-2xl ${color} mb-1`}>{value}</p>
    <p className="text-gray-500 text-sm">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard-stats")
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );

  const revenueData = stats?.revenueChart || [];
  const userGrowthData = stats?.userGrowthChart || [];

  return (
    <div className="min-h-screen bg-dark-400">
      {/* Top Bar */}
      <div className="bg-dark-200 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/home" className="text-gray-400 hover:text-white text-sm">
            ← Back to App
          </Link>
          <h1 className="text-white font-black text-xl">Admin Panel</h1>
        </div>
        <span className="text-gray-500 text-sm">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-56 min-h-screen bg-dark-200 border-r border-white/10 p-4 hidden md:block">
          {[
            { icon: "📊", label: "Dashboard", path: "/admin" },
            { icon: "🏏", label: "Matches", path: "/admin/matches" },
            { icon: "👥", label: "Users", path: "/admin/users" },
            { icon: "📋", label: "KYC", path: "/admin/kyc" },
            { icon: "💸", label: "Withdrawals", path: "/admin/withdrawals" },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-colors ${
                window.location.pathname === item.path
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon="👥"
              label="Total Users"
              value={stats?.totalUsers?.toLocaleString() || "0"}
              sub={`+${stats?.newUsersToday || 0} today`}
              color="text-blue-400"
            />
            <StatCard
              icon="💰"
              label="Total Revenue"
              value={formatCurrency(stats?.totalRevenue || 0)}
              sub={`Today: ${formatCurrency(stats?.todayRevenue || 0)}`}
              color="text-primary-400"
            />
            <StatCard
              icon="🏆"
              label="Active Contests"
              value={stats?.activeContests || 0}
              sub={`${stats?.liveMatches || 0} live`}
              color="text-yellow-400"
            />
            <StatCard
              icon="💸"
              label="Pending Withdrawals"
              value={stats?.pendingWithdrawals || 0}
              sub={formatCurrency(stats?.pendingAmount || 0)}
              color="text-red-400"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="card p-5">
              <h3 className="text-white font-bold mb-4">
                Revenue (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={revenueData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#1e1e2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* User Growth Chart */}
            <div className="card p-5">
              <h3 className="text-white font-bold mb-4">
                User Registrations (Last 7 Days)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={userGrowthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                  />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#1e1e2e",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                  />
                  <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="card p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">KYC Pending</p>
              <p className="text-yellow-400 font-black text-2xl">
                {stats?.kycPending || 0}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Matches</p>
              <p className="text-white font-black text-2xl">
                {stats?.totalMatches || 0}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Total Teams Created</p>
              <p className="text-white font-black text-2xl">
                {stats?.totalTeams?.toLocaleString() || 0}
              </p>
            </div>
            <div className="card p-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Prize Distributed</p>
              <p className="text-primary-400 font-black text-2xl">
                {formatCurrency(stats?.totalPrizeDistributed || 0)}
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Recent Users</h3>
                <Link
                  to="/admin/users"
                  className="text-primary-400 text-sm hover:text-primary-300"
                >
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                {stats?.recentUsers?.map((user, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center text-primary-400 font-bold text-sm flex-shrink-0">
                      {user.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {user.name}
                      </p>
                      <p className="text-gray-500 text-xs">{user.phone}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${user.kycStatus === "verified" ? "bg-primary-500/20 text-primary-400" : "bg-yellow-500/20 text-yellow-400"}`}
                    >
                      {user.kycStatus === "verified" ? "KYC ✓" : "Pending"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold">Recent Transactions</h3>
              </div>
              <div className="space-y-3">
                {stats?.recentTransactions?.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">
                        {tx.userName}
                      </p>
                      <p className="text-gray-500 text-xs capitalize">
                        {tx.type?.replace("_", " ")}
                      </p>
                    </div>
                    <p
                      className={`font-bold text-sm ${
                        ["deposit", "winning", "bonus"].includes(tx.type)
                          ? "text-primary-400"
                          : "text-red-400"
                      }`}
                    >
                      {["deposit", "winning", "bonus"].includes(tx.type)
                        ? "+"
                        : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
