import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserLogin() {
  const [formdata, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/userlogin",
        formdata
      );
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      setMessage("Login successful!");

      localStorage.setItem("user_id", response.data.user_id);

      setFormData({ email: "", password: "" });
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        className="flex flex-col space-y-5 bg-gray-900 bg-opacity-95 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-800"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-4">User Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-700 bg-gray-800 text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
          value={formdata.email}
          onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-700 bg-gray-800 text-gray-100 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
          value={formdata.password}
          onChange={(e) =>
            setFormData({ ...formdata, password: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-3 rounded font-semibold hover:bg-blue-800 transition duration-300 shadow"
        >
          Login
        </button>
        <a href="/register" className="text-blue-400 hover:underline text-center">
          Don't have an account? Register here
        </a>
        <a href="/" className="text-gray-400 hover:text-blue-400 hover:underline text-center">
          Back to Home
        </a>
        {message && (
          <p className="text-center text-red-400 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}

export default UserLogin;
