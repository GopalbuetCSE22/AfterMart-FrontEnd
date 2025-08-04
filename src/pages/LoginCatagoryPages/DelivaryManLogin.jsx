import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function DelivaryManLogin() {
  const [formdata, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/deliveryManlogin`,
        formdata
      );
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      setMessage("Login successful!");
      setFormData({ email: "", password: "" });
      localStorage.setItem("deliveryman_id", response.data.deliveryman_id);
      navigate("/deliveryManDashboard");
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        className="flex flex-col space-y-5 bg-gray-900 p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-800"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-4 text-center">
          Delivery Man Login
        </h2>
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
          <p
            className={`text-center ${message === "Login successful!"
              ? "text-green-400"
              : "text-red-400"
              }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default DelivaryManLogin;
