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

      // After successful login or registration
      localStorage.setItem("user_id", response.data.user_id); // Make sure this matches your backend response

      setFormData({ email: "", password: "" });
      navigate("/"); //to home page
      // navigate("/protected-data"); // Uncomment if you want to redirect
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Invalid username or password");
    }
  };

  return (
    <div>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded"
          value={formdata.email}
          onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded"
          value={formdata.password}
          onChange={(e) =>
            setFormData({ ...formdata, password: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <a href="/register" className="text-blue-500 hover:underline">
          Don't have an account? Register here
        </a>
        <a href="/" className="text-blue-500 hover:underline">
          Back to Home
        </a>
        {message && <p className="text-center text-red-500">{message}</p>}
      </form>
    </div>
  );
}

export default UserLogin;
