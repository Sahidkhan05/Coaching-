import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    const role = res.data.user.role.toLowerCase();

    // ✅ ROLE BASED REDIRECT
    if (role === "admin" || role === "hr") {
      navigate("/admin/dashboard", { replace: true });
    } 
    else if (role === "tutor") {
      navigate("/tutor/dashboard", { replace: true });
    } 
    else if (role === "student") {
      navigate("/student/dashboard", { replace: true });
    }

  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* ===== LEFT SIDE BRAND PANEL ===== */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="text-center px-12">
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Coaching Management System
          </h1>

          <p className="text-lg opacity-90 mb-3">
            Secure Admin & Staff Portal
          </p>

          <p className="text-sm opacity-80 leading-relaxed">
            Manage students, tutors, courses, attendance<br />
            and reports from one powerful dashboard.
          </p>
        </div>
      </div>

      {/* ===== RIGHT SIDE LOGIN CARD ===== */}
      <div className="flex items-center justify-center bg-gray-100 p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Login to access your dashboard
            </p>
          </div>

          {error && (
            <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Coaching CRM System
          </p>
        </form>
      </div>

    </div>
  );
};

export default Login;
