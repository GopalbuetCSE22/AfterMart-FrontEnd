import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiTruck,
  FiBox,
  FiUserCheck,
  FiUsers,
  FiCheckCircle,
  FiPackage,
  FiDollarSign,
} from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";
import Footer from "../../components/Footer";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("delivery");
  const [deliveryCompany, setDeliveryCompany] = useState([]);
  const [productsToApprove, setProductsToApprove] = useState([]);
  const [usersToVerify, setUsersToVerify] = useState([]);

  const adminId = localStorage.getItem("admin_id");

  useEffect(() => {
    axios.get("http://localhost:5000/api/delivery/showDeliveryCompanyToVerify")
      .then((res) => setDeliveryCompany(res.data));
    axios.get("http://localhost:5000/api/products/showProductsToApprove")
      .then((res) => setProductsToApprove(res.data));
    axios.get("http://localhost:5000/api/users/showUsersToVerify")
      .then((res) => setUsersToVerify(res.data));
  }, []);

  const handleVerifyCompany = async (companyId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/delivery/verifyDeliveryCompany/${companyId}`,
        { admin_id: adminId }
      );
      setDeliveryCompany(deliveryCompany.filter((c) => c.company_id !== companyId));
    } catch (error) {
      console.error("Error verifying company:", error);
    }
  };

  const handleVerifyProduct = async (productId) => {
    try {
      await axios.patch(`http://localhost:5000/api/products/verifyProduct/${productId}`);
      setProductsToApprove(productsToApprove.filter((p) => p.product_id !== productId));
    } catch (error) {
      console.error("Error verifying product:", error);
    }
  };

  const handleVerifyUser = async (userId) => {
    try {
      await axios.patch(`http://localhost:5000/api/users/verifyUser/${userId}`);
      setUsersToVerify(usersToVerify.filter((u) => u.user_id !== userId));
    } catch (error) {
      console.error("Error verifying user:", error);
    }
  };

  const tabClass = (tab) =>
    `px-4 py-2 rounded-t-lg font-semibold text-sm transition duration-200 ${activeTab === tab
      ? "bg-indigo-700 text-white shadow-inner"
      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  const sectionClass =
    "bg-gradient-to-br from-[#23243a] via-[#18192b] to-[#1a1b2d] p-6 rounded-b-xl shadow-xl border border-[#2a2b45]";

  const tableHeadClass =
    "text-left text-slate-300 text-sm font-semibold px-4 py-2 border-b border-slate-600";

  const btnClass =
    "flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-200";

  const renderDeliveryCompanies = () => (
    <div className={sectionClass}>
      {deliveryCompany.length === 0 ? (
        <p className="text-slate-400 text-center py-10 italic">No delivery company requests to verify.</p>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className={tableHeadClass}><FiUsers className="inline" /> Company Name</th>
              <th className={tableHeadClass}><FiCheckCircle className="inline" /> Trade License</th>
              <th className={tableHeadClass}></th>
            </tr>
          </thead>
          <tbody>
            {deliveryCompany.map((company) => (
              <tr
                key={company.company_id}
                className="group hover:bg-slate-700 hover:border-l-4 hover:border-indigo-500 transition duration-200"
              >
                <td className="px-4 py-3 text-white">{company.company_name}</td>
                <td className="px-4 py-3 text-slate-300">{company.trade_license}</td>
                <td className="px-4 py-3">
                  <button className={btnClass} onClick={() => handleVerifyCompany(company.company_id)}>
                    <FiCheckCircle className="text-white" /> Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderProducts = () => (
    <div className={sectionClass}>
      {productsToApprove.length === 0 ? (
        <p className="text-slate-400 text-center py-10 italic">No product approval requests.</p>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className={tableHeadClass}><FiPackage className="inline" /> Product ID</th>
              <th className={tableHeadClass}><FiBox className="inline" /> Title</th>
              <th className={tableHeadClass}><FiDollarSign className="inline" /> Price</th>
              <th className={tableHeadClass}></th>
            </tr>
          </thead>
          <tbody>
            {productsToApprove.map((product) => (
              <tr
                key={product.product_id}
                className="group hover:bg-slate-700 hover:border-l-4 hover:border-green-500 transition duration-200"
              >
                <td className="px-4 py-3 text-white">{product.product_id}</td>
                <td className="px-4 py-3 text-slate-300">{product.title}</td>
                <td className="px-4 py-3 text-slate-300">৳ {product.price}</td>
                <td className="px-4 py-3">
                  <button className={btnClass} onClick={() => handleVerifyProduct(product.product_id)}>
                    <FiCheckCircle className="text-white" /> Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderUsers = () => (
    <div className={sectionClass}>
      {usersToVerify.length === 0 ? (
        <p className="text-slate-400 text-center py-10 italic">No user verification requests.</p>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className={tableHeadClass}><FiUsers className="inline" /> Name</th>
              <th className={tableHeadClass}><FiUserCheck className="inline" /> Email</th>
              <th className={tableHeadClass}><FiUserCheck className="inline" /> Phone</th>
              <th className={tableHeadClass}></th>
            </tr>
          </thead>
          <tbody>
            {usersToVerify.map((user) => (
              <tr
                key={user.user_id}
                className="group hover:bg-slate-700 hover:border-l-4 hover:border-purple-500 transition duration-200"
              >
                <td className="px-4 py-3 text-white">{user.name}</td>
                <td className="px-4 py-3 text-slate-300">{user.email}</td>
                <td className="px-4 py-3 text-slate-300">{user.phone}</td>
                <td className="px-4 py-3">
                  <button className={btnClass} onClick={() => handleVerifyUser(user.user_id)}>
                    <FiCheckCircle className="text-white" /> Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18192b] via-[#23243a] to-[#1a1b2d] text-white pb-20">
      {/* Title */}
      <div className="text-center py-10">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text flex justify-center items-center gap-3">
          <MdVerifiedUser size={40} /> Admin Dashboard
        </h1>
        <p className="text-slate-400 mt-2">Manage all verifications with ease.</p>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex space-x-3 border-b border-slate-700 mb-6">
          <button className={tabClass("delivery")} onClick={() => setActiveTab("delivery")}>
            Delivery Companies
          </button>
          <button className={tabClass("products")} onClick={() => setActiveTab("products")}>
            Product Approvals
          </button>
          <button className={tabClass("users")} onClick={() => setActiveTab("users")}>
            User Verifications
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "delivery" && renderDeliveryCompanies()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "users" && renderUsers()}
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
