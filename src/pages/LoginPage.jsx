import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  User,
  Shield,
  Truck,
  Users,
  Home,
} from "lucide-react"; // Using lucide-react for icons as per the preferred design

function LoginPage() {
  const navigate = useNavigate(); // Initialize the navigate hook

  // Navigation functions
  const navigateToUserLogin = () => {
    navigate("/userlogin");
  };

  const navigateToAdminLogin = () => {
    navigate("/adminlogin");
  };

  const navigateToDeliveryServiceLogin = () => {
    navigate("/delivaryServicelogin");
  };

  const navigateToDeliveryManLogin = () => {
    navigate("/delivaryManlogin");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center justify-center px-4 py-8 font-inter">
      <h1 className="text-4xl font-bold mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 drop-shadow-md">
        Select Login Type
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* User Login Card */}
        <LoginCard
          label="User"
          description="For buyers and sellers using AfterMart"
          icon={<User size={40} />}
          hoverColor="hover:shadow-blue-500/50 hover:border-blue-400"
          iconColor="text-blue-400"
          onClick={navigateToUserLogin}
        />

        {/* Admin Login Card */}
        <LoginCard
          label="Admin"
          description="For platform administrators and moderators"
          icon={<Shield size={40} />}
          hoverColor="hover:shadow-green-500/50 hover:border-green-400"
          iconColor="text-green-400"
          onClick={navigateToAdminLogin}
        />

        {/* Delivery Service Login Card */}
        <LoginCard
          label="Delivery Service"
          description="For logistics companies offering delivery"
          icon={<Truck size={40} />}
          hoverColor="hover:shadow-orange-500/50 hover:border-orange-400"
          iconColor="text-orange-400"
          onClick={navigateToDeliveryServiceLogin}
        />

        {/* Delivery Man Login Card */}
        <LoginCard
          label="Delivery Man"
          description="For individual delivery personnel"
          icon={<Users size={40} />}
          hoverColor="hover:shadow-purple-500/50 hover:border-purple-400"
          iconColor="text-purple-400"
          onClick={navigateToDeliveryManLogin}
        />
      </div>

      {/* Back to Home Button */}
      <div className="mt-12">
        <button
          onClick={navigateToHome}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-lg
                     bg-slate-700 hover:bg-slate-600 transition-all duration-300 shadow-lg
                     focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <Home size={20} /> {/* Increased icon size for better visibility */}
          Back to Home
        </button>
      </div>

      <p className="text-center text-sm text-gray-400 mt-8">© AfterMart 2025 - All Rights Reserved</p>
    </div>
  );
}

// LoginCard component from the second example, with minor adjustments
function LoginCard({ label, description, icon, hoverColor, iconColor, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg ${hoverColor} transform hover:-translate-y-1 transition duration-300 h-48 flex flex-col items-center justify-center text-center`}
    >
      <div className={`mb-3 ${iconColor} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h2 className="text-xl font-semibold mb-2">{label}</h2>
      <p className="text-sm text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

export default LoginPage;