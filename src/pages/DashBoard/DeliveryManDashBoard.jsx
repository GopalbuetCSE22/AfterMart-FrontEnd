import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DeliveryManDashBoard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assume deliveryman_id is stored in localStorage after login
    const deliveryman_id = localStorage.getItem('deliveryman_id');
    if (!deliveryman_id) {
      alert('Deliveryman ID not found. Please log in again.');
      setLoading(false);
      return;
    }

    // Fetch orders for this deliveryman's preferred area
    axios
      .get(`http://localhost:5000/api/orders/byPreferredArea/${deliveryman_id}`)
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-green-200">
        <h2 className="text-2xl font-extrabold mb-6 text-green-700 text-center tracking-wide">
          Orders in Your Preferred Area
        </h2>
        {loading ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found in your preferred area.</p>
        ) : (
          <table className="w-full border border-green-100 rounded-lg overflow-hidden shadow">
            <thead>
              <tr className="bg-green-100">
                <th className="py-3 px-5 border-b font-semibold text-green-700">Order ID</th>
                <th className="py-3 px-5 border-b font-semibold text-green-700">Customer</th>
                <th className="py-3 px-5 border-b font-semibold text-green-700">Address</th>
                <th className="py-3 px-5 border-b font-semibold text-green-700">Status</th>
                <th className="py-3 px-5 border-b font-semibold text-green-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td className="py-3 px-5 border-b">{order.order_id}</td>
                  <td className="py-3 px-5 border-b">{order.customer_name}</td>
                  <td className="py-3 px-5 border-b">
                    {order.division}, {order.district}, {order.ward}, {order.area}
                  </td>
                  <td className="py-3 px-5 border-b">{order.status}</td>
                  <td className="py-3 px-5 border-b">${order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DeliveryManDashBoard;