import React, { useState } from "react";
import axios from "axios";
function DelivaryServiceRegisterPage() {
  const [formdata, setFormData] = useState({
    companyName: "",
    tradeLicense: "",
    division: "",
    district: "",
    ward: "",
    area: "",
  });
  const [message, setMessage] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/delivery/register",
        formdata
      );
      setMessage("The data is successfully taken");
      setFormData({
        companyName: "",
        tradeLicense: "",
        division: "",
        district: "",
        ward: "",
        area: "",
      });
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("Error registering user");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Delivery Service Registration
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Company Name"
            className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formdata.companyName}
            onChange={(e) =>
              setFormData({ ...formdata, companyName: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Trade Licence"
            className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formdata.tradeLicense}
            onChange={(e) =>
              setFormData({ ...formdata, tradeLicense: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Division"
            className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formdata.division}
            onChange={(e) =>
              setFormData({ ...formdata, division: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="District"
            className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formdata.district}
            onChange={(e) =>
              setFormData({ ...formdata, district: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Ward"
            className="border border-gray-300 p-3 rounded mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formdata.ward}
            onChange={(e) => setFormData({ ...formdata, ward: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Area"
            className="border border-gray-300 p-3 rounded mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={formdata.area}
            onChange={(e) => setFormData({ ...formdata, area: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600 transition duration-300 font-semibold"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-2xl text-gray-500">{message}</p>
        )}
      </div>
    </div>
  );
}

export default DelivaryServiceRegisterPage;
