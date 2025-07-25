import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Lock, MapPin, Home, Camera, Loader2, CheckCircle, XCircle, ArrowLeft } from "lucide-react"; // Added ArrowLeft
//login page link for redirect after registration
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate

// Base URL for the Bangladeshi API for location data
const BDAPI_BASE_URL = "https://bdapi.vercel.app/api/v.1";
// Base URL for your backend API
const BACKEND_BASE_URL = "http://localhost:5000/api"; // Centralize backend URL

function UserRegisterPage() {
  const navigate = useNavigate(); // Add navigate hook

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
    profile_picture: null, // This will hold the File object initially
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null); // For displaying local image preview
  const [isHovering, setIsHovering] = useState(false); // For hover effect on profile pic
  const [isImageUploading, setIsImageUploading] = useState(false); // New state for image upload loading
  const [isRegistering, setIsRegistering] = useState(false); // New state for overall registration loading

  // States for cascading dropdowns for location data
  const [availableDivisions, setAvailableDivisions] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);

  // --- Effects for fetching location data ---

  // Fetch divisions on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const res = await fetch(`${BDAPI_BASE_URL}/division`);
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setAvailableDivisions(data.data);
        } else {
          console.error("BDAPI: Divisions data is not an array:", data);
          setError("Failed to load divisions. Please try again later.");
        }
      } catch (err) {
        console.error("Failed to fetch divisions:", err);
        setError("Network error: Could not fetch divisions.");
      }
    };
    fetchDivisions();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch districts when division changes
  useEffect(() => {
    if (!formdata.division) {
      setAvailableDistricts([]);
      setAvailableWards([]);
      setAvailableAreas([]);
      return;
    }
    const selected = availableDivisions.find((div) => div.name === formdata.division);
    if (selected) {
      fetch(`${BDAPI_BASE_URL}/district/${selected.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.data)) {
            setAvailableDistricts(data.data);
          } else {
            console.error("BDAPI: Districts data is not an array:", data);
            setAvailableDistricts([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch districts:", err);
          setAvailableDistricts([]);
          setError("Network error: Could not fetch districts.");
        });
    }
  }, [formdata.division, availableDivisions]);

  // Fetch wards (upazilas) when district changes
  useEffect(() => {
    if (!formdata.district) {
      setAvailableWards([]);
      setAvailableAreas([]);
      return;
    }
    const selected = availableDistricts.find((d) => d.name === formdata.district);
    if (selected) {
      fetch(`${BDAPI_BASE_URL}/upazilla/${selected.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.data)) {
            setAvailableWards(data.data);
          } else {
            console.error("BDAPI: Wards data is not an array:", data);
            setAvailableWards([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch wards:", err);
          setAvailableWards([]);
          setError("Network error: Could not fetch wards.");
        });
    }
  }, [formdata.district, availableDistricts]);

  // Fetch areas (unions) when ward changes
  useEffect(() => {
    if (!formdata.ward) {
      setAvailableAreas([]);
      return;
    }
    const selected = availableWards.find((w) => w.name === formdata.ward);
    if (selected) {
      fetch(`${BDAPI_BASE_URL}/union/${selected.id}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.data)) {
            setAvailableAreas(data.data);
          } else {
            console.error("BDAPI: Areas data is not an array:", data);
            setAvailableAreas([]);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch areas:", err);
          setAvailableAreas([]);
          setError("Network error: Could not fetch areas.");
        });
    }
  }, [formdata.ward, availableWards]);

  // --- Handlers ---

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formdata, profile_picture: file });
      setPreviewUrl(URL.createObjectURL(file)); // Create a local URL for instant preview
    } else {
      setFormData({ ...formdata, profile_picture: null });
      setPreviewUrl(null);
    }
    // Clear any previous image upload specific messages/errors
    setMessage("");
    setError("");
  };

  // Handle form submission
  const handlesubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setMessage(""); // Clear previous success messages
    setError(""); // Clear previous error messages
    setIsRegistering(true); // Start overall registration loading

    let profileImageUrl = null; // This will store the URL from ImageKit

    try {
      // --- Step 1: Upload image to ImageKit via your backend proxy ---
      if (formdata.profile_picture) {
        setIsImageUploading(true); // Start image upload loading
        const imgForm = new FormData();
        imgForm.append("image", formdata.profile_picture); // 'image' must match Multer field name on backend

        // Send the image to YOUR backend's image upload endpoint for registration
        const uploadRes = await fetch(`${BACKEND_BASE_URL}/uploadImage/uploadRegisterPic`, {
          method: 'POST',
          body: imgForm
        });

        const uploadData = await uploadRes.json();
        setIsImageUploading(false); // End image upload loading

        if (uploadRes.ok && uploadData.url) {
          profileImageUrl = uploadData.url;
        } else {
          // If image upload fails, throw an error to stop registration
          throw new Error(uploadData.error || 'Profile picture upload failed. Please try again.');
        }
      }

      // --- Step 2: Prepare payload for user registration with the ImageKit URL ---
      const payload = {
        name: formdata.name,
        email: formdata.email,
        phone: formdata.phone,
        password: formdata.password,
        division: formdata.division,
        district: formdata.district,
        ward: formdata.ward,
        area: formdata.area,
        house_and_road: formdata.house_and_road,
        profile_picture: profileImageUrl, // Use the uploaded image URL (will be null if no image was selected)
      };

      // --- Step 3: Send registration data to your main backend registration endpoint ---
      const response = await fetch(`${BACKEND_BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      // Handle specific status codes from your backend
      if (response.status === 409) {
        setError("User with this email already exists.");
        return; // Stop execution
      }

      // Check if overall registration response was successful
      if (!response.ok) {
        const errorData = await response.json();
        // Use the error message from the backend if available, otherwise a generic one
        throw new Error(errorData.message || 'Registration failed. Please check your details.');
      }

      // On successful registration
      setMessage("Registration successful! Your account has been created.");

      // Clear form data and preview after successful registration
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
        profile_picture: null,
      });
      setPreviewUrl(null);

    } catch (err) {
      console.error("Registration process error:", err);
      setError(err.message || "An unexpected error occurred during registration.");
    } finally {
      setIsRegistering(false); // End overall registration loading
      setIsImageUploading(false); // Ensure image upload loading is off in case of error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-8 text-center border-b border-gray-600/50 relative">
          {/* Back Button */}
          <button
            onClick={() => navigate('/registertype')}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-gray-600/50 hover:bg-gray-600/70 text-gray-200 hover:text-white rounded-lg transition-all duration-300 border border-gray-500/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-300 text-lg">Join our community today</p>
        </div>

        <div className="p-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-10">
            <h3 className="text-xl font-semibold text-gray-200 mb-6">Profile Picture</h3>
            <div
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="w-32 h-32 rounded-full border-2 border-dashed border-gray-500 p-1 hover:border-gray-400 transition-colors duration-300">
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center overflow-hidden relative">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="w-12 h-12 text-gray-400" />
                  )}

                  {/* Hover Overlay for upload/update */}
                  <div className={`absolute inset-0 bg-black/70 flex flex-col items-center justify-center transition-opacity duration-300 rounded-full ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                    {isImageUploading ? (
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-white mb-1" />
                        <span className="text-white text-xs font-medium">
                          {previewUrl ? 'Update Image' : 'Select Image'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {/* Hidden file input for picture selection */}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isImageUploading || isRegistering} // Disable input during upload/registration
              />
            </div>
            {isImageUploading && (
              <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                <Loader2 className="w-4 h-4 animate-spin" /> Uploading image...
              </p>
            )}
          </div>

          {/* Registration Form */}
          <form onSubmit={handlesubmit} className="space-y-8">
            {/* Personal Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-400" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name Input */}
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                    value={formdata.name}
                    onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
                    required
                    disabled={isRegistering}
                  />
                </div>
                {/* Email Address Input */}
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                    value={formdata.email}
                    onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                    required
                    disabled={isRegistering}
                  />
                </div>
                {/* Phone Number Input */}
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                    value={formdata.phone}
                    onChange={(e) => setFormData({ ...formdata, phone: e.target.value })}
                    required
                    disabled={isRegistering}
                  />
                </div>
                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                    value={formdata.password}
                    onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                    required
                    disabled={isRegistering}
                  />
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Division Select */}
                <select
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                  value={formdata.division}
                  onChange={(e) => setFormData({ ...formdata, division: e.target.value, district: "", ward: "", area: "" })}
                  required
                  disabled={isRegistering || availableDivisions.length === 0}
                >
                  <option value="" className="bg-gray-800">Select Division</option>
                  {availableDivisions.map((div) => (
                    <option key={div.id} value={div.name} className="bg-gray-800">{div.name}</option>
                  ))}
                </select>

                {/* District Select */}
                <select
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-500/20 transition-all duration-300"
                  value={formdata.district}
                  onChange={(e) => setFormData({ ...formdata, district: e.target.value, ward: "", area: "" })}
                  required
                  disabled={isRegistering || !formdata.division || availableDistricts.length === 0}
                >
                  <option value="" className="bg-gray-800">Select District</option>
                  {availableDistricts.map((d) => (
                    <option key={d.id} value={d.name} className="bg-gray-800">{d.name}</option>
                  ))}
                </select>

                {/* Ward (Upazila) Select */}
                <select
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  value={formdata.ward}
                  onChange={(e) => setFormData({ ...formdata, ward: e.target.value, area: "" })}
                  required
                  disabled={isRegistering || !formdata.district || availableWards.length === 0}
                >
                  <option value="" className="bg-gray-800">Select Ward (Upazila)</option>
                  {availableWards.map((w) => (
                    <option key={w.id} value={w.name} className="bg-gray-800">{w.name}</option>
                  ))}
                </select>

                {/* Area (Union) Select */}
                <select
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  value={formdata.area}
                  onChange={(e) => setFormData({ ...formdata, area: e.target.value })}
                  required
                  disabled={isRegistering || !formdata.ward || availableAreas.length === 0}
                >
                  <option value="" className="bg-gray-800">Select Area (Union)</option>
                  {availableAreas.map((a) => (
                    <option key={a.id} value={a.name} className="bg-gray-800">{a.name}</option>
                  ))}
                </select>
              </div>

              {/* House Number & Road Input */}
              <div className="mt-4 relative">
                <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="House Number & Road"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                  value={formdata.house_and_road}
                  onChange={(e) => setFormData({ ...formdata, house_and_road: e.target.value })}
                  required
                  disabled={isRegistering}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className={`px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl transform transition-all duration-300 shadow-lg
                  ${isRegistering ? 'opacity-70 cursor-not-allowed' : 'hover:from-emerald-700 hover:to-teal-700 hover:scale-105 hover:shadow-xl'}`}
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Registering...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Messages */}
          {message && (
            <div className="mt-6 p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl text-center">
              <div className="flex items-center justify-center gap-3 mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <p className="text-green-400 font-semibold text-lg">{message}</p>
              </div>
              <p className="text-gray-300 text-sm mt-2">
                Welcome!{" "}
                <Link
                  to="/userlogin"
                  className="text-blue-400 hover:text-blue-300 font-semibold underline transition duration-150"
                >
                  Login here
                </Link>
              </p>
            </div>
          )}
          {error && (
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-center flex items-center justify-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserRegisterPage;
