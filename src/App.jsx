// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS for styling
import "./App.css"; // Import App.css

// Import your page components
import HomePage from './pages/HomePage';
import ProductDetail from './pages/ProductDetail';
import SearchResultPage from './pages/SearchResultPage';
import LoginPage from './pages/LoginPage'; // Main login entry point
import UserRegisterPage from './pages/RegisterCatagoryPages/UserRegisterPage'; // Specific register page for users
import DelivaryServiceRegisterPage from './pages/RegisterCatagoryPages/DelivaryServiceRegisterPage'; // Specific register page for delivery services
import UserLogin from './pages/LoginCatagoryPages/UserLogin'; // Specific login page for users
import AdminLogin from './pages/LoginCatagoryPages/AdminLogin'; // Specific login page for admins
import DelivaryManLogin from './pages/LoginCatagoryPages/DelivaryManLogin'; // Specific login page for delivery men
import DelivaryServiceLogin from './pages/LoginCatagoryPages/DelivaryServiceLogin'; // Specific login page for delivery services
import AdminDashBoard from './pages/DashBoard/AdminDashBoard'; // Admin dashboard
import UserDashBoard from './pages/DashBoard/UserDashBoard'; // User dashboard
import DeliveryServiceDashBoard from './pages/DashBoard/DeliveryServiceDashBoard'; // Delivery service dashboard
import DeliveryManDashBoard from './pages/DashBoard/DeliveryManDashBoard'; // Delivery man dashboard
import ProductManagementPage from './pages/DashBoard/ProductManagementPage';
import RegisterTypePage from './pages/RegisterCatagoryPages/RegisterTypePage';
//productmanagemet
import ProductSellPage from './pages/ProductSellPage'; // Product sell page

//import supabase from "./config/superBaseClient";


function App() {
  //console.log(supabase); // Log supabase to check its initialization

  return (
    <Router> {/* Using Router (alias for BrowserRouter) */}
      <Routes>
        {/* Main application routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/sell" element={<ProductSellPage />} /> {/* Route for selling a product */}


        {/* Authentication entry points */}
        <Route path="/login" element={<LoginPage />} /> {/* General login page */}
        {/* <Route path="/register" element={<UserRegisterPage />} /> General user registration */}

        {/* Specific Registration Pages */}
        {/* <Route path="/delivaryServiceRegister" element={<DelivaryServiceRegisterPage />} /> */}
        <Route path="/register/user" element={<UserRegisterPage />} />
        <Route path="/register/deliveryservice" element={<DelivaryServiceRegisterPage />} />

        {/* Specific Login Pages */}
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/delivaryServicelogin" element={<DelivaryServiceLogin />} />
        <Route path="/delivaryManlogin" element={<DelivaryManLogin />} />

        {/* Dashboard Routes */}
        <Route path="/adminDashboard" element={<AdminDashBoard />} />
        <Route path="/userDashboard" element={<UserDashBoard />} />
        <Route path="/deliveryServiceDashboard" element={<DeliveryServiceDashBoard />} />
        <Route path="/deliveryManDashboard" element={<DeliveryManDashBoard />} />

        {/* Other routes (placeholders if actual components are not yet created) */}
        {/* If you have actual components for /about, /contact, /terms, replace these Divs */}
        <Route path="/about" element={<div>About Us Page Placeholder</div>} />
        <Route path="/contact" element={<div>Contact Page Placeholder</div>} />
        <Route path="/terms" element={<div>Terms Page Placeholder</div>} />
        {/* <Route path="/dashboard/product/:productId" element={<ManageProduct />} /> */}
        {/* <Route path="/dashboard/product/:id" element={<ProductManagement />} /> */}
        <Route path="/registertype" element={<RegisterTypePage />} />
        <Route path="/dashboard/product/:id" element={<ProductManagementPage />} /> {/* Product management page */}

        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>

      {/* ToastContainer for displaying notifications */}
      <ToastContainer
        position="top-right" // Position of the toast (e.g., "top-left", "bottom-center")
        autoClose={3000}    // How long the toast stays visible (in ms)
        hideProgressBar={false} // Show/hide the progress bar
        newestOnTop={false}  // Whether new toasts appear on top of old ones
        closeOnClick         // Close toast when clicked
        rtl={false}          // Right-to-left layout
        pauseOnFocusLoss     // Pause timer when window loses focus
        draggable            // Allow dragging toasts
        pauseOnHover         // Pause timer when mouse hovers over toast
        theme="dark"         // Theme of the toast ("light", "dark", "colored")
      />
    </Router>
  );
}

export default App;
