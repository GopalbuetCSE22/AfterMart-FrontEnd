import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import {
  FaBuilding,
  FaIdBadge,
  FaLock,
  FaTruckMoving,
  FaMapMarkedAlt,
  FaCity,
  FaMapPin,
  FaLocationArrow,
  FaArrowLeft, // Icon for the back button
} from "react-icons/fa";

const BDAPI_BASE_URL = 'https://bdapi.vercel.app/api/v.1';

function DelivaryServiceRegisterPage() {
  const navigate = useNavigate(); // Initialize navigate hook

  const [formdata, setFormData] = useState({
    companyName: "",
    tradeLicense: "",
    password: "",
    division: "",
    district: "",
    ward: "",
    area: "",
  });
  const [message, setMessage] = useState("");

  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);

  // --- Effect: Fetch divisions on component mount ---
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await axios.get(`${BDAPI_BASE_URL}/division`);
        if (res.data && Array.isArray(res.data.data)) {
          setAvailableDivisions(res.data.data);
        } else {
          console.error("BDAPI /division endpoint did not return expected data.data array:", res.data);
          setAvailableDivisions([]);
        }
      } catch (err) {
        console.error("Error fetching divisions from BDAPI:", err);
      }
    };
    fetchDivisions();
  }, []);

  // --- Effect: Fetch districts when division changes ---
  useEffect(() => {
    if (!formdata.division || availableDivisions.length === 0) {
      setAvailableDistricts([]);
      setAvailableWards([]);
      setAvailableAreas([]);
      setFormData(prev => ({ ...prev, district: "", ward: "", area: "" }));
      return;
    }

    const selectedDivision = availableDivisions.find(div => div.name === formdata.division);

    if (selectedDivision) {
      const fetchDistricts = async () => {
        try {
          const res = await axios.get(`${BDAPI_BASE_URL}/district/${selectedDivision.id}`);
          if (res.data && Array.isArray(res.data.data)) {
            setAvailableDistricts(res.data.data);
          } else {
            console.error("BDAPI /district endpoint did not return expected data.data array for division ID", selectedDivision.id, ":", res.data);
            setAvailableDistricts([]);
          }
        } catch (err) {
          console.error("Error fetching districts from BDAPI:", err);
        }
      };
      fetchDistricts();
    } else {
      setAvailableDistricts([]);
    }
  }, [formdata.division, availableDivisions]);

  // --- Effect: Fetch wards (upazilas) when district changes ---
  useEffect(() => {
    if (!formdata.district || availableDistricts.length === 0) {
      setAvailableWards([]);
      setAvailableAreas([]);
      setFormData(prev => ({ ...prev, ward: "", area: "" }));
      return;
    }

    const selectedDistrict = availableDistricts.find(dist => dist.name === formdata.district);

    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const res = await axios.get(`${BDAPI_BASE_URL}/upazilla/${selectedDistrict.id}`);
          if (res.data && Array.isArray(res.data.data)) {
            setAvailableWards(res.data.data);
          } else {
            console.error("BDAPI /upazilla endpoint did not return expected data.data array for district ID", selectedDistrict.id, ":", res.data);
            setAvailableWards([]);
          }
        } catch (err) {
          console.error("Error fetching upazilas (wards) from BDAPI:", err);
        }
      };
      fetchWards();
    } else {
      setAvailableWards([]);
    }
  }, [formdata.district, availableDistricts]);

  // --- Effect: Fetch areas (unions) when ward (upazila) changes ---
  useEffect(() => {
    if (!formdata.ward || availableWards.length === 0) {
      setAvailableAreas([]);
      setFormData(prev => ({ ...prev, area: "" }));
      return;
    }

    const selectedWard = availableWards.find(w => w.name === formdata.ward);

    if (selectedWard) {
      const fetchAreas = async () => {
        try {
          const res = await axios.get(`${BDAPI_BASE_URL}/union/${selectedWard.id}`);
          if (res.data && Array.isArray(res.data.data)) {
            setAvailableAreas(res.data.data);
          } else {
            console.error("BDAPI /union endpoint did not return expected data.data array for upazila ID", selectedWard.id, ":", res.data);
            setAvailableAreas([]);
          }
        } catch (err) {
          console.error("Error fetching unions (areas) from BDAPI:", err);
        }
      };
      fetchAreas();
    } else {
      setAvailableAreas([]);
    }
  }, [formdata.ward, availableWards]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let newState = { ...prev, [name]: value };

      if (name === "division") {
        newState.district = "";
        newState.ward = "";
        newState.area = "";
      } else if (name === "district") {
        newState.ward = "";
        newState.area = "";
      } else if (name === "ward") {
        newState.area = "";
      }
      return newState;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Registering...");
    try {
      if (!formdata.division || !formdata.district || !formdata.ward || !formdata.area) {
        setMessage("⚠️ Please select a complete address (Division, District, Ward, Area).");
        return;
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/api/delivery/register`, formdata);
      
      setMessage("🎉 Registration successful!");
      setFormData({
        companyName: "",
        tradeLicense: "",
        password: "",
        division: "",
        district: "",
        ward: "",
        area: "",
      });
    } catch (error) {
      console.error("Error during registration:", error);
      setMessage("⚠️ Error registering delivery service. Please try again.");
    }
  };

  const handleBackClick = () => {
    navigate('/registertype'); // Navigate to the /registertype page
  };

  const inputStyle =
    "border border-gray-700 bg-gray-900 text-gray-100 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-700 pl-10";
  const selectStyle =
    "border border-gray-700 bg-gray-900 text-gray-100 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-700 pl-10 appearance-none cursor-pointer";
  const iconWrapperStyle = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 py-8 font-inter">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl border border-blue-700">
        <div className="flex justify-center mb-6">
          <FaTruckMoving className="text-blue-400 text-6xl" />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Delivery Service Registration
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Company Name */}
          <div className="relative">
            <FaBuilding className={iconWrapperStyle} />
            <input
              type="text"
              placeholder="Company Name"
              className={inputStyle}
              name="companyName"
              value={formdata.companyName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Trade License */}
          <div className="relative">
            <FaIdBadge className={iconWrapperStyle} />
            <input
              type="text"
              placeholder="Trade License"
              className={inputStyle}
              name="tradeLicense"
              value={formdata.tradeLicense}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className={iconWrapperStyle} />
            <input
              type="password"
              placeholder="Password"
              className={inputStyle}
              name="password"
              value={formdata.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Division Dropdown */}
          <div className="relative">
            <FaMapMarkedAlt className={iconWrapperStyle} />
            <select
              className={selectStyle}
              name="division"
              value={formdata.division}
              onChange={handleChange}
              required
            >
              <option value="">Select Division</option>
              {(Array.isArray(availableDivisions) ? availableDivisions : []).map(div => (
                <option key={div.id} value={div.name}>
                  {div.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* District Dropdown */}
          <div className="relative">
            <FaCity className={iconWrapperStyle} />
            <select
              className={selectStyle}
              name="district"
              value={formdata.district}
              onChange={handleChange}
              disabled={!formdata.division || !Array.isArray(availableDistricts) || availableDistricts.length === 0}
              required
            >
              <option value="">Select District</option>
              {(Array.isArray(availableDistricts) ? availableDistricts : []).map(dist => (
                <option key={dist.id} value={dist.name}>
                  {dist.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* Ward (Upazila) Dropdown */}
          <div className="relative">
            <FaMapPin className={iconWrapperStyle} />
            <select
              className={selectStyle}
              name="ward"
              value={formdata.ward}
              onChange={handleChange}
              disabled={!formdata.district || !Array.isArray(availableWards) || availableWards.length === 0}
              required
            >
              <option value="">Select Ward (Upazila)</option>
              {(Array.isArray(availableWards) ? availableWards : []).map(w => (
                <option key={w.id} value={w.name}>
                  {w.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* Area (Union) Dropdown */}
          <div className="relative">
            <FaLocationArrow className={iconWrapperStyle} />
            <select
              className={selectStyle}
              name="area"
              value={formdata.area}
              onChange={handleChange}
              disabled={!formdata.ward || !Array.isArray(availableAreas) || availableAreas.length === 0}
              required
            >
              <option value="">Select Area (Union)</option>
              {(Array.isArray(availableAreas) ? availableAreas : []).map(a => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white px-4 py-3 rounded hover:bg-blue-800 transition duration-300 font-semibold shadow-lg"
          >
            Register
          </button>

          {/* Back Button */}
          <button
            type="button" // Important: set type to "button" to prevent form submission
            onClick={handleBackClick}
            className="w-full bg-gray-600 text-white px-4 py-3 rounded hover:bg-gray-700 transition duration-300 font-semibold shadow-lg flex items-center justify-center gap-2 mt-3"
          >
            <FaArrowLeft /> Back
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-xl text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
}

export default DelivaryServiceRegisterPage;