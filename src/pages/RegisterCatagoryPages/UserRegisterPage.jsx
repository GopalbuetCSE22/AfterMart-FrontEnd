import React from "react";
import { useState } from "react";
import axios from "axios";

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
            onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Phone Number"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.phone}
            onChange={(e) => setFormData({ ...formdata, phone: e.target.value })}
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
          <input
            type="text"
            placeholder="Division"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.division}
            onChange={(e) =>
              setFormData({ ...formdata, division: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="District"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.district}
            onChange={(e) =>
              setFormData({ ...formdata, district: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Ward"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.ward}
            onChange={(e) => setFormData({ ...formdata, ward: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Area"
            className="bg-gray-700 border border-gray-600 p-3 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formdata.area}
            onChange={(e) => setFormData({ ...formdata, area: e.target.value })}
            required
          />
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
          <p className="mt-6 text-center text-green-400 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}

export default UserRegisterPage;
