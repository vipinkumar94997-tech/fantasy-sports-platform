import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/common/ProtectedRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MatchDetail from "./pages/MatchDetail";
import CreateTeam from "./pages/CreateTeam";
import Contests from "./pages/Contests";
import ContestDetail from "./pages/ContestDetail";
import LiveMatch from "./pages/LiveMatch";
import MyTeams from "./pages/MyTeams";
import MyContests from "./pages/MyContests";
import Wallet from "./pages/Wallet";
import Profile from "./pages/Profile";
import Leaderboard from "./pages/Leaderboard";
import KYC from "./pages/KYC";
import EditProfile from "./pages/EditProfile";
import ReferEarn from "./pages/ReferEarn";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ResponsibleGaming from "./pages/ResponsibleGaming";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminMatches from "./pages/admin/Matches";
import AdminUsers from "./pages/admin/Users";
import AdminKYC from "./pages/admin/KYC";
import AdminWithdrawals from "./pages/admin/Withdrawals";

// Public routes
const publicRoutes = [
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/terms", element: <Terms /> },
  { path: "/privacy", element: <Privacy /> },
  { path: "/responsible-gaming", element: <ResponsibleGaming /> },
];

// User protected routes
const userRoutes = [
  { path: "/home", element: <Home /> },
  { path: "/match/:id", element: <MatchDetail /> },
  { path: "/match/:id/create-team", element: <CreateTeam /> },
  { path: "/match/:id/contests", element: <Contests /> },
  { path: "/contest/:id", element: <ContestDetail /> },
  { path: "/live/:matchId", element: <LiveMatch /> },
  { path: "/my-teams", element: <MyTeams /> },
  { path: "/my-contests", element: <MyContests /> },
  { path: "/wallet", element: <Wallet /> },
  { path: "/profile", element: <Profile /> },
  { path: "/profile/kyc", element: <KYC /> },
  { path: "/profile/edit", element: <EditProfile /> },
  { path: "/profile/refer", element: <ReferEarn /> },
  { path: "/leaderboard", element: <Leaderboard /> },
];

// Admin protected routes
const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/matches", element: <AdminMatches /> },
  { path: "/admin/users", element: <AdminUsers /> },
  { path: "/admin/kyc", element: <AdminKYC /> },
  { path: "/admin/withdrawals", element: <AdminWithdrawals /> },
];

const App = () => {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1e2e",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
        }}
      />
      <Routes>
        {/* Public Routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* User Protected Routes */}
        {userRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute>{element}</ProtectedRoute>}
          />
        ))}

        {/* Admin Protected Routes */}
        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute adminOnly={true}>{element}</ProtectedRoute>
            }
          />
        ))}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
