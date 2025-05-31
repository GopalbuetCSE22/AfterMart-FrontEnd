import React from "react";
import { useNavigate } from "react-router-dom";
function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login Page</h1>
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-3 hover:bg-blue-700 transition"
          onClick={() => navigate("/userlogin")}
        >
          Login as User
        </button>
        <button
          className="w-full bg-green-600 text-white py-2 px-4 rounded mb-3 hover:bg-green-700 transition"
          onClick={() => navigate("/adminlogin")}
        >
          Login as Admin
        </button>
        <button
          className="w-full bg-yellow-500 text-white py-2 px-4 rounded mb-3 hover:bg-yellow-600 transition"
          onClick={() => navigate("/delivaryServicelogin")}
        >
          Login as Delivary Service
        </button>
        <button
          className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          onClick={() => navigate("/delivaryManlogin")}
        >
          Login as Delivary Man
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
