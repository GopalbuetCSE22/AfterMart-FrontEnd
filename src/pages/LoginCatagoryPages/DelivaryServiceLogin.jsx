// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// function DelivaryServiceLogin() {
//   const [formdata, setFormData] = useState({
//     companyName: "",
//     tradeLicense: "",
//   });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/auth/delivaryServicelogin",
//         formdata
//       );
//       const { token } = response.data;
//       localStorage.setItem("authToken", token);
//       setMessage("Login successful!");
//       console.log("Login response:", response.data);
//       localStorage.setItem("company_id", response.data.company_id);
//       setFormData({ companyName: "", tradeLicense: "" });
//       navigate("/deliveryServiceDashboard");
//     } catch (error) {
//       console.error("Error during login:", error);
//       setMessage("Invalid username or password");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//       <form
//         className="flex flex-col space-y-5 bg-gray-900 bg-opacity-95 p-10 rounded-xl shadow-2xl w-full max-w-md"
//         onSubmit={handleSubmit}
//       >
//         <h2 className="text-3xl font-bold text-white mb-6 text-center">
//           Delivery Service Login
//         </h2>
//         <input
//           type="text"
//           placeholder="Company Name"
//           className="border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
//           value={formdata.companyName}
//           onChange={(e) =>
//             setFormData({ ...formdata, companyName: e.target.value })
//           }
//           required
//         />
//         <input
//           type="text"
//           placeholder="Trade License"
//           className="border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
//           value={formdata.tradeLicense}
//           onChange={(e) =>
//             setFormData({ ...formdata, tradeLicense: e.target.value })
//           }
//           required
//         />
//         <button
//           type="submit"
//           className="bg-blue-700 text-white px-4 py-3 rounded font-semibold hover:bg-blue-800 transition duration-300 shadow"
//         >
//           Login
//         </button>
//         <a
//           href="/register/deliveryservice"
//           className="text-blue-400 hover:underline text-center"
//         >
//           Don't have an account? Register here
//         </a>
//         <a
//           href="/"
//           className="text-gray-400 hover:text-white hover:underline text-center"
//         >
//           Back to Home
//         </a>
//         {message && (
//           <p className="text-center text-red-400 font-medium">{message}</p>
//         )}
//       </form>
//     </div>
//   );
// }

// export default DelivaryServiceLogin;
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

function DelivaryServiceLogin() {
  const [formdata, setFormData] = useState({
    companyName: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/delivaryServicelogin",
        formdata
      );
      const { token, company_id } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("company_id", company_id);
      setMessage("Login successful!");
      setFormData({ companyName: "", password: "" });
      navigate("/deliveryServiceDashboard");
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Invalid company name or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <form
        className="flex flex-col space-y-5 bg-gray-900 bg-opacity-95 p-10 rounded-xl shadow-2xl w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Delivery Service Login
        </h2>

        {/* Company Name Input */}
        <input
          type="text"
          placeholder="Company Name"
          className="border border-gray-700 bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          value={formdata.companyName}
          onChange={(e) =>
            setFormData({ ...formdata, companyName: e.target.value })
          }
          required
        />

        {/* Password Input with Eye Toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="border border-gray-700 bg-gray-800 text-white p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            value={formdata.password}
            onChange={(e) =>
              setFormData({ ...formdata, password: e.target.value })
            }
            required
          />
          <div
            className="absolute right-3 top-3 text-white cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-700 text-white px-4 py-3 rounded font-semibold hover:bg-blue-800 transition duration-300 shadow"
        >
          Login
        </button>

        {/* Navigation Links */}
        <a
          href="/register/deliveryservice"
          className="text-blue-400 hover:underline text-center"
        >
          Don&apos;t have an account? Register here
        </a>
        <a
          href="/"
          className="text-gray-400 hover:text-white hover:underline text-center"
        >
          Back to Home
        </a>

        {/* Message Display */}
        {message && (
          <p className="text-center text-red-400 font-medium">{message}</p>
        )}
      </form>
    </div>
  );
}

export default DelivaryServiceLogin;