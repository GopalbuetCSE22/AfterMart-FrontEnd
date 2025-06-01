import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import UserRegisterPage from "./pages/RegisterCatagoryPages/UserRegisterPage";
import supabase from "./config/superBaseClient";
import UserLogin from "./pages/LoginCatagoryPages/UserLogin";
import AdminLogin from "./pages/LoginCatagoryPages/AdminLogin";
import DelivaryManLogin from "./pages/LoginCatagoryPages/DelivaryManLogin";
import DelivaryServiceLogin from "./pages/LoginCatagoryPages/DelivaryServiceLogin";
import DelivaryServiceRegisterPage from "./pages/RegisterCatagoryPages/DelivaryServiceRegisterPage";
import AdminDashBoard from "./pages/DashBoard/AdminDashBoard";
import UserDashBoard from "./pages/DashBoard/UserDashBoard";

function App() {
  console.log(supabase);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Register  */}
        <Route path="/register" element={<UserRegisterPage />} />
        <Route
          path="/delivaryServiceRegister"
          element={<DelivaryServiceRegisterPage />}
        />
        {/* login  */}
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route
          path="/delivaryServicelogin"
          element={<DelivaryServiceLogin />}
        />
        <Route path="/delivaryManlogin" element={<DelivaryManLogin />} />

        {/* Dashboard */}
        <Route path="/adminDashboard" element={<AdminDashBoard />} />
        <Route path="/userDashboard" element={<UserDashBoard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
