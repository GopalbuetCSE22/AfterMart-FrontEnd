import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
function AdminLogin() {
  const [formdata, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- Add this state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/adminlogin",
        formdata
      );
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      setMessage("Login successful!");
      setFormData({ email: "", password: "" });
      localStorage.setItem("admin_id", response.data.admin_id);
      navigate("/adminDashboard");
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        className="flex flex-col space-y-5 bg-gray-900 bg-opacity-95 p-10 rounded-xl shadow-2xl w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
          Admin Login
        </h2>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-700 bg-gray-800 text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
          value={formdata.email}
          onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
          required
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border border-gray-700 bg-gray-800 text-gray-100 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
            value={formdata.password}
            onChange={(e) =>
              setFormData({ ...formdata, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400 text-lg"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition duration-300 font-semibold shadow"
        >
          Login
        </button>
        <a
          href="/"
          className="text-blue-400 hover:underline text-center transition"
        >
          Back to Home
        </a>
        {message && (
          <p className="text-center text-red-400 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}

export default AdminLogin;
