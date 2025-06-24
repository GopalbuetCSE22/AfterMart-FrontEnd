import React, { useState, useEffect } from "react";
import axios from "axios";

function DeliveryServiceDashBoard() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        vehicleType: "",
        division: "",
        district: "",
        ward: "",
        area: "",
    });
    const [deliverymen, setDeliverymen] = useState([]);
    const [selectedDeliveryman, setSelectedDeliveryman] = useState(null);

    useEffect(() => {
        const company_id = localStorage.getItem("company_id");
        if (!company_id) {
            alert("Company ID not found. Please log in again.");
            return;
        }
        axios
            .get(`http://localhost:5000/api/delivery/showallDeliveryman/${company_id}`)
            .then((res) => setDeliverymen(res.data))
            .catch(() => setDeliverymen([]));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const company_id = localStorage.getItem("company_id");
        const formdata = {
            company_id,
            name: form.name,
            phone: form.phone,
            email: form.email,
            password: form.password,
            vehicle_type: form.vehicleType,
            division: form.division,
            district: form.district,
            ward: form.ward,
            area: form.area,
        };

        axios
            .post("http://localhost:5000/api/delivery/createDelivaryman", formdata)
            .then((res) => {
                setDeliverymen([...deliverymen, res.data]);
                setForm({
                    name: "",
                    phone: "",
                    email: "",
                    password: "",
                    vehicleType: "",
                    division: "",
                    district: "",
                    ward: "",
                    area: "",
                });
            });
    };

    const handleViewDetails = (deliverymanId) => {
        const deliveryman = deliverymen.find(
            (dm) => dm.id === deliverymanId || dm.deliveryman_id === deliverymanId
        );
        setSelectedDeliveryman(deliveryman);
    };

    const handleClosePanel = () => {
        setSelectedDeliveryman(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8 relative">
            {/* Registration Form */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 mb-12 max-w-lg mx-auto border border-blue-200">
                {/* ...form code unchanged... */}
                <h2 className="text-2xl font-extrabold mb-6 text-blue-700 text-center tracking-wide">
                    Register Deliveryman
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        {/* ...inputs unchanged... */}
                        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="col-span-2 border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                        <input type="text" name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="col-span-2 border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                        <input type="text" name="vehicleType" placeholder="Vehicle Type" value={form.vehicleType} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                        <input type="text" name="division" placeholder="Division" value={form.division} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                        <input type="text" name="district" placeholder="District" value={form.district} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                        <input type="text" name="ward" placeholder="Ward" value={form.ward} onChange={handleChange} className="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                        <input type="text" name="area" placeholder="Area" value={form.area} onChange={handleChange} className="col-span-2 border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition" required />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-4 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 transition">
                        Register
                    </button>
                </form>
            </div>

            {/* Deliverymen List */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto border border-blue-200">
                <h2 className="text-2xl font-extrabold mb-6 text-blue-700 text-center tracking-wide">
                    All Deliverymen
                </h2>
                {deliverymen.length === 0 ? (
                    <p className="text-gray-500 text-center">No deliverymen found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-blue-100 rounded-lg overflow-hidden shadow">
                            <thead>
                                <tr className="bg-blue-100">
                                    <th className="py-3 px-5 border-b font-semibold text-blue-700">Name</th>
                                    <th className="py-3 px-5 border-b font-semibold text-blue-700">Phone</th>
                                    <th className="py-3 px-5 border-b font-semibold text-blue-700">Vehicle Type</th>
                                    <th className="py-3 px-5 border-b"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliverymen.map((dm, idx) => (
                                    <tr
                                        key={dm.id || dm.deliveryman_id}
                                        className={idx % 2 === 0 ? "bg-white" : "bg-blue-50"}
                                    >
                                        <td className="py-3 px-5 border-b">{dm.name}</td>
                                        <td className="py-3 px-5 border-b">{dm.phone}</td>
                                        <td className="py-3 px-5 border-b">
                                            {dm.vehicleType || dm.vehicle_type}
                                        </td>
                                        <td className="py-3 px-5 border-b text-center">
                                            <button
                                                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition"
                                                onClick={() =>
                                                    handleViewDetails(dm.id || dm.deliveryman_id)
                                                }
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Side Panel for Deliveryman Details */}
            {selectedDeliveryman && (
                <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl border-l border-blue-200 z-50 p-8 flex flex-col transition-transform duration-300">
                    <button
                        className="self-end text-2xl font-bold text-blue-700 mb-4 hover:text-red-500"
                        onClick={handleClosePanel}
                        aria-label="Close"
                    >
                        &times;
                    </button>
                    <h3 className="text-xl font-bold mb-4 text-blue-700">Deliveryman Details</h3>
                    <div className="space-y-2">
                        <div><span className="font-semibold">Name:</span> {selectedDeliveryman.name}</div>
                        <div><span className="font-semibold">Phone:</span> {selectedDeliveryman.phone}</div>
                        <div><span className="font-semibold">Email:</span> {selectedDeliveryman.email}</div>
                        <div><span className="font-semibold">Vehicle Type:</span> {selectedDeliveryman.vehicleType || selectedDeliveryman.vehicle_type}</div>
                        <div><span className="font-semibold">Division:</span> {selectedDeliveryman.division}</div>
                        <div><span className="font-semibold">District:</span> {selectedDeliveryman.district}</div>
                        <div><span className="font-semibold">Ward:</span> {selectedDeliveryman.ward}</div>
                        <div><span className="font-semibold">Area:</span> {selectedDeliveryman.area}</div>
                        {/* Add more fields as needed */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default DeliveryServiceDashBoard;