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

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/delivery/showDeliveryCompanyToVerify")
      .then((res) => {
        setDeliveryCompany(res.data);
      });

    axios.get("http://localhost:5000/showProductsToApprove").then((res) => {
      setProductsToApprove(res.data);
    });

    axios
      .get("http://localhost:5000/api/users/showUsersToVerify")
      .then((res) => {
        setUsersToVerify(res.data);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800 tracking-tight drop-shadow">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Delivery Company Verification Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <h2 className="text-2xl font-semibold mb-6 text-blue-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
            Delivery Company Verification
          </h2>
          {deliveryCompany.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="py-2 px-4 font-medium text-blue-900">
                      Company Name
                    </th>
                    <th className="py-2 px-4 font-medium text-blue-900">
                      Trade License
                    </th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryCompany.map((company) => (
                    <tr
                      key={company.company_id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="py-2 px-4">{company.company_name}</td>
                      <td className="py-2 px-4">{company.trade_license}</td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow transition"
                          onClick={() =>
                            handleVerifyCompany(company.company_id)
                          }
                        >
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
        <br />
        {/* Product Approval Requests */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <h2 className="text-2xl font-semibold mb-6 text-green-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            Product Approval Requests
          </h2>
          {productsToApprove.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-green-50">
                    <th className="py-2 px-4 font-medium text-green-900">
                      Product Name
                    </th>
                    <th className="py-2 px-4 font-medium text-green-900">
                      Seller
                    </th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {productsToApprove.map((product) => (
                    <tr
                      key={product.product_id}
                      className="hover:bg-green-50 transition"
                    >
                      <td className="py-2 px-4">{product.product_name}</td>
                      <td className="py-2 px-4">{product.seller_name}</td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded shadow transition"
                          // Add your approve handler here
                        >
                          Approve
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
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
          <h2 className="text-2xl font-semibold mb-6 text-purple-700 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full"></span>
            User Verification Requests
          </h2>
          {usersToVerify.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No requests yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="bg-purple-50">
                    <th className="py-2 px-4 font-medium text-purple-900">
                      User Name
                    </th>
                    <th className="py-2 px-4 font-medium text-purple-900">
                      Email
                    </th>
                    <th className="py-2 px-4 font-medium text-purple-900">
                      Phone
                    </th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {usersToVerify.map((user) => (
                    <tr
                      key={user.user_id}
                      className="hover:bg-purple-50 transition"
                    >
                      <td className="py-2 px-4">{user.name}</td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4">{user.phone}</td>
                      <td className="py-2 px-4">
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded shadow transition"
                          onClick={() => handleVerifyUser(user.user_id)}
                        >
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
  );
}

export default AdminDashBoard;
