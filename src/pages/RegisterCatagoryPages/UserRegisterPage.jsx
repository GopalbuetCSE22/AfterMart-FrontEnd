import React from "react";
import { useState } from "react";
import axios from "axios"

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
    <div>
      <h1 className="text-2xl font-bold mb-4">User Registration Page</h1>
      <form className="flex flex-col space-y-4" onSubmit={handlesubmit}>
        <input
          type="text"
          placeholder="Name"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.name}
          onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.email}
          onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="phone number"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.phone}
          onChange={(e) => setFormData({ ...formdata, phone: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.password}
          onChange={(e) =>
            setFormData({ ...formdata, password: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Dvision"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.division}
          onChange={(e) =>
            setFormData({ ...formdata, division: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="District"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.district}
          onChange={(e) =>
            setFormData({ ...formdata, district: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Ward"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.ward}
          onChange={(e) => setFormData({ ...formdata, ward: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Area"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.area}
          onChange={(e) => setFormData({ ...formdata, area: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="house and road"
          className="border border-gray-300 p-2 rounded mb-4"
          value={formdata.house_and_road}
          onChange={(e) => setFormData({ ...formdata, house_and_road: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Register
        </button>
      </form>
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}

export default UserRegisterPage;
