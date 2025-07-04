import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadImage from "../../components/UploadImage";
import {
  FiHome,
  FiShoppingCart,
  FiBox,
  FiShoppingBag,
  FiCreditCard,
  FiLogOut,
  FiHeart,
  FiBell,
  FiUser,
} from "react-icons/fi";

function UserDashBoard() {
  const [activeSection, setActiveSection] = useState("Info");
  const [userPhoto, setUserPhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      fetch(`http://localhost:5000/api/uploadImage/getProfilePic/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setUserPhoto(data[0].profile_picture);
          } else {
            setUserPhoto(null);
          }
        })
        .catch(() => setUserPhoto(null));
    }
  }, []);

  const renderMainContent = () => {
    switch (activeSection) {
      case "Info":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2 flex items-center gap-2 drop-shadow-lg">
              <FiUser className="text-blue-400" /> Welcome to Your Dashboard
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              This is your dashboard home.
            </p>
          </>
        );
      case "sell":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2 flex items-center gap-2 drop-shadow-lg">
              <FiShoppingCart className="text-blue-400" /> Sell Product
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Here you can list a new product for sale.
            </p>
          </>
        );
      case "myProducts":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2 flex items-center gap-2 drop-shadow-lg">
              <FiBox className="text-blue-400" /> My Products
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Here are your listed products.
            </p>
          </>
        );
      case "bought":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2 flex items-center gap-2 drop-shadow-lg">
              <FiShoppingBag className="text-blue-400" /> My Bought Products
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Here are the products you have purchased.
            </p>
          </>
        );
      case "transactions":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2 flex items-center gap-2 drop-shadow-lg">
              <FiCreditCard className="text-blue-400" /> Transaction History
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Here is your transaction history.
            </p>
          </>
        );
      case "wishlist":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2 flex items-center gap-2 drop-shadow-lg">
              <FiHeart className="text-pink-400" /> Wishlist
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Here are your favorite products.
            </p>
          </>
        );
      case "notifications":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2 flex items-center gap-2 drop-shadow-lg">
              <FiBell className="text-yellow-400" /> Notifications
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              Here are your notifications.
            </p>
          </>
        );
      case "logout":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-100 mb-2 flex items-center gap-2 drop-shadow-lg">
              <FiLogOut className="text-red-400" /> Logged Out
            </h1>
            <p className="mt-4 text-lg text-gray-400">
              You have been logged out.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950">
      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-gray-950/95 via-gray-900/90 to-gray-800/90 text-white p-8 space-y-8 fixed h-full shadow-2xl rounded-r-3xl flex flex-col items-center backdrop-blur-2xl border-r border-gray-800/80">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-800 via-blue-900 to-black flex items-center justify-center mb-3 shadow-xl border-4 border-blue-900/60 overflow-hidden">
            {userPhoto ? (
              <img
                src={userPhoto}
                // src="https://drive.google.com/uc?export=view&id=1664R10pL5EDtMmZNAvoaaWdriCzvvOJ7"
                alt="user profile"
                className="w-full h-full object-cover"
                style={{ maxWidth: "96px", maxHeight: "96px" }}
              />
            ) : (
              <span className="text-4xl font-bold text-gray-300">U</span>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-wide text-blue-200 drop-shadow-lg">
            Dashboard
          </h2>
        </div>
        <nav className="flex flex-col w-full space-y-3">
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-lg font-medium tracking-wide ${
              activeSection === "Info"
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
                : "hover:bg-blue-900/60 hover:text-white text-blue-200"
            }`}
            onClick={() => setActiveSection("Info")}
          >
            <FiHome className="text-xl" /> Info
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-lg font-medium tracking-wide ${
              activeSection === "sell"
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
                : "hover:bg-blue-900/60 hover:text-white text-blue-200"
            }`}
            onClick={() => setActiveSection("sell")}
          >
            <FiShoppingCart className="text-xl" /> Sell Product
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-lg font-medium tracking-wide ${
              activeSection === "myProducts"
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
                : "hover:bg-blue-900/60 hover:text-white text-blue-200"
            }`}
            onClick={() => setActiveSection("myProducts")}
          >
            <FiBox className="text-xl" /> My Products
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-lg font-medium tracking-wide ${
              activeSection === "bought"
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
                : "hover:bg-blue-900/60 hover:text-white text-blue-200"
            }`}
            onClick={() => setActiveSection("bought")}
          >
            <FiShoppingBag className="text-xl" /> My Bought Products
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-lg font-medium tracking-wide ${
              activeSection === "transactions"
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
                : "hover:bg-blue-900/60 hover:text-white text-blue-200"
            }`}
            onClick={() => setActiveSection("transactions")}
          >
            <FiCreditCard className="text-xl" /> Transaction History
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-lg font-medium tracking-wide ${
              activeSection === "wishlist"
                ? "bg-gradient-to-r from-pink-900 via-pink-800 to-gray-900 text-white shadow-xl ring-2 ring-pink-700"
                : "hover:bg-pink-900/60 hover:text-white text-pink-200"
            }`}
            onClick={() => setActiveSection("wishlist")}
          >
            <FiHeart className="text-xl" /> Wishlist
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-lg font-medium tracking-wide ${
              activeSection === "notifications"
                ? "bg-gradient-to-r from-yellow-900 via-yellow-800 to-gray-900 text-white shadow-xl ring-2 ring-yellow-700"
                : "hover:bg-yellow-900/60 hover:text-white text-yellow-200"
            }`}
            onClick={() => setActiveSection("notifications")}
          >
            <FiBell className="text-xl" /> Notifications
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-lg font-medium tracking-wide ${
              activeSection === "logout"
                ? "bg-gradient-to-r from-red-900 via-red-800 to-gray-900 text-white shadow-xl ring-2 ring-red-700"
                : "hover:bg-red-900/60 hover:text-white text-red-200"
            }`}
            onClick={() => setActiveSection("logout")}
          >
            <FiLogOut className="text-xl" /> Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-80 p-12 flex flex-col items-center justify-center">
        <div className="bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-gray-800/90 rounded-3xl shadow-2xl p-10 w-full max-w-3xl min-h-[350px] border border-gray-800/80 ring-1 ring-blue-900/40">
          {renderMainContent()}
        </div>
        <div className="mt-10 w-full max-w-2xl bg-gradient-to-br from-gray-950/80 via-gray-900/80 to-gray-800/80 rounded-2xl shadow-xl p-8 border border-gray-800/70">
          <UploadImage />
        </div>
      </div>
    </div>
  );
}

export default UserDashBoard;
