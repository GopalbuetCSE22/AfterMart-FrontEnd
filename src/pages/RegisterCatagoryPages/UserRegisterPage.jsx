// import React from "react";
// import { useState } from "react";
// import axios from "axios";

// function UserRegisterPage() {
//   const [formdata, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     division: "",
//     district: "",
//     ward: "",
//     area: "",
//     house_and_road: "",
//   });
//   const [message, setMessage] = useState("");

//   const handlesubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post("http://localhost:5000/api/users/register", formdata);
//       setMessage("The data is successfully taken");
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         password: "",
//         division: "",
//         district: "",
//         ward: "",
//         area: "",
//         house_and_road: "",
//       });
//     } catch (error) {
//       console.error("Error during registration:", error);
//       setMessage("Error registering user");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8">
//         <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-100 tracking-wide">
//           User Registration
//         </h1>
//         <form className="flex flex-col space-y-4" onSubmit={handlesubmit}>
//           <input
//             type="text"
//             placeholder="Name"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.name}
//             onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
//             required
//           />
//           <input
//             type="email"
//             placeholder="Email"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.email}
//             onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
//             required
//           />
//           <input
//             type="number"
//             placeholder="Phone Number"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.phone}
//             onChange={(e) => setFormData({ ...formdata, phone: e.target.value })}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.password}
//             onChange={(e) =>
//               setFormData({ ...formdata, password: e.target.value })
//             }
//             required
//           />
//           <input
//             type="text"
//             placeholder="Division"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.division}
//             onChange={(e) =>
//               setFormData({ ...formdata, division: e.target.value })
//             }
//             required
//           />
//           <input
//             type="text"
//             placeholder="District"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.district}
//             onChange={(e) =>
//               setFormData({ ...formdata, district: e.target.value })
//             }
//             required
//           />
//           <input
//             type="text"
//             placeholder="Ward"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.ward}
//             onChange={(e) => setFormData({ ...formdata, ward: e.target.value })}
//             required
//           />
//           <input
//             type="text"
//             placeholder="Area"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.area}
//             onChange={(e) => setFormData({ ...formdata, area: e.target.value })}
//             required
//           />
//           <input
//             type="text"
//             placeholder="House and Road"
//             className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             value={formdata.house_and_road}
//             onChange={(e) =>
//               setFormData({ ...formdata, house_and_road: e.target.value })
//             }
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
//           >
//             Register
//           </button>
//         </form>
//         {message && (
//           <p className="mt-6 text-center text-green-400 font-medium">{message}</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default UserRegisterPage;
import React, { useState, useEffect } from "react";
import axios from "axios";

const BDAPI_BASE_URL = "https://bdapi.vercel.app/api/v.1";

function UserRegisterPage() {
  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    division: "",
    district: "",
    ward: "",
    area: "",
    house_and_road: "",
  });
  const [message, setMessage] = useState("");

  // Address dropdown states
  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);

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
        setAvailableDivisions([]);
      }
    };
    fetchDivisions();
  }, []);

  // Fetch districts when division changes
  useEffect(() => {
    if (!formdata.division) {
      setAvailableDistricts([]);
      setAvailableWards([]);
      setAvailableAreas([]);
      return;
    }
    const selectedDivision = availableDivisions.find(
      (div) => div.name === formdata.division
    );
    if (selectedDivision) {
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
          setAvailableDistricts([]);
        }
      };
      fetchDistricts();
    } else {
      setAvailableDistricts([]);
    }
    setAvailableWards([]);
    setAvailableAreas([]);
    // Do not reset form fields here
  }, [formdata.division, availableDivisions]);

  // Fetch wards (upazilas) when district changes
  useEffect(() => {
    if (!formdata.district) {
      setAvailableWards([]);
      setAvailableAreas([]);
      return;
    }
    const selectedDistrict = availableDistricts.find(
      (dist) => dist.name === formdata.district
    );
    if (selectedDistrict) {
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
          setAvailableWards([]);
        }
      };
      fetchWards();
    } else {
      setAvailableWards([]);
    }
    setAvailableAreas([]);
    // Do not reset form fields here
  }, [formdata.district, availableDistricts]);

  // Fetch areas (unions) when ward changes
  useEffect(() => {
    if (!formdata.ward) {
      setAvailableAreas([]);
      return;
    }
    const selectedWard = availableWards.find((w) => w.name === formdata.ward);
    if (selectedWard) {
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
          setAvailableAreas([]);
        }
      };
      fetchAreas();
    } else {
      setAvailableAreas([]);
    }
    // Do not reset form fields here
  }, [formdata.ward, availableWards]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/register", formdata);
      setMessage("The data is successfully taken");
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        division: "",
        district: "",
        ward: "",
        area: "",
        house_and_road: "",
      });
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("Error registering user");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-100 tracking-wide">
          User Registration
        </h1>
        <form className="flex flex-col space-y-4" onSubmit={handlesubmit}>
          <input
            type="text"
            placeholder="Name"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.name}
            onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.email}
            onChange={(e) =>
              setFormData({ ...formdata, email: e.target.value })
            }
            required
          />
          <input
            type="number"
            placeholder="Phone Number"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.phone}
            onChange={(e) =>
              setFormData({ ...formdata, phone: e.target.value })
            }
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.password}
            onChange={(e) =>
              setFormData({ ...formdata, password: e.target.value })
            }
            required
          />

          {/* Division Dropdown */}
          <select
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.division}
            onChange={(e) =>
              setFormData((fd) => ({
                ...fd,
                division: e.target.value,
                district: "",
                ward: "",
                area: "",
              }))
            }
            required
          >
            <option value="">Select Division</option>
            {availableDivisions.map((div) => (
              <option key={div.id} value={div.name}>
                {div.name}
              </option>
            ))}
          </select>

          {/* District Dropdown */}
          <select
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.district}
            onChange={(e) =>
              setFormData((fd) => ({
                ...fd,
                district: e.target.value,
                ward: "",
                area: "",
              }))
            }
            required
            disabled={!formdata.division || availableDistricts.length === 0}
          >
            <option value="">Select District</option>
            {availableDistricts.map((dist) => (
              <option key={dist.id} value={dist.name}>
                {dist.name}
              </option>
            ))}
          </select>

          {/* Ward (Upazila) Dropdown */}
          <select
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.ward}
            onChange={(e) =>
              setFormData((fd) => ({
                ...fd,
                ward: e.target.value,
                area: "",
              }))
            }
            required
            disabled={!formdata.district || availableWards.length === 0}
          >
            <option value="">Select Ward (Upazila)</option>
            {availableWards.map((w) => (
              <option key={w.id} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>

          {/* Area (Union) Dropdown */}
          <select
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.area}
            onChange={(e) =>
              setFormData((fd) => ({
                ...fd,
                area: e.target.value,
              }))
            }
            required
            disabled={!formdata.ward || availableAreas.length === 0}
          >
            <option value="">Select Area (Union)</option>
            {availableAreas.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="House and Road"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.house_and_road}
            onChange={(e) =>
              setFormData({ ...formdata, house_and_road: e.target.value })
            }
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-4 py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg"
          >
            Register
          </button>
        </form>
        {message && (
          <p className="mt-6 text-center text-green-400 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UserRegisterPage;
