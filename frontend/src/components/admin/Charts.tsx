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

const tooltipStyle = {
  contentStyle: {
    background: "#1e1e2e",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  labelStyle: { color: "#fff" },
};

export const RevenueChart = ({ data }) => (
  <div className="card p-5">
    <h3 className="text-white font-bold mb-4">Revenue (Last 7 Days)</h3>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
        <Tooltip {...tooltipStyle} />
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
);

export const UserGrowthChart = ({ data }) => (
  <div className="card p-5">
    <h3 className="text-white font-bold mb-4">
      User Registrations (Last 7 Days)
    </h3>
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} />
        <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
