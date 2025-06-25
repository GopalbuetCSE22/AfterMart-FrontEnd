import React from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-800 dark:text-gray-100 tracking-tight">
          Welcome Back!
        </h1>
        <div className="space-y-4">
          <button
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold shadow hover:bg-blue-700 hover:scale-105 transition-all duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={() => navigate("/userlogin")}
          >
            Login as User
          </button>
          <button
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold shadow hover:bg-green-700 hover:scale-105 transition-all duration-200 dark:bg-green-700 dark:hover:bg-green-800"
            onClick={() => navigate("/adminlogin")}
          >
            Login as Admin
          </button>
          <button
            className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold shadow hover:bg-yellow-600 hover:scale-105 transition-all duration-200 dark:bg-yellow-600 dark:hover:bg-yellow-700"
            onClick={() => navigate("/delivaryServicelogin")}
          >
            Login as Delivery Service
          </button>
          <button
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold shadow hover:bg-purple-700 hover:scale-105 transition-all duration-200 dark:bg-purple-700 dark:hover:bg-purple-800"
            onClick={() => navigate("/delivaryManlogin")}
          >
            Login as Delivery Man
          </button>
        </div>
        <div className="mt-8 flex justify-center">
          <span className="text-gray-400 dark:text-gray-500 text-sm">
            © AfterMart 2024
          </span>
        </div>
      </div>
      {/* Optional: Dark mode toggle for demo */}
      {/* <button
        className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded shadow"
        onClick={() => document.documentElement.classList.toggle('dark')}
      >
        Toggle Dark Mode
      </button> */}
    </div>
  );
}

export default LoginPage;
