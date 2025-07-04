import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiUsers,
  FiPackage,
  FiCheckCircle,
  FiTruck,
  FiUserCheck,
  FiBox,
  FiDollarSign,
} from "react-icons/fi";
import { MdVerifiedUser } from "react-icons/md";

// import Header from "../../components/Header";
import Footer from "../../components/Footer";
function AdminDashBoard() {
  const [deliveryCompany, setDeliveryCompany] = useState([]);
  const [productsToApprove, setProductsToApprove] = useState([]);
  const [usersToVerify, setUsersToVerify] = useState([]);

  const adminId = localStorage.getItem("admin_id");

  const handleVerifyCompany = async (companyId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/delivery/verifyDeliveryCompany/${companyId}`,
        { admin_id: adminId }
      );
      setDeliveryCompany(
        deliveryCompany.filter((c) => c.company_id !== companyId)
      );
    } catch (error) {
      console.error("Error verifying company:", error);
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

  const handleVerifyProduct = async (product_id) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/products/verifyProduct/${product_id}`
      );
      setProductsToApprove(
        productsToApprove.filter((u) => u.product_id !== product_id)
      );
    } catch (error) {
      console.error("Error verifying product", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/delivery/showDeliveryCompanyToVerify")
      .then((res) => setDeliveryCompany(res.data));

    axios
      .get("http://localhost:5000/api/products/showProductsToApprove")
      .then((res) => setProductsToApprove(res.data));

    axios
      .get("http://localhost:5000/api/users/showUsersToVerify")
      .then((res) => setUsersToVerify(res.data));
  }, []);

  // DARK THEME CLASSES
  const cardClass =
    "bg-gradient-to-br from-[#23243a] via-[#18192b] to-[#1a1b2d] rounded-3xl shadow-2xl border border-[#2a2b45] hover:scale-[1.03] transition-transform duration-200 p-8 relative overflow-hidden";
  const tableHeadClass =
    "py-3 px-5 font-semibold uppercase tracking-wide text-xs bg-gradient-to-r from-[#23243a] to-[#18192b] text-[#b3b8d4]";
  const btnClass =
    "flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-2 rounded-lg shadow-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const sectionTitle =
    "text-2xl font-bold mb-8 flex items-center gap-3 drop-shadow text-[#e0e7ff]";
  const emptyClass =
    "text-[#6b7280] text-center py-12 text-lg italic";
  const inputClass =
    "bg-[#23243a] border border-[#2a2b45] text-[#e0e7ff] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18192b] via-[#23243a] to-[#1a1b2d] p-8">
      {/* <Header /> */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-2xl tracking-tight mb-2 flex items-center gap-4">
            <MdVerifiedUser className="text-indigo-400" size={48} />
            Admin Dashboard
          </h1>
          <p className="text-lg text-[#b3b8d4] font-medium">
            Manage all verification and approval requests at a glance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Delivery Company Verification Requests */}
          <div className={cardClass + " border-indigo-700"}>
            <h2 className={sectionTitle + " text-indigo-300"}>
              <FiTruck className="text-indigo-400" size={28} />
              Delivery Company Verification
            </h2>
            {deliveryCompany.length === 0 ? (
              <p className={emptyClass}>No requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-base text-left rounded-xl overflow-hidden shadow">
                  <thead>
                    <tr>
                      <th className={tableHeadClass + " flex items-center gap-2"}>
                        <FiUsers /> Company Name
                      </th>
                      <th className={tableHeadClass + " flex items-center gap-2"}>
                        <FiCheckCircle /> Trade License
                      </th>
                      <th className={tableHeadClass}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryCompany.map((company) => (
                      <tr
                        key={company.company_id}
                        className="hover:bg-indigo-900/30 transition"
                      >
                        <td className="py-3 px-5 font-medium text-[#e0e7ff]">{company.company_name}</td>
                        <td className="py-3 px-5 text-[#b3b8d4]">{company.trade_license}</td>
                        <td className="py-3 px-5">
                          <button
                            className={btnClass}
                            onClick={() =>
                              handleVerifyCompany(company.company_id)
                            }
                          >
                            <FiCheckCircle className="text-white" />
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Product Approval Requests */}
          <div className={cardClass + " border-green-700"}>
            <h2 className={sectionTitle + " text-green-300"}>
              <FiBox className="text-green-400" size={28} />
              Product Approval Requests
            </h2>
            {productsToApprove.length === 0 ? (
              <p className={emptyClass}>No requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-base text-left rounded-xl overflow-hidden shadow">
                  <thead>
                    <tr>
                      <th className={tableHeadClass + " flex items-center gap-2"}>
                        <FiPackage /> Product ID
                      </th>
                      <th className={tableHeadClass + " flex items-center gap-2"}>
                        <FiBox /> Title
                      </th>
                      <th className={tableHeadClass + " flex items-center gap-2"}>
                        <FiDollarSign /> Price
                      </th>
                      <th className={tableHeadClass}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsToApprove.map((product) => (
                      <tr
                        key={product.product_id}
                        className="hover:bg-green-900/30 transition"
                      >
                        <td className="py-3 px-5 font-medium text-[#e0e7ff]">{product.product_id}</td>
                        <td className="py-3 px-5 text-[#b3b8d4]">{product.title}</td>
                        <td className="py-3 px-5 text-[#b3b8d4]">${product.price}</td>
                        <td className="py-3 px-5">
                          <button
                            className={btnClass.replace(
                              "from-indigo-500 to-purple-600",
                              "from-green-500 to-green-700"
                            )}
                            onClick={() =>
                              handleVerifyProduct(product.product_id)
                            }
                          >
                            <FiCheckCircle className="text-white" />
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* User Verification Requests */}
          <div className={cardClass + " border-purple-700"}>
            <h2 className={sectionTitle + " text-purple-300"}>
              <FiUserCheck className="text-purple-400" size={28} />
              User Verification Requests
            </h2>
            {usersToVerify.length === 0 ? (
              <p className={emptyClass}>No requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-base text-left rounded-xl overflow-hidden shadow">
                  <thead>
                    <tr>
                      <th className={tableHeadClass + " flex items-center gap-2"}>
                        <FiUsers /> User Name
                      </th>
                      <th className={tableHeadClass + " flex items-center gap-2"}>
                        <FiUserCheck /> Email
                      </th>
                      <th className={tableHeadClass + " flex items-center gap-2"}>
                        <FiUserCheck /> Phone
                      </th>
                      <th className={tableHeadClass}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersToVerify.map((user) => (
                      <tr
                        key={user.user_id}
                        className="hover:bg-purple-900/30 transition"
                      >
                        <td className="py-3 px-5 font-medium text-[#e0e7ff]">{user.name}</td>
                        <td className="py-3 px-5 text-[#b3b8d4]">{user.email}</td>
                        <td className="py-3 px-5 text-[#b3b8d4]">{user.phone}</td>
                        <td className="py-3 px-5">
                          <button
                            className={btnClass.replace(
                              "from-indigo-500 to-purple-600",
                              "from-purple-500 to-pink-600"
                            )}
                            onClick={() => handleVerifyUser(user.user_id)}
                          >
                            <FiCheckCircle className="text-white" />
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default AdminDashBoard;