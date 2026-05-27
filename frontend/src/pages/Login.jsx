import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import { GiCricketBat } from "react-icons/gi";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const res = await dispatch(loginUser(form));
  //   console.log("Login response:", res.payload);
  //   if (res.meta.requestStatus === "fulfilled") {
  //     toast.success("Welcome back! 🏏");
  //     if (res.payload.user?.role === "admin") {
  //       navigate("admin");
  //     } else {
  //       navigate("/home");
  //     }
  //   } else {
  //     toast.error(res.payload || "Login failed");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(loginUser(form));
    console.log("Login response:", res.payload); // ye add karo
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Welcome back! 🏏");
      const role = res.payload?.user?.role;
      console.log("User role:", role); // ye add karo
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } else {
      toast.error(res.payload || "Login failed");
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      const res = await authService.googleLogin(credentialResponse.credential);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      toast.success("Logged in with Google!");
      navigate("/home");
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-dark-400 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <GiCricketBat className="text-primary-500 text-3xl" />
            <span className="text-white font-black text-2xl">
              Fantasy<span className="text-primary-500">11</span>
            </span>
          </Link>
          <p className="text-gray-400 mt-2">Welcome back! Login to continue</p>
        </div>

        <div className="card p-8">
          <h2 className="text-white font-bold text-2xl mb-6">Login</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-600 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => toast.error("Google login failed")}
              theme="filled_black"
              shape="rectangular"
              width="100%"
            />
          </div> */}

          <p className="text-center text-gray-500 text-sm mt-6">
            New here?{" "}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
