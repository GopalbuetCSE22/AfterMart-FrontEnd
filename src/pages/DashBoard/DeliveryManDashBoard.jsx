import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiStar, FiUser, FiMail, FiTruck, FiMapPin, FiBox, FiUserCheck } from "react-icons/fi";

function StarRating({ rating }) {
  // rating: number (e.g. 3.5)
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
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
        <FiStar key={"empty" + i} className="text-gray-400" />
      ))}
      <span className="ml-2 text-yellow-300 font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}

function DeliveryManDashBoard() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-blue-900 p-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* Profile Section */}
        <div className="bg-gradient-to-br from-blue-900/90 to-gray-900/90 rounded-2xl shadow-2xl p-8 border border-blue-800 flex flex-col md:flex-row gap-8 items-center">
          {loadingProfile ? (
            <div className="text-gray-300">Loading profile...</div>
          ) : profile ? (
            <>
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center shadow-lg border-4 border-blue-300 overflow-hidden">
                  <FiUser className="text-5xl text-white" />
                </div>
                <StarRating rating={profile.rating || 0} />
              </div>
              <div className="flex-1 flex flex-col gap-3 text-gray-100">
                <div className="flex items-center gap-2">
                  <FiUser className="text-blue-400" />
                  <span className="font-semibold">Name:</span> {profile.name}
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="text-blue-400" />
                  <span className="font-semibold">Email:</span> {profile.email}
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-blue-400" />
                  <span className="font-semibold">Vehicle Type:</span> {profile.vehicle_type}
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin className="text-blue-400" />
                  <span className="font-semibold">Preferred Areas:</span>
                  <span>
                    {Array.isArray(profile.preferred_areas)
                      ? profile.preferred_areas.map((area, i) => (
                          <span key={i}>
                            {area.division}, {area.district}, {area.ward}, {area.area}
                            {i < profile.preferred_areas.length - 1 ? "; " : ""}
                          </span>
                        ))
                      : "N/A"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-red-400">Profile not found.</div>
          )}
        </div>

        {/* Incoming Orders Section */}
        <div className="bg-gradient-to-br from-gray-900/90 to-blue-900/90 rounded-2xl shadow-2xl p-8 border border-blue-800">
          <h2 className="text-2xl font-extrabold mb-6 text-blue-300 flex items-center gap-2">
            <FiBox className="text-blue-400" /> Incoming Orders
          </h2>
          {loadingOrders ? (
            <div className="text-gray-300">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-gray-400 text-center">No incoming orders.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border border-blue-900 rounded-lg overflow-hidden shadow">
                <thead>
                  <tr className="bg-blue-900/80">
                    <th className="py-3 px-5 border-b text-blue-300 font-semibold">Order ID</th>
                    <th className="py-3 px-5 border-b text-blue-300 font-semibold">Product</th>
                    <th className="py-3 px-5 border-b text-blue-300 font-semibold">
                      <FiUserCheck className="inline mr-1" /> Buyer
                    </th>
                    <th className="py-3 px-5 border-b text-blue-300 font-semibold">
                      <FiUser className="inline mr-1" /> Seller
                    </th>
                    <th className="py-3 px-5 border-b text-blue-300 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id} className="bg-blue-950/80 hover:bg-blue-900/60 transition">
                      <td className="py-3 px-5 border-b text-gray-100">{order.order_id}</td>
                      <td className="py-3 px-5 border-b text-gray-100">{order.product_title}</td>
                      <td className="py-3 px-5 border-b text-gray-100">
                        {order.buyer_name} <br />
                        <span className="text-xs text-blue-200">{order.buyer_email}</span>
                      </td>
                      <td className="py-3 px-5 border-b text-gray-100">
                        {order.seller_name} <br />
                        <span className="text-xs text-blue-200">{order.seller_email}</span>
                      </td>
                      <td className="py-3 px-5 border-b text-gray-100">{order.status}</td>
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

export default DeliveryManDashBoard;