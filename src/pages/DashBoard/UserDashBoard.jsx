import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import UploadImage from "../../components/UploadImage";

function UserDashBoard() {
  const [activeSection, setActiveSection] = useState("Info");
  const [userPhoto, setUserPhoto] = useState("");
  const navigate = useNavigate();

  const handleUserData = () => {};

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    console.log(userId);

    if (userId) {
      fetch(`http://localhost:5000/api/uploadImage/getProfilePic/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data[0].profile_picture);
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
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              Welcome to the Main Area
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              This is your dashboard home.
            </p>
          </>
        );
      case "sell":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              Sell Product
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Here you can list a new product for sale.
            </p>
          </>
        );
      case "myProducts":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              My Products
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Here are your listed products.
            </p>
          </>
        );
      case "bought":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              My Bought Products
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Here are the products you have purchased.
            </p>
          </>
        );
      case "transactions":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              Transaction History
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Here is your transaction history.
            </p>
          </>
        );
      case "logout":
        return (
          <>
            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              Logged Out
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              You have been logged out.
            </p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
        {/* Sidebar */}
        <div className="w-72 bg-gradient-to-b from-blue-700 to-blue-900 text-white p-6 space-y-6 fixed h-full shadow-2xl rounded-r-3xl flex flex-col items-center">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-blue-400 flex items-center justify-center mb-2 shadow-lg border-4 border-blue-300 overflow-hidden">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt="User"
                  className="w-full h-full object-cover"
                  style={{ maxWidth: '80px', maxHeight: '80px' }}
                />
              ) : (
                <span className="text-3xl font-bold">U</span>
              )}
            </div>
            <h2 className="text-2xl font-bold tracking-wide">Dashboard</h2>
          </div>
          <nav className="flex flex-col w-full space-y-3">
            <button
              className={`transition-all duration-200 text-left px-4 py-3 rounded-lg font-medium tracking-wide ${
                activeSection === "Info"
                  ? "bg-white text-blue-800 shadow-lg"
                  : "hover:bg-blue-800 hover:text-white"
              }`}
              onClick={() => setActiveSection("Info")}
            >
              <span className="mr-2">🏠</span> Info
            </button>
            <button
              className={`transition-all duration-200 text-left px-4 py-3 rounded-lg font-medium tracking-wide ${
                activeSection === "sell"
                  ? "bg-white text-blue-800 shadow-lg"
                  : "hover:bg-blue-800 hover:text-white"
              }`}
              onClick={() => setActiveSection("sell")}
            >
              <span className="mr-2">🛒</span> Sell Product
            </button>
            <button
              className={`transition-all duration-200 text-left px-4 py-3 rounded-lg font-medium tracking-wide ${
                activeSection === "myProducts"
                  ? "bg-white text-blue-800 shadow-lg"
                  : "hover:bg-blue-800 hover:text-white"
              }`}
              onClick={() => setActiveSection("myProducts")}
            >
              <span className="mr-2">📦</span> My Products
            </button>
            <button
              className={`transition-all duration-200 text-left px-4 py-3 rounded-lg font-medium tracking-wide ${
                activeSection === "bought"
                  ? "bg-white text-blue-800 shadow-lg"
                  : "hover:bg-blue-800 hover:text-white"
              }`}
              onClick={() => setActiveSection("bought")}
            >
              <span className="mr-2">🛍️</span> My Bought Products
            </button>
            <button
              className={`transition-all duration-200 text-left px-4 py-3 rounded-lg font-medium tracking-wide ${
                activeSection === "transactions"
                  ? "bg-white text-blue-800 shadow-lg"
                  : "hover:bg-blue-800 hover:text-white"
              }`}
              onClick={() => setActiveSection("transactions")}
            >
              <span className="mr-2">💳</span> Transaction History
            </button>
            <button
              className={`transition-all duration-200 text-left px-4 py-3 rounded-lg font-medium tracking-wide ${
                activeSection === "logout"
                  ? "bg-red-600 text-white shadow-lg"
                  : "hover:bg-red-500 hover:text-white"
              }`}
              onClick={() => setActiveSection("logout")}
            >
              <span className="mr-2">🚪</span> Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-72 p-12 flex flex-col items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl min-h-[350px]">
            {renderMainContent()}
          </div>
          <div className="mt-10 w-full max-w-2xl">
            <UploadImage />
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default UserDashBoard;
