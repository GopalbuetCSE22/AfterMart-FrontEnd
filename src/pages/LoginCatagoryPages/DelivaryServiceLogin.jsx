import React, { useState } from "react";
import axios from "axios";

function DelivaryServiceLogin() {
  const [formdata, setFormData] = useState({ companyName: "", tradeLicense: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/delivaryServicelogin",
        formdata
      );
      const { token } = response.data;
      localStorage.setItem("authToken", token);
      setMessage("Login successful!");
      setFormData({ companyName: "", tradeLicense: "" });
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
          type="text"
          placeholder="companyName"
          className="border border-gray-300 p-2 rounded"
          value={formdata.companyName}
          onChange={(e) => setFormData({ ...formdata, companyName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="tradeLicense"
          className="border border-gray-300 p-2 rounded"
          value={formdata.tradeLicense}
          onChange={(e) =>
            setFormData({ ...formdata, tradeLicense: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Login
        </button>
        <a href="/delivaryServiceRegister" className="text-blue-500 hover:underline">
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

export default DelivaryServiceLogin;
