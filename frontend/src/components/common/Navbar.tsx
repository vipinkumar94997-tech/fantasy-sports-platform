import { useCallback, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../hooks/useWallet";
import { FiLogOut, FiBell, FiMenu, FiX } from "react-icons/fi";
import { GiCricketBat } from "react-icons/gi";
import { formatCurrency, formatDate } from "../../utils/helpers";
import api from "../../services/api";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedNotifs, setSelectedNotifs] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const notifRef = useRef(null);
  const notificationRequestRef = useRef<Promise<void> | null>(null);

  const navLinks = [
    { path: "/home", label: "Matches" },
    { path: "/my-contests", label: "My Contests" },
    { path: "/my-teams", label: "My Teams" },
    { path: "/leaderboard", label: "Leaderboard" },
  ];

  const fetchNotifications = useCallback(() => {
    if (notificationRequestRef.current) return notificationRequestRef.current;

    notificationRequestRef.current = api
      .get("/notifications")
      .then((res) => {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      })
      .catch(() => undefined)
      .finally(() => {
        notificationRequestRef.current = null;
      });

    return notificationRequestRef.current;
  }, []);

  useEffect(() => {
    if (isAuthenticated) void fetchNotifications();
  }, [fetchNotifications, isAuthenticated]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
        setSelectMode(false);
        setSelectedNotifs([]);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put("/notifications/read-all");
      setUnreadCount(0);
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch {
      toast.error("Failed to update notifications");
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete("/notifications/clear-all");
      setNotifications([]);
      setUnreadCount(0);
      setSelectedNotifs([]);
      setSelectMode(false);
    } catch {
      toast.error("Failed to clear notifications");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await api.delete("/notifications/delete-selected", {
        data: { ids: selectedNotifs },
      });
      setNotifications(
        notifications.filter((n) => !selectedNotifs.includes(n.id)),
      );
      setSelectedNotifs([]);
      setSelectMode(false);
    } catch {
      toast.error("Failed to delete notifications");
    }
  };

  const toggleSelect = (id) => {
    setSelectedNotifs((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifs.length === notifications.length) {
      setSelectedNotifs([]);
    } else {
      setSelectedNotifs(notifications.map((n) => n.id));
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-dark-200 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Sidebar Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-400 hover:text-white mr-2"
        >
          {menuOpen ? (
            <FiX className="text-2xl" />
          ) : (
            <FiMenu className="text-2xl" />
          )}
        </button>
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
                className="hidden md:flex items-center gap-2 bg-primary-600/20 border border-primary-500/30 px- py-1.5 rounded-lg"
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
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => {
                    setShowNotif(!showNotif);
                    if (!showNotif) void fetchNotifications();
                    setSelectMode(false);
                    setSelectedNotifs([]);
                  }}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <FiBell className="text-xl" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotif && (
                  <div className="absolute right-0 top-12 w-72 bg-dark-200 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className=" flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <h3 className="text-white font-bold text-sm">
                        Notifications
                      </h3>
                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectMode(!selectMode);
                              setSelectedNotifs([]);
                            }}
                            className={`text-xs font-semibold transition-colors ${
                              selectMode
                                ? "text-primary-400"
                                : "text-gray-400 hover:text-white"
                            }`}
                          >
                            {selectMode ? "Cancel" : "Select"}
                          </button>
                        )}
                        {unreadCount > 0 && !selectMode && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-primary-400 text-xs hover:text-primary-300"
                          >
                            Mark read
                          </button>
                        )}
                        {notifications.length > 0 && !selectMode && (
                          <button
                            onClick={handleClearAll}
                            className="text-red-400 text-xs hover:text-red-300"
                          >
                            Clear all
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Select Mode Bar */}
                    {selectMode && notifications.length > 0 && (
                      <div className="flex items-center justify-between px-4 py-2 bg-dark-300/50 border-b border-white/5 ">
                        <button
                          onClick={handleSelectAll}
                          className="text-xs text-primary-400 hover:text-primary-300 font-semibold"
                        >
                          {selectedNotifs.length === notifications.length
                            ? "Deselect All"
                            : "Select All"}
                        </button>
                        {selectedNotifs.length > 0 && (
                          <button
                            onClick={handleDeleteSelected}
                            className="text-xs text-red-400 hover:text-red-300 font-semibold"
                          >
                            Delete ({selectedNotifs.length})
                          </button>
                        )}
                      </div>
                    )}

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-4xl mb-2">🔔</p>
                          <p className="text-gray-400 text-sm">
                            No notifications
                          </p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => selectMode && toggleSelect(notif.id)}
                            className={`px-4 py-3 border-b border-white/5 transition-colors ${
                              selectMode ? "cursor-pointer" : ""
                            } ${
                              selectedNotifs.includes(notif.id)
                                ? "bg-primary-500/10 border-l-2 border-l-primary-500"
                                : !notif.isRead
                                  ? "bg-primary-500/5"
                                  : ""
                            } hover:bg-white/5`}
                          >
                            <div className="flex items-start gap-3">
                              {/* Checkbox */}
                              {selectMode && (
                                <div
                                  className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                                    selectedNotifs.includes(notif.id)
                                      ? "bg-primary-500 border-primary-500"
                                      : "border-gray-500"
                                  }`}
                                >
                                  {selectedNotifs.includes(notif.id) && (
                                    <span className="text-white text-xs font-bold">
                                      ✓
                                    </span>
                                  )}
                                </div>
                              )}

                              <span className="text-lg flex-shrink-0">
                                {notif.type === "success"
                                  ? "✅"
                                  : notif.type === "warning"
                                    ? "⚠️"
                                    : notif.type === "error"
                                      ? "❌"
                                      : "ℹ️"}
                              </span>

                              <div className="flex-1">
                                <p className="text-white text-sm font-semibold">
                                  {notif.title}
                                </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                  {notif.message}
                                </p>
                                <p className="text-gray-600 text-xs mt-1">
                                  {formatDate(notif.createdAt)}
                                </p>
                              </div>

                              {!notif.isRead && !selectMode && (
                                <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-1" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <Link to="/profile">
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
                className="text-gray-400 hover:text-white text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {/* {isAuthenticated && (
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
          )} */}
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
