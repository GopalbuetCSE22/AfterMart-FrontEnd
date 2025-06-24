import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashBoard() {
  // deliveryCompany
  const [deliveryCompany, setDeliveryCompany] = useState([]);
  // product to approve
  const [productsToApprove, setProductsToApprove] = useState([]);
  // user to verify
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
      setProductsToApprove(productsToApprove.filter((u) => u.product_id !== product_id));
    } catch (error) {
      console.error("Error verofying product", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/delivery/showDeliveryCompanyToVerify")
      .then((res) => {
        setDeliveryCompany(res.data);
      });

    axios
      .get("http://localhost:5000/api/products/showProductsToApprove")
      .then((res) => {
        setProductsToApprove(res.data);
      });

    axios
      .get("http://localhost:5000/api/users/showUsersToVerify")
      .then((res) => {
        setUsersToVerify(res.data);
      });
  }, []);

  // Custom card shadow and glass effect
  const cardClass =
    "bg-white/70 rounded-3xl shadow-xl border border-gray-200 backdrop-blur-lg hover:scale-[1.03] transition-transform duration-200 p-8 relative overflow-hidden";
  const tableHeadClass =
    "py-3 px-5 font-semibold uppercase tracking-wide text-xs bg-gradient-to-r from-gray-50 to-gray-100";
  const btnClass =
    "flex items-center gap-2 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-5 py-2 rounded-lg shadow-lg font-semibold transition focus:outline-none focus:ring-2 focus:ring-green-400";
  const sectionTitle =
    "text-2xl font-bold mb-8 flex items-center gap-3 drop-shadow text-gray-800";
  const badgeClass =
    "inline-block w-3 h-3 rounded-full shadow";
  const emptyClass =
    "text-gray-400 text-center py-12 text-lg italic";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-100 to-pink-200 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-6xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 drop-shadow-2xl tracking-tight mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Manage all verification and approval requests at a glance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Delivery Company Verification Requests */}
          <div className={cardClass + " border-blue-200"}>
            <h2 className={sectionTitle + " text-blue-700"}>
              <span className={badgeClass + " bg-gradient-to-br from-blue-400 to-blue-600"}></span>
              Delivery Company Verification
            </h2>
            {deliveryCompany.length === 0 ? (
              <p className={emptyClass}>No requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-base text-left rounded-xl overflow-hidden shadow">
                  <thead>
                    <tr>
                      <th className={tableHeadClass + " text-blue-900"}>
                        Company Name
                      </th>
                      <th className={tableHeadClass + " text-blue-900"}>
                        Trade License
                      </th>
                      <th className={tableHeadClass}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {deliveryCompany.map((company) => (
                      <tr
                        key={company.company_id}
                        className="hover:bg-blue-50/80 transition"
                      >
                        <td className="py-3 px-5 font-medium">{company.company_name}</td>
                        <td className="py-3 px-5">{company.trade_license}</td>
                        <td className="py-3 px-5">
                          <button
                            className={btnClass}
                            onClick={() =>
                              handleVerifyCompany(company.company_id)
                            }
                          >
                            <span className="inline-block align-middle text-lg">✔</span>
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
          <div className={cardClass + " border-green-200"}>
            <h2 className={sectionTitle + " text-green-700"}>
              <span className={badgeClass + " bg-gradient-to-br from-green-400 to-green-600"}></span>
              Product Approval Requests
            </h2>
            {productsToApprove.length === 0 ? (
              <p className={emptyClass}>No requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-base text-left rounded-xl overflow-hidden shadow">
                  <thead>
                    <tr>
                      <th className={tableHeadClass + " text-green-900"}>
                        Product ID
                      </th>
                      <th className={tableHeadClass + " text-green-900"}>
                        Title
                      </th>
                      <th className={tableHeadClass + " text-green-900"}>
                        Price
                      </th>
                      <th className={tableHeadClass}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsToApprove.map((product) => (
                      <tr
                        key={product.product_id}
                        className="hover:bg-green-50/80 transition"
                      >
                        <td className="py-3 px-5 font-medium">{product.product_id}</td>
                        <td className="py-3 px-5">{product.title}</td>
                        <td className="py-3 px-5">${product.price}</td>
                        <td className="py-3 px-5">
                          <button
                            className={btnClass.replace(
                              "from-green-400 to-green-600",
                              "from-blue-400 to-blue-600"
                            )}
                            onClick={() =>
                              handleVerifyProduct(product.product_id)
                            }
                          >
                            <span className="inline-block align-middle text-lg">✔</span>
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
          <div className={cardClass + " border-purple-200"}>
            <h2 className={sectionTitle + " text-purple-700"}>
              <span className={badgeClass + " bg-gradient-to-br from-purple-400 to-purple-600"}></span>
              User Verification Requests
            </h2>
            {usersToVerify.length === 0 ? (
              <p className={emptyClass}>No requests yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-base text-left rounded-xl overflow-hidden shadow">
                  <thead>
                    <tr>
                      <th className={tableHeadClass + " text-purple-900"}>
                        User Name
                      </th>
                      <th className={tableHeadClass + " text-purple-900"}>
                        Email
                      </th>
                      <th className={tableHeadClass + " text-purple-900"}>
                        Phone
                      </th>
                      <th className={tableHeadClass}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersToVerify.map((user) => (
                      <tr
                        key={user.user_id}
                        className="hover:bg-purple-50/80 transition"
                      >
                        <td className="py-3 px-5 font-medium">{user.name}</td>
                        <td className="py-3 px-5">{user.email}</td>
                        <td className="py-3 px-5">{user.phone}</td>
                        <td className="py-3 px-5">
                          <button
                            className={btnClass}
                            onClick={() => handleVerifyUser(user.user_id)}
                          >
                            <span className="inline-block align-middle text-lg">✔</span>
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
    </div>
  );
}

export default AdminDashBoard;
