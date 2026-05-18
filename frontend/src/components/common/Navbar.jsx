import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../hooks/useWallet";
import { FiHome, FiUser, FiLogOut, FiBell, FiMenu, FiX } from "react-icons/fi";
import { GiCricketBat } from "react-icons/gi";
import { formatCurrency } from "../../utils/helpers";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { path: "/home", label: "Matches", icon: <FiHome /> },
    { path: "/my-contests", label: "My Contests", icon: null },
    { path: "/my-teams", label: "My Teams", icon: null },
    { path: "/leaderboard", label: "Leaderboard", icon: null },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-200 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <GiCricketBat className="text-primary-500 text-2xl" />
          <span className="text-white font-bold text-xl">
            Fantasy<span className="text-primary-500">11</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-primary-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Wallet */}
              <Link
                to="/wallet"
                className="hidden md:flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 px-3 py-1.5 rounded-lg"
              >
                <span className="text-primary-400 text-xs">💰</span>
                <span className="text-primary-400 font-semibold text-sm">
                  {formatCurrency(balance)}
                </span>
              </Link>

              {/* Add Money */}
              <Link
                to="/wallet"
                className="hidden md:block bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
              >
                + Add Cash
              </Link>

              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <FiBell className="text-xl" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <Link to="/profile" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors text-sm"
              >
                <FiLogOut />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-400 hover:text-white text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {isAuthenticated && (
            <button
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && isAuthenticated && (
        <div className="md:hidden bg-dark-200 border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium ${
                location.pathname === link.path
                  ? "text-primary-500"
                  : "text-gray-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/wallet"
            onClick={() => setMenuOpen(false)}
            className="text-sm text-gray-400"
          >
            💰 Wallet: {formatCurrency(balance)}
          </Link>
          <button
            onClick={handleLogout}
            className="text-left text-sm text-red-400"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
