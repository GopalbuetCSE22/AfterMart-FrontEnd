// DeliveryManDashBoard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FiStar,
  FiUser,
  FiMail,
  FiPhone,
  FiTruck,
  FiMapPin,
  FiBox,     // For Available Orders
  FiLock,
  FiArchive, // For Delivered Shipments
  FiClock,   // For Under Shipment Orders
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

// StarRating component remains unchanged
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
  const [availableOrders, setAvailableOrders] = useState([]);
  const [underShipmentOrders, setUnderShipmentOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingAvailable, setLoadingAvailable] = useState(true);
  const [loadingUnderShipment, setLoadingUnderShipment] = useState(true);
  const [loadingDelivered, setLoadingDelivered] = useState(true);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState(null);

  const navigate = useNavigate();

  // Helper function to fetch all dashboard data
  const fetchDeliveryManData = async () => {
    const deliveryman_id = localStorage.getItem("deliveryman_id");
    if (!deliveryman_id) {
      alert("Deliveryman ID not found. Please log in again.");
      navigate("/login");
      return;
    }

    // Fetch profile
    setLoadingProfile(true);
    try {
      const profileRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/deliveryman/profile/${deliveryman_id}`
      );
      const rawProfileData = profileRes.data;

      // FIX: De-duplicate preferred_areas before setting the profile state
      if (rawProfileData && rawProfileData.preferred_areas) {
        const uniquePreferredAreas = Array.from(
          new Map(
            rawProfileData.preferred_areas.map((area) => [
              `${area.division}-${area.district}-${area.ward}-${area.area}`, // Create a unique key for each area
              area, // Store the original area object as the value
            ])
          ).values()
        );
        setProfile({ ...rawProfileData, preferred_areas: uniquePreferredAreas });
      } else {
        setProfile(rawProfileData); // Set as is if no preferred_areas or if it's null
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }

    // Fetch Available Orders
    setLoadingAvailable(true);
    try {
      const availableRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/deliveryman/orders/available/${deliveryman_id}`
      );
      setAvailableOrders(availableRes.data);
    } catch (err) {
      console.error("Failed to load available orders:", err);
      setAvailableOrders([]);
    } finally {
      setLoadingAvailable(false);
    }

    // Fetch Under Shipment Orders
    setLoadingUnderShipment(true);
    try {
      const underShipmentRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/deliveryman/orders/under-shipment/${deliveryman_id}`
      );
      setUnderShipmentOrders(underShipmentRes.data);
    } catch (err) {
      console.error("Failed to load under shipment orders:", err);
      setUnderShipmentOrders([]);
    } finally {
      setLoadingUnderShipment(false);
    }

    // Fetch Delivered Orders
    setLoadingDelivered(true);
    try {
      const deliveredRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/deliveryman/orders/delivered/${deliveryman_id}`
      );
      setDeliveredOrders(deliveredRes.data);
    } catch (err) {
      console.error("Failed to load delivered orders:", err);
      setDeliveredOrders([]);
    } finally {
      setLoadingDelivered(false);
    }
  };

  useEffect(() => {
    fetchDeliveryManData();
  }, []);

  // Handles accepting an available purchase
  const handleAcceptOrder = async (order) => {
    try {
      const deliveryman_id = localStorage.getItem("deliveryman_id");
      if (!deliveryman_id) {
        alert("Deliveryman ID not found. Please log in again.");
        navigate("/login");
        return;
      }
      if (!order.purchase_id) {
        alert("Purchase ID not found for this order. Cannot accept.");
        return;
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/deliveryman/acceptpurchase`, {
        purchaseId: order.purchase_id,
        deliverymanId: deliveryman_id,
      });

      // After accepting, re-fetch all data to refresh sections
      await fetchDeliveryManData();
      alert("Purchase accepted and shipment created!");
    } catch (error) {
      console.error("Error accepting purchase:", error);
      alert(
        error.response?.data?.message || "Failed to accept purchase. Please try again."
      );
    }
  };

  // Handles marking an "under shipment" order as delivered
  const handleDelivered = async (order) => {
    try {
      if (!order.shipment_id) {
        alert("Shipment ID not found for this order. Cannot mark as delivered.");
        return;
      }
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/deliveryman/markdelivered/${order.shipment_id}`
      );

      // After marking delivered, re-fetch all data to refresh sections
      await fetchDeliveryManData();
      alert("Shipment marked as delivered!");
    } catch (error) {
      console.error("Error marking shipment as delivered:", error);
      alert(
        error.response?.data?.message || "Failed to mark as delivered. Please try again."
      );
    }
  };

  // Handles changing the deliveryman's password
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
        `${process.env.REACT_APP_API_URL}/api/deliveryman/changepassword/${deliveryman_id}`,
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

  // Handles user logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Helper for rendering order tables based on data, loading state, title, icon, and empty message
  const renderOrderTable = (ordersArray, loadingState, title, icon, emptyMessage) => (
    <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 border border-gray-800">
      <h2 className="text-2xl font-extrabold mb-6 text-emerald-300 flex items-center gap-2">
        {icon} {title}
      </h2>
      {loadingState ? (
        <div className="text-gray-300">Loading {title.toLowerCase()}...</div>
      ) : ordersArray.length === 0 ? (
        <div className="text-gray-500 text-center">{emptyMessage}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-800 rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-gray-800/80">
                <th className="py-3 px-5 border-b text-emerald-300 font-semibold text-left">
                  Buyer Name
                </th>
                <th className="py-3 px-5 border-b text-emerald-300 font-semibold text-left">
                  Destination Address
                </th>
                <th className="py-3 px-5 border-b text-emerald-300 font-semibold text-left">
                  Total Price
                </th>
                <th className="py-3 px-5 border-b text-emerald-300 font-semibold text-left">
                  Status
                </th>
                <th className="py-3 px-5 border-b text-emerald-300 font-semibold text-left">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {ordersArray.map((order) => (
                <tr
                  key={order.purchase_id} // Use purchase_id as key
                  className="bg-gray-900/80 hover:bg-gray-800/60 transition"
                >
                  <td className="py-3 px-5 border-b border-gray-700 text-gray-200">
                    {order.buyer_name}
                  </td>
                  <td className="py-3 px-5 border-b border-gray-700 text-gray-200 text-sm">
                    {order.delivery_division}, {order.delivery_district},{" "}
                    {order.delivery_ward}, {order.delivery_area}
                  </td>
                  <td className="py-3 px-5 border-b border-gray-700 text-gray-200">
                    ৳{order.total_price}
                  </td>
                  <td className="py-3 px-5 border-b border-gray-700 text-gray-200">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${order.shipment_status === null ? 'bg-blue-600' : // Available status for pending purchases
                          ['ACCEPTED', 'Under Shipment'].includes(order.shipment_status) ? 'bg-yellow-600' : // Under Shipment status for assigned but not delivered
                            order.shipment_status === 'DELIVERED' ? 'bg-emerald-600' : 'bg-gray-600' // Delivered or other statuses
                        }`}
                    >
                      {order.shipment_status === null ? "Available" : order.shipment_status}
                    </span>
                  </td>
                  <td className="py-3 px-5 border-b border-gray-700 flex gap-2 items-center">
                    {/* Action buttons based on shipment_status */}
                    {order.shipment_status === null ? (
                      <button
                        className="px-4 py-1 rounded shadow transition font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleAcceptOrder(order)}
                      >
                        Accept Purchase
                      </button>
                    ) : (
                      // Only show Mark as Delivered button if shipment is not yet delivered
                      ['ACCEPTED', 'Under Shipment'].includes(order.shipment_status) ? (
                        <button
                          className="px-4 py-1 rounded shadow bg-yellow-600 hover:bg-yellow-700 text-white font-semibold transition"
                          onClick={() => handleDelivered(order)}
                        >
                          Mark as Delivered
                        </button>
                      ) : (
                        // For DELIVERED shipments, show status text
                        <span className="px-4 py-1 rounded bg-gray-700 text-emerald-400 font-semibold">
                          Delivered
                        </span>
                      )
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

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
                  <FiPhone className="text-emerald-400" />
                  <span className="font-semibold">Phone:</span> {profile.phone}
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
                <div className="text-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <FiMapPin className="text-emerald-400" />
                    <span className="font-semibold">Preferred Areas:</span>
                  </div>
                  {profile.preferred_areas && profile.preferred_areas.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {profile.preferred_areas.map((pArea, index) => (
                        <span
                          key={index} // It's generally better to use a unique ID from the data if available, but index is okay if areas are truly unique after de-duplication
                          className="bg-emerald-700/70 text-white text-sm px-3 py-1 rounded-full shadow-sm"
                        >
                          {pArea.division}, {pArea.district}, {pArea.ward}, {pArea.area}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No preferred areas set.</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-400">Profile not found.</div>
          )}
        </div>

        {/* Available Orders Section */}
        {renderOrderTable(
          availableOrders,
          loadingAvailable,
          "Available Orders",
          <FiBox className="text-emerald-400" />,
          "No available orders in your preferred areas. Check back later!"
        )}

        {/* Under Shipment Orders Section */}
        {renderOrderTable(
          underShipmentOrders,
          loadingUnderShipment,
          "Under Shipment",
          <FiClock className="text-emerald-400" />,
          "No shipments currently under your delivery. Accept an available order!"
        )}

        {/* Delivered Orders Section */}
        {renderOrderTable(
          deliveredOrders,
          loadingDelivered,
          "Delivered Shipments",
          <FiArchive className="text-emerald-400" />,
          "No shipments delivered by you yet."
        )}

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
                className={`text-sm mt-2 ${passwordMsg.type === "success"
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