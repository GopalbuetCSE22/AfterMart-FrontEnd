import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';
import {
    PackagePlus,
    Tag,
    Folders,
    DollarSign,
    Clock,
    Truck,
    FileText
} from 'lucide-react';

const PORT = 5000;

const ProductSellPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        usedFor: '', // Corresponds to `used_for` in backend (e.g., 'new', 'less_than_1_year')
        categoryId: '',
        deliveryMode: '' // Corresponds to `delivery_mode` in backend
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Options for "Used For" (from ProductDetail context, assuming these match backend expectations)
    const usedForOptions = [
        { label: 'Select Usage Duration', value: '' }, // Default placeholder
        { label: 'New', value: 'new' },
        { label: 'Used - Less than 1 year', value: 'less_than_1_year' },
        { label: 'Used - 1 to 3 years', value: '1_3_years' },
        { label: 'Used - 3 to 5 years', value: '3_5_years' },
        { label: 'Used - More than 5 years', value: 'more_than_5_years' },
    ];

    // Options for "Delivery Mode"
    const deliveryModeOptions = [
        { label: 'Select Delivery Mode', value: '' }, // Default placeholder
        { label: 'Delivery', value: 'delivery' },
        { label: 'Pickup', value: 'pickup' },
        { label: 'Both', value: 'both' },
    ];

    useEffect(() => {
        // Redirect if not logged in
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('user_id');
        if (!token || !userId) {
            toast.error("You need to be logged in to sell a product.");
            navigate('/userlogin');
        }

        // Fetch categories for the dropdown
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`http://localhost:${PORT}/api/categories`);
                if (res.data && Array.isArray(res.data)) {
                    setCategories(res.data);
                } else {
                    console.error("API /api/categories did not return an array:", res.data);
                    toast.error("Failed to load product categories.");
                }
            } catch (err) {
                console.error("Error fetching categories for sell page:", err);
                toast.error("Failed to load categories for the form.");
            }
        };

        fetchCategories();
    }, [navigate]); // navigate is a dependency of useEffect

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const sellerId = localStorage.getItem('user_id');

        if (!sellerId) {
            toast.error("Seller ID not found. Please log in again.");
            setLoading(false);
            navigate('/userlogin');
            return;
        }

        // Basic client-side validation
        const { title, description, price, usedFor, categoryId, deliveryMode } = formData;
        if (!title || !description || !price || !usedFor || !categoryId || !deliveryMode) {
            setError("All fields are required.");
            toast.error("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        if (isNaN(price) || parseFloat(price) <= 0) {
            setError("Price must be a positive number.");
            toast.error("Price must be a positive number.");
            setLoading(false);
            return;
        }

        try {
            const productData = {
                title,
                description,
                price: parseFloat(price), // Ensure price is a number
                usedFor,
                categoryId,
                sellerId,
                deliveryMode,
            };

            const res = await axios.post(`http://localhost:${PORT}/api/products`, productData);

            if (res.status === 201) {
                toast.success(res.data.message || "Product added successfully!");
                navigate(`/`); //back to home
            } else {
                setError(res.data.error || "Failed to add product.");
                toast.error(res.data.error || "Failed to add product.");
            }
        } catch (err) {
            console.error("Error submitting product:", err);
            if (err.response) {
                setError(err.response.data.error || "Server error occurred.");
                toast.error(err.response.data.error || "Server error occurred.");
            } else if (err.request) {
                setError("Network error. Please check your internet connection.");
                toast.error("Network error. Please check your internet connection.");
            } else {
                setError("An unexpected error occurred.");
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
                    <h2 className="text-3xl font-bold text-blue-300 text-center mb-8 flex items-center justify-center gap-3">
                        <PackagePlus size={32} /> List Your Product (Image handling baki ache)
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-400 text-red-200 px-4 py-3 rounded-md mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="relative">
                            <label htmlFor="title" className="block text-gray-300 text-sm font-medium mb-2">Product Title</label>
                            <div className="flex items-center bg-slate-700 rounded-lg border border-slate-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors duration-200">
                                <Tag size={20} className="text-gray-400 ml-3 flex-shrink-0" />
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter product title (e.g., iPhone 13 Pro Max)"
                                    className="flex-grow bg-transparent p-3 rounded-lg focus:outline-none text-white placeholder-gray-400"
                                    required
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="relative">
                            <label htmlFor="description" className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                            <div className="flex items-start bg-slate-700 rounded-lg border border-slate-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors duration-200">
                                <FileText size={20} className="text-gray-400 ml-3 mt-3 flex-shrink-0" />
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Provide a detailed description of your product, its features, condition, etc."
                                    rows="5"
                                    className="flex-grow bg-transparent p-3 rounded-lg focus:outline-none text-white placeholder-gray-400 resize-y"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="relative">
                            <label htmlFor="price" className="block text-gray-300 text-sm font-medium mb-2">Price (৳)</label>
                            <div className="flex items-center bg-slate-700 rounded-lg border border-slate-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors duration-200">
                                <DollarSign size={20} className="text-gray-400 ml-3 flex-shrink-0" />
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g., 50000"
                                    className="flex-grow bg-transparent p-3 rounded-lg focus:outline-none text-white placeholder-gray-400"
                                    min="0"
                                    step="any"
                                    required
                                />
                            </div>
                        </div>

                        {/* Used For */}
                        <div className="relative">
                            <label htmlFor="usedFor" className="block text-gray-300 text-sm font-medium mb-2">Usage Duration</label>
                            <div className="flex items-center bg-slate-700 rounded-lg border border-slate-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors duration-200">
                                <Clock size={20} className="text-gray-400 ml-3 flex-shrink-0" />
                                <select
                                    id="usedFor"
                                    name="usedFor"
                                    value={formData.usedFor}
                                    onChange={handleChange}
                                    className="flex-grow bg-transparent p-3 rounded-lg focus:outline-none text-white appearance-none pr-8" // appearance-none to allow custom arrow
                                    required
                                >
                                    {usedForOptions.map(option => (
                                        <option key={option.value} value={option.value} className="bg-slate-700 text-white">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>


                        {/* Category */}
                        <div className="relative">
                            <label htmlFor="categoryId" className="block text-gray-300 text-sm font-medium mb-2">Category</label>
                            <div className="flex items-center bg-slate-700 rounded-lg border border-slate-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors duration-200">
                                <Folders size={20} className="text-gray-400 ml-3 flex-shrink-0" /> {/* Changed from Category to Folders */}
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    className="flex-grow bg-transparent p-3 rounded-lg focus:outline-none text-white appearance-none pr-8"
                                    required
                                >
                                    <option value="" className="bg-slate-700 text-white">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.category_id} value={cat.category_id} className="bg-slate-700 text-white">
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        {/* Delivery Mode */}
                        <div className="relative">
                            <label htmlFor="deliveryMode" className="block text-gray-300 text-sm font-medium mb-2">Delivery Mode</label>
                            <div className="flex items-center bg-slate-700 rounded-lg border border-slate-600 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-colors duration-200">
                                <Truck size={20} className="text-gray-400 ml-3 flex-shrink-0" />
                                <select
                                    id="deliveryMode"
                                    name="deliveryMode"
                                    value={formData.deliveryMode}
                                    onChange={handleChange}
                                    className="flex-grow bg-transparent p-3 rounded-lg focus:outline-none text-white appearance-none pr-8"
                                    required
                                >
                                    {deliveryModeOptions.map(option => (
                                        <option key={option.value} value={option.value} className="bg-slate-700 text-white">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition-colors duration-300 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Adding Product...
                                </span>
                            ) : (
                                <>
                                    <PackagePlus size={20} /> Add Product
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductSellPage;
