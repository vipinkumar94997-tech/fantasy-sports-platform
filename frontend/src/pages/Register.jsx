import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { authService } from "../services/authService";
import toast from "react-hot-toast";
import { GiCricketBat } from "react-icons/gi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { isRestrictedState } from "../utils/helpers";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
];

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [step, setStep] = useState(1);
  const [showPass, setShowPass] = useState(false);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    state: "",
    referralCode: "",
    age: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (isRestrictedState(form.state)) {
      toast.error(`Not allowed in ${form.state}`);
      return;
    }
    if (parseInt(form.age) < 18) {
      toast.error("Must be 18+");
      return;
    }
    try {
      const res = await authService.register(form);
      toast.success("Registered! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.verifyOTP({ phone: form.phone, otp });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      toast.success("Account created! Welcome to Fantasy11 🎉");
      navigate("/home");
    } catch {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-dark-400 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <GiCricketBat className="text-primary-500 text-3xl" />
            <span className="text-white font-black text-2xl">
              Fantasy<span className="text-primary-500">11</span>
            </span>
          </Link>
          <p className="text-gray-400 mt-2">Create your free account</p>
        </div>

        <div className="card p-8">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${s <= step ? "bg-primary-500" : "bg-white/10"}`}
              />
            ))}
          </div>

          {step === 1 ? (
            <>
              <h2 className="text-white font-bold text-2xl mb-6">
                Create Account
              </h2>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="email..."
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                    className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <span className="bg-dark-300 border border-white/10 text-gray-400 px-3 py-3 rounded-xl text-sm">
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="xxxxxxxxxxx"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      required
                      maxLength={10}
                      className="flex-1 bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">
                      Age
                    </label>
                    <input
                      type="number"
                      placeholder="age"
                      min="18"
                      max="99"
                      value={form.age}
                      onChange={(e) =>
                        setForm({ ...form, age: e.target.value })
                      }
                      required
                      className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1.5 block">
                      State
                    </label>
                    <select
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      required
                      className="w-full bg-dark-300 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                    >
                      <option value="">Select</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="Min 8 characters"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      required
                      minLength={8}
                      className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showPass ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-gray-400 text-sm mb-1.5 block">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter referral code"
                    value={form.referralCode}
                    onChange={(e) =>
                      setForm({ ...form, referralCode: e.target.value })
                    }
                    className="w-full bg-dark-300 border border-white/10 text-white placeholder-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  {loading ? "Creating account..." : "Create Account & Get OTP"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-white font-bold text-2xl mb-2">Verify OTP</h2>
              <p className="text-gray-400 text-sm mb-6">
                OTP sent to <span className="text-white">+91 {form.phone}</span>
              </p>
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                  className="w-full bg-dark-300 border border-white/10 text-white text-center text-2xl tracking-widest placeholder-gray-600 px-4 py-4 rounded-xl focus:outline-none focus:border-primary-500 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-colors"
                >
                  Verify & Start Playing 🎉
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  ← Back
                </button>
              </form>
            </>
          )}

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-400 hover:text-primary-300 font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
