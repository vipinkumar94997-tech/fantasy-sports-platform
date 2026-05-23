import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/common/ProtectedRoute";

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

import AdminDashboard from "./pages/admin/Dashboard";
import AdminMatches from "./pages/admin/Matches";
import AdminUsers from "./pages/admin/Users";
import AdminKYC from "./pages/admin/KYC";
import AdminWithdrawals from "./pages/admin/Withdrawals";
import KYC from "./pages/KYC";

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
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/match/:id"
          element={
            <ProtectedRoute>
              <MatchDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/match/:id/create-team"
          element={
            <ProtectedRoute>
              <CreateTeam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/match/:id/contests"
          element={
            <ProtectedRoute>
              <Contests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contest/:id"
          element={
            <ProtectedRoute>
              <ContestDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/live/:matchId"
          element={
            <ProtectedRoute>
              <LiveMatch />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-teams"
          element={
            <ProtectedRoute>
              <MyTeams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-contests"
          element={
            <ProtectedRoute>
              <MyContests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/kyc"
          element={
            <ProtectedRoute>
              <KYC />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminMatches />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/kyc"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminKYC />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/withdrawals"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminWithdrawals />
            </ProtectedRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
