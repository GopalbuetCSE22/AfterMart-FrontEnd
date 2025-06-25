import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ShoppingBag,
    Search,
    Moon,
    Sun,
    User,
    LogIn,
    UserPlus,
    LogOut,
    Upload
} from 'lucide-react';
import { toast } from 'react-toastify';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');

    const navigate = useNavigate();

    // Effect to check login status on component mount and when localStorage changes
    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem("authToken");
            setIsLoggedIn(!!token);
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);
        return () => window.removeEventListener('storage', checkLoginStatus);
    }, []);

    // Scroll listener to toggle header style
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user_id");
        setIsLoggedIn(false);
        navigate("/"); // Redirect to home page after logout
        toast.info("You have been logged out."); // Notify user
    };

    // Dark mode toggle function, will do later
    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
    };

    // Handle search submission from the header search bar
    const handleSearch = (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('user_id');
        const queryParams = new URLSearchParams();

        if (searchKeyword.trim()) {
            queryParams.set('q', searchKeyword.trim());
        }
        if (userId) {
            queryParams.set('userId', userId);
        }

        navigate(`/search?${queryParams.toString()}`);
    };

    const handleSellClick = (e) => {
        e.preventDefault(); // Prevent default link navigation

        const token = localStorage.getItem("authToken");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
            toast.warn("Please log in to sell a product."); // User notification
            navigate("/userlogin"); // Redirect to user login page
        } else {
            navigate("/sell"); // Navigate to the Product Sell page
        }
    };


    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-slate-900 shadow-md py-2'
                : 'bg-gradient-to-r from-slate-700 to-slate-900 py-4'
                } text-white`}
        >
            {/* Top Bar */}
            <div className="container mx-auto px-4 flex justify-between items-center transition-all duration-300">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 text-2xl font-bold cursor-pointer">
                    <ShoppingBag size={28} />
                    <span className="tracking-wide">
                        <span className="text-blue-300">After</span>
                        <span className="text-green-300">Mart</span>
                    </span>
                </a>

                {/* Buttons */}
                <div className="flex items-center space-x-4">
                    <button
                        className="p-2 hover:bg-white/10 rounded-full transition"
                        title="Toggle Dark Mode"
                        onClick={toggleDarkMode}
                    >
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {!isLoggedIn ? (
                        <>
                            <a href="/register" className="flex items-center gap-1 text-blue-300 hover:text-blue-200 text-sm">
                                <UserPlus size={16} /> Register
                            </a>
                            <a href="/login" className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 text-sm">
                                <LogIn size={16} /> Login
                            </a>
                        </>
                    ) : (
                        <>
                            <a href="/userDashboard" className="flex items-center gap-1 hover:text-blue-200 text-sm">
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
                <div className="container mx-auto px-4">
                    <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-2xl mx-auto bg-slate-700 rounded-full px-4 py-2 shadow-sm">
                        <Search size={20} className="text-gray-300" />
                        <input
                            type="text"
                            placeholder="Search products by name or category..."
                            className="flex-grow bg-transparent focus:outline-none text-white placeholder-gray-400"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-semibold transition"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
};

export default Header;
