import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaUserShield, FaTruckMoving, FaPeopleCarry } from "react-icons/fa";

function LoginPage() {
  const navigate = useNavigate();

  // Animation variants for the card (for a smooth entrance)
  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80, // Soft spring for a smooth feel
        damping: 15,
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for the buttons (for a staggered entrance)
  const buttonVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } },
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden font-sans">
      {/* Subtle, **Static** Background */}
      <div className="absolute inset-0 z-0 opacity-10">
        {/* Simple grid overlay for a futuristic feel without animation */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3d3LnYy5vcmcvMjAwMC9zdmciPjxlZz48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjk2MjZmIiBzdHJva2Utd2lkdGg9IjAuMiIvPjxyZWN0IHhvPSIwIiB5PSIwIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJub25lIiBzdHJva2U9IiMyOTYyNmYiIHN0cm9rZS13aWR0aD0iMC4xIi8+PC9lZz48L3N2Zz4=')] bg-repeat opacity-5"></div>
        {/* Very subtle static radial gradient for depth */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-purple-900/10 to-transparent"></div>
      </div>

      {/* Glassy login card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative backdrop-blur-xl bg-white/5 border border-purple-500/30 p-12 rounded-3xl shadow-2xl max-w-lg w-full z-10"
      >
        {/* Adjusted z-index for the title and increased margin-bottom */}
        <h1 className="relative z-10 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-12 drop-shadow-lg tracking-wide">
          Login as
        </h1>

        {/* Grid layout for square buttons */}
        <div className="grid grid-cols-2 gap-6">
          <motion.div variants={buttonVariants}>
            <LoginButton
              label="User"
              icon={<FaUser />}
              onClick={() => navigate("/userlogin")}
              baseColor="blue"
            />
          </motion.div>
          <motion.div variants={buttonVariants}>
            <LoginButton
              label="Admin"
              icon={<FaUserShield />}
              onClick={() => navigate("/adminlogin")}
              baseColor="green"
            />
          </motion.div>
          <motion.div variants={buttonVariants}>
            <LoginButton
              label="Delivery Service"
              icon={<FaTruckMoving />}
              onClick={() => navigate("/delivaryServicelogin")}
              baseColor="orange"
            />
          </motion.div>
          <motion.div variants={buttonVariants}>
            <LoginButton
              label="Delivery Man"
              icon={<FaPeopleCarry />}
              onClick={() => navigate("/delivaryManlogin")}
              baseColor="purple"
            />
          </motion.div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          © AfterMart 2025 - All Rights Reserved
        </div>
      </motion.div>
    </div>
  );
}

function LoginButton({ label, icon, onClick, baseColor }) {
  const colorSchemes = {
    blue: {
      gradient: "bg-gradient-to-br from-blue-500/10 to-blue-700/10",
      border: "border-blue-400/30",
      shadow: "group-hover:shadow-blue",
    },
    green: {
      gradient: "bg-gradient-to-br from-green-500/10 to-green-700/10",
      border: "border-green-400/30",
      shadow: "group-hover:shadow-green",
    },
    orange: {
      gradient: "bg-gradient-to-br from-orange-500/10 to-orange-700/10",
      border: "border-orange-400/30",
      shadow: "group-hover:shadow-orange",
    },
    purple: {
      gradient: "bg-gradient-to-br from-purple-500/10 to-purple-700/10",
      border: "border-purple-400/30",
      shadow: "group-hover:shadow-purple",
    },
  };

  const scheme = colorSchemes[baseColor] || colorSchemes.blue;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`relative w-full flex flex-col items-center justify-center p-6
                  backdrop-blur-md rounded-xl text-white font-semibold text-lg
                  shadow-md transition-all duration-300 overflow-hidden group
                  ${scheme.gradient} border ${scheme.border} ${scheme.shadow}`}
      style={{
        aspectRatio: '1 / 1'
      }}
    >
      <motion.div
        className="text-5xl mb-3 z-10"
        initial={{ y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {icon}
      </motion.div>

      <span className="text-center z-10">{label}</span>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 transform -skew-x-12 -translate-x-full group-hover:translate-x-full z-0"></div>
    </motion.button>
  );
}

export default LoginPage;