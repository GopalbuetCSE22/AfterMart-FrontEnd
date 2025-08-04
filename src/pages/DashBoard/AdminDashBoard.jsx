import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Import motion and AnimatePresence
import {
  FiTruck,
  FiBox,
  FiUserCheck,
  FiUsers,
  FiCheckCircle,
  FiPackage,
  FiDollarSign,
  FiLogOut, // Added for logout button
  FiRefreshCw, // Added for refresh button
} from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import Footer from "../../components/Footer";
// Assuming Header exists:
import Header from "../../components/Header"; // Make sure path is correct

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("delivery");
  const [deliveryCompany, setDeliveryCompany] = useState([]);
  const [productsToApprove, setProductsToApprove] = useState([]);
  const [usersToVerify, setUsersToVerify] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  const navigate = useNavigate(); // Moved useNavigate here for proper hook usage

  const adminId = localStorage.getItem("admin_id");

  // Authentication check with useEffect
  useEffect(() => {
    if (!adminId) {
      alert("You are not logged in as an admin. Redirecting to login.");
      navigate("/adminlogin"); // Corrected to adminlogin
      return;
    }
    fetchData(); // Fetch data when component mounts or adminId changes
  }, [adminId, navigate]); // Added navigate to dependency array

  // Function to fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        deliveryRes,
        productsRes,
        usersRes,
      ] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/delivery/showDeliveryCompanyToVerify`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/showProductsToApprove`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/users/showUsersToVerify`),
      ]);
      setDeliveryCompany(deliveryRes.data);
      setProductsToApprove(productsRes.data);
      setUsersToVerify(usersRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCompany = async (companyId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/delivery/verifyDeliveryCompany/${companyId}`,
        { admin_id: adminId }
      );
      setDeliveryCompany(
        deliveryCompany.filter((c) => c.company_id !== companyId)
      );
      // Optional: Show a success toast/notification here
    } catch (error) {
      console.error("Error verifying company:", error);
      alert("Failed to verify company. Please try again.");
    }
  };

  const handleVerifyProduct = async (productId) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/products/verifyProduct/${productId}`
      );
      setProductsToApprove(
        productsToApprove.filter((p) => p.product_id !== productId)
      );
      // Optional: Show a success toast/notification here
    } catch (error) {
      console.error("Error verifying product:", error);
      alert("Failed to verify product. Please try again.");
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/api/users/verifyUser/${userId}`);
      setUsersToVerify(usersToVerify.filter((u) => u.user_id !== userId));
      // Optional: Show a success toast/notification here
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("Failed to verify user. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/adminlogin"); // Redirect to admin login after logout
  };

  // --- TailwindCSS Class Definitions ---
  const tabClass = (tab) =>
    `flex-1 px-4 py-3 text-center rounded-t-xl font-semibold text-lg transition duration-300 transform border-b-2
    ${activeTab === tab
      ? "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-lg border-indigo-500"
      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border-transparent"
    }`;

  const sectionClass =
    "bg-gradient-to-br from-[#23243a] via-[#18192b] to-[#1a1b2d] p-8 rounded-b-xl shadow-2xl border border-[#2a2b45] min-h-[400px] flex flex-col"; // Added flex-col for content centering

  const tableHeadClass =
    "text-left text-slate-300 text-sm md:text-base font-semibold px-4 py-3 border-b border-slate-600 uppercase tracking-wider";

  const btnClass =
    "flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75";

  // --- Animation Variants for Content ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // --- Render Functions for Tabs ---
  const renderTable = (data, columns, verifyHandler, emptyMessage, borderColorClass) => (
    <motion.div
      key={activeTab} // Key changes to trigger exit/enter animations
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={sectionClass}
    >
      {loading ? (
        <p className="text-slate-400 text-center py-10 italic">Loading data...</p>
      ) : error ? (
        <p className="text-red-400 text-center py-10 italic">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-slate-400 text-center py-10 italic">
          {emptyMessage}
        </p>
      ) : (
        <div className="overflow-x-auto"> {/* Added for responsiveness */}
          <table className="w-full table-auto border-separate border-spacing-y-2">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className={tableHeadClass}>
                    {col.icon && <span className="inline-block mr-2">{col.icon}</span>}
                    {col.header}
                  </th>
                ))}
                <th className={tableHeadClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout"> {/* Animate rows leaving/entering */}
                {data.map((item) => (
                  <motion.tr
                    key={item.id || item.company_id || item.product_id || item.user_id} // Unique key
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden" // Hides smoothly on removal
                    className={`bg-slate-800/60 hover:bg-slate-700/80 rounded-lg shadow-sm transition duration-200 group border-l-4 ${borderColorClass}`}
                  >
                    {columns.map((col, index) => (
                      <td key={index} className="px-4 py-4 text-white text-sm">
                        {col.accessor(item)}
                      </td>
                    ))}
                    <td className="px-4 py-4">
                      <button
                        className={btnClass}
                        onClick={() => verifyHandler(item.id || item.company_id || item.product_id || item.user_id)}
                      >
                        <FiCheckCircle className="text-white" /> Verify
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#18192b] via-[#23243a] to-[#1a1b2d] text-white">
      {/* Optional: Header component at the very top if desired */}
      {/* <Header /> */}

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16 relative z-10"> {/* Adjusted padding */}
        {/* Admin Dashboard Title */}
        <div className="text-center mb-10 mt-8">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text leading-tight drop-shadow-xl flex justify-center items-center gap-4">
            <MdVerifiedUser size={50} /> Admin Dashboard
          </h1>
          <p className="text-slate-400 mt-4 text-lg">
            Effortlessly manage pending verifications across the platform.
          </p>
        </div>

        {/* Refresh and Logout Buttons */}
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading} // Disable during loading
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} /> {loading ? "Refreshing..." : "Refresh Data"}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 transition-all font-semibold shadow-md hover:shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <FiLogOut /> Logout
          </button>
        </div>

        {/* Tabs Container */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-6">
          <button
            className={tabClass("delivery")}
            onClick={() => setActiveTab("delivery")}
          >
            <FiTruck className="inline mr-2" /> Delivery Companies ({deliveryCompany.length})
          </button>
          <button
            className={tabClass("products")}
            onClick={() => setActiveTab("products")}
          >
            <FiPackage className="inline mr-2" /> Product Approvals ({productsToApprove.length})
          </button>
          <button
            className={tabClass("users")}
            onClick={() => setActiveTab("users")}
          >
            <FiUsers className="inline mr-2" /> User Verifications ({usersToVerify.length})
          </button>
        </div>

        {/* Tab Content with AnimatePresence */}
        <AnimatePresence mode="wait">
          {activeTab === "delivery" &&
            renderTable(
              deliveryCompany,
              [
                { header: "Company Name", icon: <FiUsers />, accessor: (item) => item.company_name },
                { header: "Trade License", icon: <FiCheckCircle />, accessor: (item) => item.trade_license },
              ],
              handleVerifyCompany,
              "No delivery company requests to verify.",
              "border-indigo-500"
            )}
          {activeTab === "products" &&
            renderTable(
              productsToApprove,
              [
                { header: "Product ID", icon: <FiPackage />, accessor: (item) => item.product_id },
                { header: "Title", icon: <FiBox />, accessor: (item) => item.title },
                { header: "Price", icon: <FiDollarSign />, accessor: (item) => `৳ ${item.price}` },
              ],
              handleVerifyProduct,
              "No product approval requests.",
              "border-green-500"
            )}
          {activeTab === "users" &&
            renderTable(
              usersToVerify,
              [
                { header: "Name", icon: <FiUsers />, accessor: (item) => item.name },
                { header: "Email", icon: <FiUserCheck />, accessor: (item) => item.email },
                { header: "Phone", icon: <FiUserCheck />, accessor: (item) => item.phone },
              ],
              handleVerifyUser,
              "No user verification requests.",
              "border-purple-500"
            )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;