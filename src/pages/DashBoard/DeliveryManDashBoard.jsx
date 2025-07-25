import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiStar,
  FiUser,
  FiMail,
  FiTruck,
  FiMapPin,
  FiBox,
  FiLock,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
function StarRating({ rating }) {
  const safeRating = typeof rating === "number" && !isNaN(rating) ? rating : 0;
  const fullStars = Math.floor(safeRating);
  const halfStar = safeRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FiStar key={"full" + i} className="text-yellow-400 fill-yellow-400" />
      ))}
      {halfStar && (
        <FiStar className="text-yellow-400" style={{ fill: "url(#half)" }}>
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </FiStar>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <FiStar key={"empty" + i} className="text-gray-600" />
      ))}
      <span className="ml-2 text-yellow-300 font-semibold">
        {safeRating.toFixed(1)}
      </span>
    </div>
  );
}

function DeliveryManDashBoard() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  useEffect(() => {
    const deliveryman_id = localStorage.getItem("deliveryman_id");
    if (!deliveryman_id) {
      alert("Deliveryman ID not found. Please log in again.");
      return;
    }
    // Fetch profile
    axios
      .get(`http://localhost:5000/api/deliveryman/profile/${deliveryman_id}`)
      .then((res) => {
        setProfile(res.data);
        setLoadingProfile(false);
      })
      .catch(() => setLoadingProfile(false));
    // Fetch orders
    axios
      .get(`http://localhost:5000/api/deliveryman/orders/${deliveryman_id}`)
      .then((res) => {
        setOrders(res.data);
        setLoadingOrders(false);
      })
      .catch(() => setLoadingOrders(false));
  }, []);

  // Accept order handler
  const handleAcceptOrder = async (order, idx) => {
    try {
      const deliveryman_id = localStorage.getItem("deliveryman_id");
      if (!deliveryman_id) {
        alert("Deliveryman ID not found.");
        navigate("/login");
        return;
      }
      if (!order.shipment_id) {
        alert("Shipment ID not found for this order.");
        return;
      }
      await axios.post(`http://localhost:5000/api/deliveryman/acceptshipment`, {
        shipmentId: order.shipment_id,
        deliverymanId: deliveryman_id,
      });
      // Optionally update UI
      const updatedOrders = [...orders];
      updatedOrders[idx].status = "ACCEPTED";
      updatedOrders[idx].deliveryman_id = deliveryman_id;
      setOrders(updatedOrders);
      alert("Order accepted!");
    } catch (error) {
      alert("Failed to accept order.");
    }
  };

  // Mark as delivered handler
  const handleDelivered = async (order, idx) => {
    try {
      if (!order.shipment_id) {
        alert("Shipment ID not found for this order.");
        return;
      }
      await axios.patch(
        `http://localhost:5000/api/deliveryman/markdelivered/${order.shipment_id}`
      );
      const updatedOrders = [...orders];
      updatedOrders[idx].status = "Delivered";
      setOrders(updatedOrders);
      alert("Order marked as delivered!");
    } catch (error) {
      alert("Failed to mark as delivered.");
    }
  };

  // Password change handler
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordMsg({ type: "error", text: "All fields are required." });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    setPasswordLoading(true);
    try {
      const deliveryman_id = localStorage.getItem("deliveryman_id");
      await axios.patch(
        `http://localhost:5000/api/deliveryman/changepassword/${deliveryman_id}`,
        {
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        }
      );
      setPasswordMsg({
        type: "success",
        text: "Password changed successfully.",
      });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setPasswordMsg({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to change password. Please try again.",
      });
    } finally {
      setPasswordLoading(false);
    }
  };
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* Profile Section */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 border border-gray-800 flex flex-col md:flex-row gap-8 items-center backdrop-blur-md">
          {loadingProfile ? (
            <div className="text-gray-300">Loading profile...</div>
          ) : profile ? (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg border-4 border-gray-700 overflow-hidden">
                  <FiUser className="text-5xl text-gray-200" />
                </div>
                <StarRating rating={Number(profile.rating_avg) || 0} />
              </div>
              <div className="flex-1 flex flex-col gap-3 text-gray-200">
                <div className="flex items-center gap-2">
                  <FiUser className="text-emerald-400" />
                  <span className="font-semibold">Name:</span> {profile.name}
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-emerald-400" />
                  <span className="font-semibold">Email:</span> {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-emerald-400" />
                  <span className="font-semibold">Vehicle Type:</span>{" "}
                  {profile.vehicle_type}
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-emerald-400" />
                  <span className="font-semibold">Deliveries:</span>{" "}
                  {profile.delivery_count || 0}
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-emerald-400" />
                  <span className="font-semibold">Preferred Area:</span>
                  <span>
                    {profile.division}, {profile.district}, {profile.ward},{" "}
                    {profile.area}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-400">Profile not found.</div>
          )}
        </div>

        {/* Incoming Orders Section */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 border border-gray-800">
          <h2 className="text-2xl font-extrabold mb-6 text-emerald-300 flex items-center gap-2">
            <FiBox className="text-emerald-400" /> Incoming Orders
          </h2>
          {loadingOrders ? (
            <div className="text-gray-300">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-500 text-center">No incoming orders.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-800 rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-gray-800/80">
                    <th className="py-3 px-5 border-b text-emerald-300 font-semibold">
                      Buyer Name
                    </th>
                    <th className="py-3 px-5 border-b text-emerald-300 font-semibold">
                      Total Price
                    </th>
                    <th className="py-3 px-5 border-b text-emerald-300 font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr
                      key={idx}
                      className="bg-gray-900/80 hover:bg-gray-800/60 transition"
                    >
                      <td className="py-3 px-5 border-b text-gray-200">
                        {order.name}
                      </td>
                      <td className="py-3 px-5 border-b text-gray-200">
                        ৳{order.total_price}
                      </td>
                      <td className="py-3 px-5 border-b flex gap-2">
                        <button
                          className={`px-4 py-1 rounded shadow transition font-semibold
                            ${
                              order.status === "Accepted" ||
                              order.deliveryman_id != null
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }
                          `}
                          onClick={() => handleAcceptOrder(order, idx)}
                          disabled={
                            order.status === "ACCEPTED" ||
                            order.deliveryman_id != null ||
                            order.status === "DELIVERED"
                          }
                        >
                          {order.status === "ACCEPTED" ||
                          order.deliveryman_id != null
                            ? "Accepted"
                            : "Accept"}
                        </button>
                        {order.status === "ACCEPTED" &&
                          order.deliveryman_id != null &&
                          order.status !== "DELIVERED" && (
                            <button
                              className="px-4 py-1 rounded shadow bg-emerald-800 hover:bg-emerald-900 text-white font-semibold transition"
                              onClick={() => handleDelivered(order, idx)}
                              disabled={order.status === "DELIVERED"}
                            >
                              {order.status === "DELIVERED"
                                ? "Delivered"
                                : "Mark as Delivered"}
                            </button>
                          )}
                        {order.status === "DELIVERED" && (
                          <span className="px-4 py-1 rounded bg-gray-700 text-emerald-400 font-semibold">
                            Delivered
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Password Change Card */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 border border-gray-800 max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-4 text-emerald-300 flex items-center gap-2">
            <FiLock className="text-emerald-400" /> Change Password
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
            <input
              type="password"
              className="bg-gray-800 text-gray-200 rounded px-4 py-2 border border-gray-700 focus:outline-none focus:border-emerald-500"
              placeholder="Old Password"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData((d) => ({
                  ...d,
                  oldPassword: e.target.value,
                }))
              }
              autoComplete="current-password"
            />
            <input
              type="password"
              className="bg-gray-800 text-gray-200 rounded px-4 py-2 border border-gray-700 focus:outline-none focus:border-emerald-500"
              placeholder="New Password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData((d) => ({
                  ...d,
                  newPassword: e.target.value,
                }))
              }
              autoComplete="new-password"
            />
            <input
              type="password"
              className="bg-gray-800 text-gray-200 rounded px-4 py-2 border border-gray-700 focus:outline-none focus:border-emerald-500"
              placeholder="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData((d) => ({
                  ...d,
                  confirmPassword: e.target.value,
                }))
              }
              autoComplete="new-password"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded px-4 py-2 transition disabled:opacity-60"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </button>
            {passwordMsg && (
              <div
                className={`text-sm mt-2 ${
                  passwordMsg.type === "success"
                    ? "text-emerald-400"
                    : "text-red-400"
                }`}
              >
                {passwordMsg.text}
              </div>
            )}
          </form>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-gray-900 text-red-200 hover:bg-red-900/80 transition font-semibold shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryManDashBoard;
