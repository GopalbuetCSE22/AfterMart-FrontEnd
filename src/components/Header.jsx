import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  Moon,
  Sun,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Upload,
  AwardIcon,
} from "lucide-react";
import { toast } from "react-toastify";

const PORT = 5000;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedInDeliveryMan, setIsLoggedInDeliveryMan] = useState(false);
  const [isLoggedInDeliveryCompany, setIsLoggedInDeliveryCompany] =
    useState(false);
  const [isLoggedInAdmin, setIsLoggedInAdmin] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [localKeywords, setLocalKeywords] = useState([]);

  const navigate = useNavigate();

  // Effect to check login status on component mount and when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const user_id = localStorage.getItem("user_id");
      setIsLoggedIn(!!user_id);

      const deliverymanID = localStorage.getItem("deliveryman_id");
      setIsLoggedInDeliveryMan(!!deliverymanID);

      const company_id = localStorage.getItem("company_id");
      setIsLoggedInDeliveryCompany(!!company_id);

      const admin_id = localStorage.getItem("admin_id");
      setIsLoggedInAdmin(!!admin_id);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);
    return () => window.removeEventListener("storage", checkLoginStatus);
  }, []);

  // Scroll listener to toggle header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Logout function
  const handleLogout = () => {
    // localStorage.removeItem("authToken");
    // localStorage.removeItem("user_id");
    localStorage.clear();
    setIsLoggedIn(false);
    setIsLoggedInDeliveryCompany(false);
    setIsLoggedInDeliveryMan(false);
    setIsLoggedInAdmin(false);
    navigate("/");
    toast.info("You have been logged out.");
  };

  // Dark mode toggle function
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    document.documentElement.classList.toggle("dark", !isDarkMode);
  };

  // Load all keywords once on mount
  useEffect(() => {
    const fetchInitialKeywords = async () => {
      try {
        const res = await fetch(
          `http://localhost:${PORT}/api/products/search/initialKeywords`
        );
        const data = await res.json();
        setLocalKeywords(data.keywords || []);
      } catch (error) {
        console.error("Failed to fetch initial keywords:", error);
      }
    };

    fetchInitialKeywords();
  }, []);

  // Filter suggestions locally
  useEffect(() => {
    if (!searchKeyword.trim()) {
      setSuggestions([]);
      return;
    }

    const lowerInput = searchKeyword.trim().toLowerCase();

    const matches = localKeywords
      .filter((kw) => kw.toLowerCase().includes(lowerInput))
      .slice(0, 7); // limit suggestions

    setSuggestions(matches);
  }, [searchKeyword, localKeywords]);

  const handleSearch = (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("user_id");
    const queryParams = new URLSearchParams();

    if (searchKeyword.trim()) {
      queryParams.set("q", searchKeyword.trim());
    }
    if (userId) {
      queryParams.set("userId", userId);
    }

    navigate(`/search?${queryParams.toString()}`);
  };

  const handleSellClick = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("user_id");
    if (!token || !userId) {
      toast.warn("You jave to log in as a user to sell any product");
      return;
    }
    //there is a field in the "User" table named isverified which is boolean
    // const isverified = localStorage.getItem("isverified");
    // !! have to add a get request to get the inverified

    try {
      // Step 3: Make a GET request to fetch the latest user data (especially isverified)
      const response = await fetch(
        `http://localhost:${PORT}/api/users/isVerified/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Step 4: Handle non-200 responses
      if (!response.ok) {
        throw new Error("Failed to verify user status.");
      }

      // Step 5: Extract `isverified` value from server response
      const userData = await response.json();
      const isVerified = userData.isverified; // assumes server sends { isverified: true/false }

      // Step 6: Block unverified users from selling
      if (!isVerified) {
        toast.warn(
          "Your account is not verified. Wait for the admin approval."
        );
        return;
      }

      // Step 7: Navigate to the Sell page if user is verified
      navigate("/sell");
    } catch (error) {
      // Step 8: Catch any network/server errors and show a toast
      console.error("Error fetching user data:", error);
      toast.error("Something went wrong while checking verification status.");
    }
  };

  // Determine the correct dashboard link based on login status
  const getDashboardLink = () => {
    if (isLoggedInAdmin) {
      return "/adminDashboard";
    } else if (isLoggedInDeliveryMan) {
      return "/deliverymanDashboard";
    } else if (isLoggedInDeliveryCompany) {
      return "/deliveryserviceDashboard";
    } else if (isLoggedIn) {
      return "/userDashboard";
    }
    return "/"; // Fallback if no specific role is logged in
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900 shadow-md py-2"
          : "bg-gradient-to-r from-slate-700 to-slate-900 py-4"
      } text-white`}
    >
      {/* Top Bar */}
      <div className="container mx-auto px-4 flex justify-between items-center transition-all duration-300">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 text-2xl font-bold cursor-pointer"
        >
          <ShoppingBag size={28} />
          <span className="tracking-wide">
            <span className="text-blue-300">After</span>
            <span className="text-green-300">Mart</span>
          </span>
        </a>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          {/* <button
            className="p-2 hover:bg-white/10 rounded-full transition"
            title="Toggle Dark Mode"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button> */}

          {!isLoggedIn &&
          !isLoggedInDeliveryCompany &&
          !isLoggedInAdmin &&
          !isLoggedInDeliveryMan ? (
            <>
              <a
                href="/registertype"
                className="flex items-center gap-1 text-blue-300 hover:text-blue-200 text-sm"
              >
                <UserPlus size={16} /> Register
              </a>

              <a
                href="/login"
                className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 text-sm"
              >
                <LogIn size={16} /> Login
              </a>
            </>
          ) : (
            <>
              <a
                href={getDashboardLink()}
                className="flex items-center gap-1 hover:text-blue-200 text-sm"
              >
                <User size={16} /> Dashboard
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-300 hover:text-red-200 text-sm cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}

          <button
            onClick={handleSellClick}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition"
          >
            <Upload size={16} />
            Sell
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-800 py-3 shadow-inner">
        <div className="container mx-auto px-4 relative">
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-3 max-w-2xl mx-auto bg-slate-700 rounded-full px-4 py-2 shadow-sm relative z-10"
          >
            <Search size={20} className="text-gray-300" />
            <input
              type="text"
              placeholder="Search products by name or category..."
              className="flex-grow bg-transparent focus:outline-none text-white placeholder-gray-400"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition"
            >
              Search
            </button>
          </form>

          {/* Suggestion Dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute left-1/2 transform -translate-x-1/2 mt-1 max-w-2xl w-full bg-slate-700 text-white rounded-lg shadow-lg overflow-hidden z-20 border border-slate-600">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="px-4 py-2 hover:bg-slate-600 cursor-pointer text-sm transition-colors"
                  onClick={() => {
                    setSuggestions([]);
                    navigate(
                      `/search?q=${encodeURIComponent(item)}&userId=${
                        localStorage.getItem("user_id") || ""
                      }`
                    );
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
