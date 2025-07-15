// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   FiUserPlus,
//   FiTruck,
//   FiPhone,
//   FiMail,
//   FiKey,
//   FiMapPin,
//   FiEye,
//   FiX,
//   FiUser,
//   FiMap,
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// const BDAPI_BASE_URL = "https://bdapi.vercel.app/api/v.1";

// function DeliveryServiceDashBoard() {
//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     email: "",
//     password: "",
//     vehicleType: "",
//     division: "",
//     district: "",
//     ward: "",
//     area: "",
//   });
//   const [deliverymen, setDeliverymen] = useState([]);
//   const [selectedDeliveryman, setSelectedDeliveryman] = useState(null);

//   // Address dropdown states
//   const [availableDivisions, setAvailableDivisions] = useState([]);
//   const [availableDistricts, setAvailableDistricts] = useState([]);
//   const [availableWards, setAvailableWards] = useState([]);
//   const [availableAreas, setAvailableAreas] = useState([]);

//   // Fetch divisions on mount
//   useEffect(() => {
//     const fetchDivisions = async () => {
//       try {
//         const res = await axios.get(`${BDAPI_BASE_URL}/division`);
//         if (res.data && Array.isArray(res.data.data)) {
//           setAvailableDivisions(res.data.data);
//         } else {
//           setAvailableDivisions([]);
//         }
//       } catch (err) {
//         setAvailableDivisions([]);
//       }
//     };
//     fetchDivisions();
//   }, []);

//   // Fetch districts when division changes
//   useEffect(() => {
//     if (!form.division) {
//       setAvailableDistricts([]);
//       setAvailableWards([]);
//       setAvailableAreas([]);
//       return;
//     }
//     const selectedDivision = availableDivisions.find(
//       (div) => div.name === form.division
//     );
//     if (!selectedDivision) {
//       setAvailableDistricts([]);
//       setAvailableWards([]);
//       setAvailableAreas([]);
//       return;
//     }
//     const fetchDistricts = async () => {
//       try {
//         const res = await axios.get(
//           `${BDAPI_BASE_URL}/district/${selectedDivision.id}`
//         );
//         if (res.data && Array.isArray(res.data.data)) {
//           setAvailableDistricts(res.data.data);
//         } else {
//           setAvailableDistricts([]);
//         }
//       } catch (err) {
//         setAvailableDistricts([]);
//       }
//     };
//     fetchDistricts();
//     setAvailableWards([]);
//     setAvailableAreas([]);
//   }, [form.division, availableDivisions]);

//   // Fetch wards (upazilas) when district changes
//   useEffect(() => {
//     if (!form.district) {
//       setAvailableWards([]);
//       setAvailableAreas([]);
//       return;
//     }
//     const selectedDistrict = availableDistricts.find(
//       (dist) => dist.name === form.district
//     );
//     if (!selectedDistrict) {
//       setAvailableWards([]);
//       setAvailableAreas([]);
//       return;
//     }
//     const fetchWards = async () => {
//       try {
//         const res = await axios.get(
//           `${BDAPI_BASE_URL}/upazilla/${selectedDistrict.id}`
//         );
//         if (res.data && Array.isArray(res.data.data)) {
//           setAvailableWards(res.data.data);
//         } else {
//           setAvailableWards([]);
//         }
//       } catch (err) {
//         setAvailableWards([]);
//       }
//     };
//     fetchWards();
//     setAvailableAreas([]);
//   }, [form.district, availableDistricts]);

//   // Fetch areas (unions) when ward changes
//   useEffect(() => {
//     if (!form.ward) {
//       setAvailableAreas([]);
//       return;
//     }
//     const selectedWard = availableWards.find((w) => w.name === form.ward);
//     if (!selectedWard) {
//       setAvailableAreas([]);
//       return;
//     }
//     const fetchAreas = async () => {
//       try {
//         const res = await axios.get(
//           `${BDAPI_BASE_URL}/union/${selectedWard.id}`
//         );
//         if (res.data && Array.isArray(res.data.data)) {
//           setAvailableAreas(res.data.data);
//         } else {
//           setAvailableAreas([]);
//         }
//       } catch (err) {
//         setAvailableAreas([]);
//       }
//     };
//     fetchAreas();
//   }, [form.ward, availableWards]);

//   useEffect(() => {
//     const company_id = localStorage.getItem("company_id");
//     if (!company_id) {
//       alert("Company ID not found. Please log in again.");
//       navigate("/login");
//       return;
//     }
//     axios
//       .get(
//         `http://localhost:5000/api/delivery/showallDeliveryman/${company_id}`
//       )
//       .then((res) => setDeliverymen(res.data))
//       .catch(() => setDeliverymen([]));
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const company_id = localStorage.getItem("company_id");
//     const formdata = {
//       company_id,
//       name: form.name,
//       phone: form.phone,
//       email: form.email,
//       password: form.password,
//       vehicle_type: form.vehicleType,
//       division: form.division,
//       district: form.district,
//       ward: form.ward,
//       area: form.area,
//     };

//     axios
//       .post("http://localhost:5000/api/delivery/createDelivaryman", formdata)
//       .then((res) => {
//         setDeliverymen([...deliverymen, res.data]);
//         setForm({
//           name: "",
//           phone: "",
//           email: "",
//           password: "",
//           vehicleType: "",
//           division: "",
//           district: "",
//           ward: "",
//           area: "",
//         });
//       });
//   };

//   const handleViewDetails = (deliverymanId) => {
//     const deliveryman = deliverymen.find(
//       (dm) => dm.id === deliverymanId || dm.deliveryman_id === deliverymanId
//     );
//     setSelectedDeliveryman(deliveryman);
//   };

//   const handleClosePanel = () => {
//     setSelectedDeliveryman(null);
//   };

//   const navigate = useNavigate();
//   const handleLogout = () => {
//     localStorage.clear();
//     navigate("/login");
//   };
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-8 relative font-sans">
//       {/* Registration Form */}
//       <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 mb-12 max-w-lg mx-auto border border-gray-700 animate-fade-in backdrop-blur-md">
//         <h2 className="text-2xl font-extrabold mb-6 text-blue-400 text-center tracking-wide flex items-center justify-center gap-2 drop-shadow">
//           <FiUserPlus className="text-blue-500" /> Register Deliveryman
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="col-span-2 flex items-center gap-2">
//               <FiUser className="text-blue-400" />
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={handleChange}
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition placeholder-gray-500"
//                 required
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <FiPhone className="text-blue-400" />
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition placeholder-gray-500"
//                 required
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <FiMail className="text-blue-400" />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition placeholder-gray-500"
//                 required
//               />
//             </div>
//             <div className="col-span-2 flex items-center gap-2">
//               <FiKey className="text-blue-400" />
//               <input
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition placeholder-gray-500"
//                 required
//               />
//             </div>
//             <div className="flex items-center gap-2">
//               <FiTruck className="text-blue-400" />
//               <input
//                 type="text"
//                 name="vehicleType"
//                 placeholder="Vehicle Type"
//                 value={form.vehicleType}
//                 onChange={handleChange}
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition placeholder-gray-500"
//                 required
//               />
//             </div>
//             {/* Division Dropdown */}
//             <div className="col-span-2 flex items-center gap-2">
//               <FiMapPin className="text-blue-400" />
//               <select
//                 name="division"
//                 value={form.division}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     division: e.target.value,
//                     district: "",
//                     ward: "",
//                     area: "",
//                   }))
//                 }
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
//                 required
//               >
//                 <option value="">Select Division</option>
//                 {availableDivisions.map((div) => (
//                   <option key={div.id} value={div.name}>
//                     {div.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* District Dropdown */}
//             <div className="flex items-center gap-2">
//               <FiMap className="text-blue-400" />
//               <select
//                 name="district"
//                 value={form.district}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     district: e.target.value,
//                     ward: "",
//                     area: "",
//                   }))
//                 }
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
//                 required
//                 disabled={!form.division || availableDistricts.length === 0}
//               >
//                 <option value="">Select District</option>
//                 {availableDistricts.map((dist) => (
//                   <option key={dist.id} value={dist.name}>
//                     {dist.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Ward Dropdown */}
//             <div className="flex items-center gap-2">
//               <FiMap className="text-blue-400" />
//               <select
//                 name="ward"
//                 value={form.ward}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     ward: e.target.value,
//                     area: "",
//                   }))
//                 }
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
//                 required
//                 disabled={!form.district || availableWards.length === 0}
//               >
//                 <option value="">Select Ward (Upazila)</option>
//                 {availableWards.map((w) => (
//                   <option key={w.id} value={w.name}>
//                     {w.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Area Dropdown */}
//             <div className="flex items-center gap-2 col-span-2">
//               <FiMapPin className="text-blue-400" />
//               <select
//                 name="area"
//                 value={form.area}
//                 onChange={(e) =>
//                   setForm((f) => ({
//                     ...f,
//                     area: e.target.value,
//                   }))
//                 }
//                 className="flex-1 border border-gray-700 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 transition"
//                 required={availableAreas.length > 0}
//                 disabled={!form.ward || availableAreas.length === 0}
//               >
//                 <option value="">
//                   {availableAreas.length === 0
//                     ? "No areas found for this ward"
//                     : "Select Area (Union)"}
//                 </option>
//                 {availableAreas.map((a) => (
//                   <option key={a.id} value={a.name}>
//                     {a.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
//           >
//             <FiUserPlus /> Register
//           </button>
//         </form>
//       </div>

//       {/* Deliverymen List */}
//       <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto border border-gray-700 animate-fade-in backdrop-blur-md">
//         <h2 className="text-2xl font-extrabold mb-6 text-blue-400 text-center tracking-wide flex items-center justify-center gap-2 drop-shadow">
//           <FiTruck className="text-blue-500" /> All Deliverymen
//         </h2>
//         {deliverymen.length === 0 ? (
//           <p className="text-gray-400 text-center">No deliverymen found.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full border border-gray-800 rounded-lg overflow-hidden shadow-lg">
//               <thead>
//                 <tr className="bg-gradient-to-r from-gray-800 to-gray-900">
//                   <th className="py-3 px-5 border-b font-semibold text-blue-300">
//                     <FiUser className="inline mr-1" /> Name
//                   </th>
//                   <th className="py-3 px-5 border-b font-semibold text-blue-300">
//                     <FiPhone className="inline mr-1" /> Phone
//                   </th>
//                   <th className="py-3 px-5 border-b font-semibold text-blue-300">
//                     <FiTruck className="inline mr-1" /> Vehicle Type
//                   </th>
//                   <th className="py-3 px-5 border-b"></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {deliverymen.map((dm, idx) => (
//                   <tr
//                     key={dm.id || dm.deliveryman_id}
//                     className={`transition-all duration-200 ${
//                       idx % 2 === 0 ? "bg-gray-900/80" : "bg-gray-800/80"
//                     } hover:bg-blue-900/60`}
//                   >
//                     <td className="py-3 px-5 border-b text-gray-100">
//                       {dm.name}
//                     </td>
//                     <td className="py-3 px-5 border-b text-gray-100">
//                       {dm.phone}
//                     </td>
//                     <td className="py-3 px-5 border-b text-gray-100">
//                       {dm.vehicleType || dm.vehicle_type}
//                     </td>
//                     <td className="py-3 px-5 border-b text-center">
//                       <button
//                         className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-1 rounded-lg shadow hover:from-blue-800 hover:to-blue-900 transition-all duration-200 flex items-center gap-2"
//                         onClick={() =>
//                           handleViewDetails(dm.id || dm.deliveryman_id)
//                         }
//                       >
//                         <FiEye /> View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Side Panel for Deliveryman Details */}
//       <div
//         className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border-l border-blue-800 z-50 p-8 flex flex-col transition-transform duration-300 ${
//           selectedDeliveryman ? "translate-x-0" : "translate-x-full"
//         }`}
//         style={{ willChange: "transform", backdropFilter: "blur(8px)" }}
//       >
//         {selectedDeliveryman && (
//           <>
//             <button
//               className="self-end text-2xl font-bold text-blue-300 mb-4 hover:text-red-400 transition"
//               onClick={handleClosePanel}
//               aria-label="Close"
//             >
//               <FiX />
//             </button>
//             <h3 className="text-xl font-bold mb-4 text-blue-300 flex items-center gap-2">
//               <FiUser className="text-blue-400" /> Deliveryman Details
//             </h3>
//             <div className="space-y-2 text-gray-100">
//               <div>
//                 <span className="font-semibold flex items-center gap-1">
//                   <FiUser /> Name:
//                 </span>{" "}
//                 {selectedDeliveryman.name}
//               </div>
//               <div>
//                 <span className="font-semibold flex items-center gap-1">
//                   <FiPhone /> Phone:
//                 </span>{" "}
//                 {selectedDeliveryman.phone}
//               </div>
//               <div>
//                 <span className="font-semibold flex items-center gap-1">
//                   <FiMail /> Email:
//                 </span>{" "}
//                 {selectedDeliveryman.email}
//               </div>
//               <div>
//                 <span className="font-semibold flex items-center gap-1">
//                   <FiTruck /> Vehicle Type:
//                 </span>{" "}
//                 {selectedDeliveryman.vehicleType ||
//                   selectedDeliveryman.vehicle_type}
//               </div>
//               <div>
//                 <span className="font-semibold flex items-center gap-1">
//                   <FiMapPin /> Division:
//                 </span>{" "}
//                 {selectedDeliveryman.division}
//               </div>
//               <div>
//                 <span className="font-semibold flex items-center gap-1">
//                   <FiMap /> District:
//                 </span>{" "}
//                 {selectedDeliveryman.district}
//               </div>
//               <div>
//                 <span className="font-semibold flex items-center gap-1">
//                   <FiMap /> Ward:
//                 </span>{" "}
//                 {selectedDeliveryman.ward}
//               </div>
//               <div>
//                 <span className="font-semibold flex items-center gap-1">
//                   <FiMapPin /> Area:
//                 </span>{" "}
//                 {selectedDeliveryman.area}
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//       <div>
//         <button
//           onClick={handleLogout}
//           className="mt-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-gray-900 text-red-200 hover:bg-red-900/80 transition font-semibold shadow-lg"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default DeliveryServiceDashBoard;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FiUserPlus,
  FiTruck,
  FiPhone,
  FiMail,
  FiKey,
  FiMapPin,
  FiEye,
  FiX,
  FiUser,
  FiMap,
  FiLogOut,
  FiHome,
  FiList,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BDAPI_BASE_URL = "https://bdapi.vercel.app/api/v.1";

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

  // Address dropdown states
  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);

  const navigate = useNavigate();

  // Fetch divisions on mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await axios.get(`${BDAPI_BASE_URL}/division`);
        if (res.data && Array.isArray(res.data.data)) {
          setAvailableDivisions(res.data.data);
        } else {
          setAvailableDivisions([]);
        }
      } catch (err) {
        console.error("Error fetching divisions:", err);
        setAvailableDivisions([]);
      }
    };
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (!form.division) {
      setAvailableDistricts([]);
      setAvailableWards([]);
      setAvailableAreas([]);
      return;
    }
    const selectedDivision = availableDivisions.find(
      (div) => div.name === form.division
    );
    if (!selectedDivision) {
      setAvailableDistricts([]);
      setAvailableWards([]);
      setAvailableAreas([]);
      return;
    }
    const fetchDistricts = async () => {
      try {
        const res = await axios.get(
          `${BDAPI_BASE_URL}/district/${selectedDivision.id}`
        );
        if (res.data && Array.isArray(res.data.data)) {
          setAvailableDistricts(res.data.data);
        } else {
          setAvailableDistricts([]);
        }
      } catch (err) {
        console.error("Error fetching districts:", err);
        setAvailableDistricts([]);
      }
    };
    fetchDistricts();
    setAvailableWards([]);
    setAvailableAreas([]);
  }, [form.division, availableDivisions]);

  // Fetch wards (upazilas) when district changes
  useEffect(() => {
    if (!form.district) {
      setAvailableWards([]);
      setAvailableAreas([]);
      return;
    }
    const selectedDistrict = availableDistricts.find(
      (dist) => dist.name === form.district
    );
    if (!selectedDistrict) {
      setAvailableWards([]);
      setAvailableAreas([]);
      return;
    }
    const fetchWards = async () => {
      try {
        const res = await axios.get(
          `${BDAPI_BASE_URL}/upazilla/${selectedDistrict.id}`
        );
        if (res.data && Array.isArray(res.data.data)) {
          setAvailableWards(res.data.data);
        } else {
          setAvailableWards([]);
        }
      } catch (err) {
        console.error("Error fetching wards:", err);
        setAvailableWards([]);
      }
    };
    fetchWards();
    setAvailableAreas([]);
  }, [form.district, availableDistricts]);

  // Fetch areas (unions) when ward changes
  useEffect(() => {
    if (!form.ward) {
      setAvailableAreas([]);
      return;
    }
    const selectedWard = availableWards.find((w) => w.name === form.ward);
    if (!selectedWard) {
      setAvailableAreas([]);
      return;
    }
    const fetchAreas = async () => {
      try {
        const res = await axios.get(
          `${BDAPI_BASE_URL}/union/${selectedWard.id}`
        );
        if (res.data && Array.isArray(res.data.data)) {
          setAvailableAreas(res.data.data);
        } else {
          setAvailableAreas([]);
        }
      } catch (err) {
        console.error("Error fetching areas:", err);
        setAvailableAreas([]);
      }
    };
    fetchAreas();
  }, [form.ward, availableWards]);

  useEffect(() => {
    const fetchDeliverymen = async () => {
      const company_id = localStorage.getItem("company_id");
      if (!company_id) {
        alert("Company ID not found. Please log in again.");
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(
          `http://localhost:5000/api/delivery/showallDeliveryman/${company_id}`
        );
        setDeliverymen(res.data);
      } catch (err) {
        console.error("Error fetching deliverymen:", err);
        setDeliverymen([]);
      }
    };
    fetchDeliverymen();
  }, [navigate, deliverymen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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

    try {
      const res = await axios.post(
        "http://localhost:5000/api/delivery/createDelivaryman",
        formdata
      );
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
      alert("Deliveryman registered successfully!");
    } catch (err) {
      console.error("Error registering deliveryman:", err);
      alert("Failed to register deliveryman. Please try again.");
    }
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 p-8 relative font-sans text-gray-100">
      {/* Dashboard Heading Board */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-3xl shadow-xl p-6 mb-12 max-w-4xl mx-auto border border-blue-700 animate-slide-down">
        <h1 className="text-4xl font-extrabold text-center text-white tracking-wider flex items-center justify-center gap-4 drop-shadow-lg">
          <FiHome className="text-blue-300 text-5xl animate-bounce-slow" /> Delivery Service Dashboard
        </h1>
        <p className="text-center text-blue-200 mt-2 text-lg">Manage your delivery personnel and operations efficiently.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Registration Form */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in backdrop-blur-md">
          <h2 className="text-2xl font-extrabold mb-6 text-blue-400 text-center tracking-wide flex items-center justify-center gap-2 drop-shadow">
            <FiUserPlus className="text-blue-500" /> Register Deliveryman
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-full flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiUser className="text-blue-400 text-xl" />
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0"
                  required
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiPhone className="text-blue-400 text-xl" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0"
                  required
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiMail className="text-blue-400 text-xl" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0"
                  required
                />
              </div>
              <div className="col-span-full flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiKey className="text-blue-400 text-xl" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0"
                  required
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiTruck className="text-blue-400 text-xl" />
                <input
                  type="text"
                  name="vehicleType"
                  placeholder="Vehicle Type"
                  value={form.vehicleType}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-0"
                  required
                />
              </div>
              {/* Division Dropdown */}
              <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiMapPin className="text-blue-400 text-xl" />
                <select
                  name="division"
                  value={form.division}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      division: e.target.value,
                      district: "",
                      ward: "",
                      area: "",
                    }))
                  }
                  className="flex-1 bg-transparent text-gray-100 focus:outline-none focus:ring-0"
                  required
                >
                  <option value="">Select Division</option>
                  {availableDivisions.map((div) => (
                    <option key={div.id} value={div.name} className="bg-gray-800 text-gray-200">
                      {div.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* District Dropdown */}
              <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiMap className="text-blue-400 text-xl" />
                <select
                  name="district"
                  value={form.district}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      district: e.target.value,
                      ward: "",
                      area: "",
                    }))
                  }
                  className="flex-1 bg-transparent text-gray-100 focus:outline-none focus:ring-0"
                  required
                  disabled={!form.division || availableDistricts.length === 0}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map((dist) => (
                    <option key={dist.id} value={dist.name} className="bg-gray-800 text-gray-200">
                      {dist.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Ward Dropdown */}
              <div className="flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiMap className="text-blue-400 text-xl" />
                <select
                  name="ward"
                  value={form.ward}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      ward: e.target.value,
                      area: "",
                    }))
                  }
                  className="flex-1 bg-transparent text-gray-100 focus:outline-none focus:ring-0"
                  required
                  disabled={!form.district || availableWards.length === 0}
                >
                  <option value="">Select Ward (Upazila)</option>
                  {availableWards.map((w) => (
                    <option key={w.id} value={w.name} className="bg-gray-800 text-gray-200">
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Area Dropdown */}
              <div className="col-span-full flex items-center gap-3 bg-gray-800/60 rounded-lg p-2 border border-gray-700">
                <FiMapPin className="text-blue-400 text-xl" />
                <select
                  name="area"
                  value={form.area}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      area: e.target.value,
                    }))
                  }
                  className="flex-1 bg-transparent text-gray-100 focus:outline-none focus:ring-0"
                  required={availableAreas.length > 0}
                  disabled={!form.ward || availableAreas.length === 0}
                >
                  <option value="">
                    {availableAreas.length === 0
                      ? "No areas found for this ward"
                      : "Select Area (Union)"}
                  </option>
                  {availableAreas.map((a) => (
                    <option key={a.id} value={a.name} className="bg-gray-800 text-gray-200">
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-700 to-blue-600 text-white font-semibold px-4 py-3 rounded-lg shadow-lg hover:from-blue-800 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              <FiUserPlus className="text-xl" /> Register
            </button>
          </form>
        </div>

        {/* Deliverymen List */}
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-2xl shadow-2xl p-8 border border-gray-700 animate-fade-in backdrop-blur-md">
          <h2 className="text-2xl font-extrabold mb-6 text-blue-400 text-center tracking-wide flex items-center justify-center gap-2 drop-shadow">
            <FiList className="text-blue-500" /> All Deliverymen
          </h2>
          {deliverymen.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No deliverymen found.</p>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-gradient-to-r from-gray-800 to-gray-900">
                  <tr>
                    <th className="py-3 px-5 border-b border-gray-700 text-left font-semibold text-blue-300">
                      <FiUser className="inline mr-2" /> Name
                    </th>
                    <th className="py-3 px-5 border-b border-gray-700 text-left font-semibold text-blue-300">
                      <FiPhone className="inline mr-2" /> Phone
                    </th>
                    <th className="py-3 px-5 border-b border-gray-700 text-left font-semibold text-blue-300">
                      <FiTruck className="inline mr-2" /> Vehicle
                    </th>
                    <th className="py-3 px-5 border-b border-gray-700 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {deliverymen.map((dm, idx) => (
                    <tr
                      key={dm.id || dm.deliveryman_id}
                      className={`transition-all duration-200 ${
                        idx % 2 === 0 ? "bg-gray-900/80" : "bg-gray-800/80"
                      } hover:bg-blue-900/60`}
                    >
                      <td className="py-3 px-5 border-b border-gray-700 text-gray-100">
                        {dm.name}
                      </td>
                      <td className="py-3 px-5 border-b border-gray-700 text-gray-100">
                        {dm.phone}
                      </td>
                      <td className="py-3 px-5 border-b border-gray-700 text-gray-100">
                        {dm.vehicleType || dm.vehicle_type}
                      </td>
                      <td className="py-3 px-5 border-b border-gray-700 text-center">
                        <button
                          className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-2 rounded-lg shadow hover:from-blue-800 hover:to-blue-900 transition-all duration-200 flex items-center justify-center gap-2 text-sm mx-auto"
                          onClick={() =>
                            handleViewDetails(dm.id || dm.deliveryman_id)
                          }
                        >
                          <FiEye /> View Details
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

      {/* Side Panel for Deliveryman Details */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border-l border-blue-800 z-50 p-8 flex flex-col transition-transform duration-300 ${
          selectedDeliveryman ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ willChange: "transform", backdropFilter: "blur(8px)" }}
      >
        {selectedDeliveryman && (
          <>
            <button
              className="self-end text-3xl font-bold text-blue-300 mb-4 hover:text-red-400 transition"
              onClick={handleClosePanel}
              aria-label="Close"
            >
              <FiX />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-blue-300 flex items-center gap-3 border-b border-blue-700 pb-3">
              <FiUser className="text-blue-400 text-3xl" /> Deliveryman Details
            </h3>
            <div className="space-y-4 text-gray-100 overflow-y-auto custom-scrollbar flex-1">
              <div className="flex items-center gap-3 text-lg">
                <FiUser className="text-blue-400" />
                <span className="font-semibold">Name:</span>{" "}
                {selectedDeliveryman.name}
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FiPhone className="text-blue-400" />
                <span className="font-semibold">Phone:</span>{" "}
                {selectedDeliveryman.phone}
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FiMail className="text-blue-400" />
                <span className="font-semibold">Email:</span>{" "}
                {selectedDeliveryman.email}
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FiTruck className="text-blue-400" />
                <span className="font-semibold">Vehicle Type:</span>{" "}
                {selectedDeliveryman.vehicleType ||
                  selectedDeliveryman.vehicle_type}
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FiMapPin className="text-blue-400" />
                <span className="font-semibold">Division:</span>{" "}
                {selectedDeliveryman.division}
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FiMap className="text-blue-400" />
                <span className="font-semibold">District:</span>{" "}
                {selectedDeliveryman.district}
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FiMap className="text-blue-400" />
                <span className="font-semibold">Ward (Upazila):</span>{" "}
                {selectedDeliveryman.ward}
              </div>
              <div className="flex items-center gap-3 text-lg">
                <FiMapPin className="text-blue-400" />
                <span className="font-semibold">Area (Union):</span>{" "}
                {selectedDeliveryman.area}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Logout Button */}
      <div className="fixed bottom-8 left-8 z-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-800 hover:to-red-900 transition-all duration-300 font-semibold shadow-lg text-lg transform hover:scale-105"
        >
          <FiLogOut className="text-xl" /> Logout
        </button>
      </div>
    </div>
  );
}

export default DeliveryServiceDashBoard;