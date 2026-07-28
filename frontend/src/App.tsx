import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Loader from "./components/common/Loader";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Home = lazy(() => import("./pages/Home"));
const MatchDetail = lazy(() => import("./pages/MatchDetail"));
const CreateTeam = lazy(() => import("./pages/CreateTeam"));
const Contests = lazy(() => import("./pages/Contests"));
const ContestDetail = lazy(() => import("./pages/ContestDetail"));
const LiveMatch = lazy(() => import("./pages/LiveMatch"));
const MyTeams = lazy(() => import("./pages/MyTeams"));
const MyContests = lazy(() => import("./pages/MyContests"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Profile = lazy(() => import("./pages/Profile"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const KYC = lazy(() => import("./pages/KYC"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const ReferEarn = lazy(() => import("./pages/ReferEarn"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ResponsibleGaming = lazy(() => import("./pages/ResponsibleGaming"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminMatches = lazy(() => import("./pages/admin/Matches"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminKYC = lazy(() => import("./pages/admin/KYC"));
const AdminWithdrawals = lazy(() => import("./pages/admin/Withdrawals"));

const RouteLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-dark-300">
    <Loader size="lg" text="Loading..." />
  </div>
);

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
      <Suspense fallback={<RouteLoader />}>
      <Routes>
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {userRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={<ProtectedRoute>{element}</ProtectedRoute>}
          />
        ))}

        {adminRoutes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute adminOnly={true}>{element}</ProtectedRoute>
            }
          />
        ))}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
