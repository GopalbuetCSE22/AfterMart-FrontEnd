import React, { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Navigate, useNavigate } from "react-router-dom";
import UploadImage from "../../components/UploadImage";
function UserDashBoard() {
  const [activeSection, setActiveSection] = useState("Info");

  const navigate = useNavigate();
  // You can extract these into separate components if needed
  const handleUserData = () => {
    
  };
  const renderMainContent = () => {
    switch (activeSection) {
      case "Info":
        () => {
          handleUserData;
        };
        return (
          <>
            <h1 className="text-2xl font-bold">Welcome to the Main Area</h1>
            <p className="mt-4">This is your dashboard home.</p>
          </>
        );
      case "sell":
        return (
          <>
            <h1 className="text-2xl font-bold">Sell Product</h1>
            <p className="mt-4">Here you can list a new product for sale.</p>
          </>
        );
      case "myProducts":
        return (
          <>
            <h1 className="text-2xl font-bold">My Products</h1>
            <p className="mt-4">Here are your listed products.</p>
          </>
        );
      case "bought":
        return (
          <>
            <h1 className="text-2xl font-bold">My Bought Products</h1>
            <p className="mt-4">Here are the products you have purchased.</p>
          </>
        );
      case "transactions":
        return (
          <>
            <h1 className="text-2xl font-bold">Transaction History</h1>
            <p className="mt-4">Here is your transaction history.</p>
          </>
        );
      case "logout":
        // Implement logout logic here
        return (
          <>
            <h1 className="text-2xl font-bold">Logged Out</h1>
            <p className="mt-4">You have been logged out.</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* <Header /> */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white p-4 space-y-4 fixed h-full">
          <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          <nav className="flex flex-col space-y-2">
            <button
              className={`text-left hover:bg-gray-700 px-3 py-2 rounded ${
                activeSection === "home" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveSection("Info")}
            >
              Info
            </button>
            <button
              className={`text-left hover:bg-gray-700 px-3 py-2 rounded ${
                activeSection === "sell" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveSection("sell")}
            >
              Sell Product
            </button>
            <button
              className={`text-left hover:bg-gray-700 px-3 py-2 rounded ${
                activeSection === "myProducts" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveSection("myProducts")}
            >
              My Products
            </button>
            <button
              className={`text-left hover:bg-gray-700 px-3 py-2 rounded ${
                activeSection === "bought" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveSection("bought")}
            >
              My bought product
            </button>
            <button
              className={`text-left hover:bg-gray-700 px-3 py-2 rounded ${
                activeSection === "transactions" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveSection("transactions")}
            >
              Transaction History
            </button>
            <button
              className={`text-left hover:bg-gray-700 px-3 py-2 rounded ${
                activeSection === "logout" ? "bg-gray-700" : ""
              }`}
              onClick={() => setActiveSection("logout")}
            >
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-8">{renderMainContent()}</div>
      </div>
      <div>
        <UploadImage />
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default UserDashBoard;
