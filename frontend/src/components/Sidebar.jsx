import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-56 min-h-screen bg-dark-200 border-r border-white/10 p-4 py-[4%] hidden md:block">
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
  );
};

export default Sidebar;
