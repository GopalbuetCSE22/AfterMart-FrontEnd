import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatBox from '../components/ChatBox';
import {
    Heart, MessageSquare, ShoppingCart, Calendar,
    User, MapPin, Tag, Clock, Banknote, Mail, Phone
} from 'lucide-react';
import { toast } from 'react-toastify';

const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]); // Array of {media_id, image} objects
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Helper to get auth info from localStorage
    const getAuthInfo = useCallback(() => {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('user_id');
        return { token, userId };
    }, []);

    // Fetch product details and images on component mount or ID change
    useEffect(() => {
        async function fetchProductDetails() {
            try {
                setLoading(true);
                setError(null);

                const productRes = await axios.get(`${BASE_URL}/products/${id}`);
                setProduct(productRes.data);

                const imagesRes = await axios.get(`${BASE_URL}/products/${id}/images`);
                setImages(imagesRes.data || []); // Ensure it's an array even if API returns null/undefined
                setMainImageIndex(0); // Reset main image index when images are fetched
            } catch (err) {
                console.error("Error fetching product details:", err);
                // More specific error message for different HTTP statuses
                if (err.response && err.response.status === 404) {
                    setError('Product not found.');
                } else {
                    setError('Failed to load product details. Please try again later.');
                }
            } finally {
                setLoading(false);
            }
        }

        fetchProductDetails();
    }, [id]);

    // Handles adding a product to the user's wishlist
    const handleAddToWishlist = async () => {
        const { token, userId } = getAuthInfo();
        if (!token || !userId) {
            toast.info("Please log in to add items to your wishlist.");
            navigate('/userlogin');
            return;
        }

        try {
            const res = await axios.post(
                `${BASE_URL}/products/${id}/wishlist`,
                { userId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(res.data.message || 'Product added to your wishlist successfully!');
        } catch (err) {
            console.error("Error adding to wishlist:", err);
            if (err.response) {
                if (err.response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user_id');
                    navigate('/userlogin');
                } else if (err.response.status === 409) {
                    toast.error(err.response.data.error || 'Product is already in your wishlist!');
                } else {
                    toast.error(err.response.data?.error || 'Server error occurred.');
                }
            } else {
                toast.error('Network error. Please try again later.');
            }
        }
    };

    // Handles initiating a product purchase
    const handlePurchase = async () => {
        const { token, userId } = getAuthInfo();
        if (!token || !userId) {
            toast.info("Please log in to purchase this product.");
            navigate("/userlogin");
            return;
        }
        if (product && parseInt(userId) === product.seller_id) {
            toast.warn("You cannot purchase your own product.");
            return;
        }

        try {
            const res = await axios.patch(
                `${BASE_URL}/products/buyProduct/${userId}/${id}`
            );
            toast.success(res.data.message || "Purchase successful!");
            // You might want to refresh product data or redirect after purchase if status changes
        } catch (err) {
            console.error("Error purchasing product:", err);
            if (err.response) {
                if (err.response.status === 401) {
                    toast.error("Session expired. Please log in again.");
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("user_id");
                    navigate("/userlogin");
                } else {
                    toast.error(err.response.data?.error || "Server error occurred during purchase.");
                }
            } else {
                toast.error("Network error. Please try again later.");
            }
        }
    };

    // Toggles the chatbox visibility
    const handleChatClick = () => {
        const { token, userId } = getAuthInfo();
        if (!token || !userId) {
            toast.info("Please log in to chat.");
            navigate('/userlogin');
            return;
        }
        // Prevent seller from chatting with themselves about their product via this button
        if (product && parseInt(userId) === product.seller_id) {
            toast.warn("You are the seller of this product.");
            // Optionally, navigate to dashboard or a different chat view
            return;
        }
        setIsChatOpen(true);
    };

    // Helper function to format the 'used_for' enum values into readable strings
    const formatUsedFor = (usedForValue) => {
        switch (usedForValue) {
            case 'new': return 'New';
            case 'less_than_1_year': return 'Less than 1 year';
            case '1_3_years': return '1 to 3 years';
            case '3_5_years': return '3 to 5 years';
            case 'more_than_5_years': return 'More than 5 years';
            default: return 'N/A'; // Fallback for undefined/null or unexpected values
        }
    };

    // --- Conditional Rendering for Loading, Error, and Not Found States ---
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-3xl text-red-500 font-bold mb-4">Error!</h2>
                <p className="text-xl text-gray-300 mb-6">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
                >
                    Go to Homepage
                </button>
            </div>
        );
    }

    // This case should ideally be caught by `error` state if 404 is returned,
    // but as a fallback, explicitly handle if product is null after loading.
    if (!product) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
                <h2 className="text-3xl text-yellow-500 font-bold mb-4">Product Not Found</h2>
                <p className="text-xl text-gray-300 mb-6">The product you are looking for does not exist or has been removed.</p>
                <button
                    onClick={() => navigate('/products')} // Or home, depending on your app flow
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
                >
                    Browse Other Products
                </button>
            </div>
        );
    }

    // Only proceed to render the main content if 'product' is loaded
    const currentUserId = localStorage.getItem('user_id');
    // Ensure both are numbers for safe comparison
    const isSeller = product.seller_id && currentUserId ? parseInt(currentUserId) === product.seller_id : false;

    return (
        <div className="min-h-screen bg-slate-900 text-white relative">
            <Header />
            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Image Section */}
                    <div className="md:w-1/2">
                        <div className="rounded-2xl overflow-hidden shadow-lg mb-4 bg-slate-800">
                            <img
                                // Use optional chaining for images array and its elements
                                src={images[mainImageIndex]?.image || 'https://placehold.co/600x400/334155/E2E8F0?text=No+Image'}
                                alt={`Main Product: ${product.title || 'Product'}`}
                                className="w-full h-80 object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/600x400/334155/E2E8F0?text=No+Image';
                                }}
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {images.length > 0 ? ( // Only map if images exist
                                images.map((imgObj, idx) => (
                                    <img
                                        key={imgObj.media_id || idx} // Use media_id if available for better keys
                                        src={imgObj.image || 'https://placehold.co/80x80/334155/E2E8F0?text=N/A'}
                                        alt={`Thumbnail ${idx + 1}`}
                                        className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 ${idx === mainImageIndex ? 'border-blue-400 shadow-md' : 'border-transparent'}`}
                                        onClick={() => setMainImageIndex(idx)}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://placehold.co/80x80/334155/E2E8F0?text=N/A';
                                        }}
                                    />
                                ))
                            ) : ( // Show a placeholder thumbnail if no images
                                <img
                                    src="https://placehold.co/80x80/334155/E2E8F0?text=No+Images"
                                    alt="No images available"
                                    className="w-20 h-20 object-cover rounded-xl border-2 border-slate-700"
                                />
                            )}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="md:w-1/2 space-y-6">
                        <h1 className="text-4xl font-bold text-blue-300 mb-4">{product.title || 'Product Title N/A'}</h1>
                        <p className="text-gray-300 text-lg leading-relaxed">{product.description || 'No description provided for this product.'}</p>

                        <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow-inner">
                            <div className="flex items-center gap-3">
                                <Banknote size={24} className="text-green-400" />
                                <span className="text-xl font-bold text-green-400">Price:</span>
                            </div>
                            <span className="text-4xl font-extrabold text-green-300">৳ {(product.price ?? 0).toLocaleString()}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800 p-4 rounded-xl shadow-inner">
                            <DetailItem
                                icon={Calendar}
                                label="Posted On"
                                value={product.posted_at ? new Date(product.posted_at).toLocaleDateString() : 'N/A'}
                            />
                            <DetailItem
                                icon={Clock}
                                label="Used For"
                                value={formatUsedFor(product.used_for)}
                            />
                            <DetailItem
                                icon={MapPin}
                                label="Location"
                                value={`${product.seller_area || 'N/A'}, ${product.seller_district || 'N/A'}`}
                            />
                            <DetailItem
                                icon={Tag}
                                label="Category"
                                value={product.name || 'N/A'}
                            />
                        </div>

                        <div className="bg-slate-800 p-4 rounded-xl shadow-inner space-y-3">
                            <h3 className="text-xl font-semibold text-blue-300 flex items-center gap-2 mb-3">
                                <User size={20} /> Seller Information
                            </h3>
                            <DetailItem icon={User} label="Name" value={product.seller_name || 'N/A'} />
                            {product.seller_email && (
                                <DetailItem icon={Mail} label="Email" value={product.seller_email} isLink={true} linkPrefix="mailto:" />
                            )}
                            {product.seller_phone && (
                                <DetailItem icon={Phone} label="Phone" value={product.seller_phone} isLink={true} linkPrefix="tel:" />
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4 pt-6">
                            <button
                                onClick={handleAddToWishlist}
                                className="bg-pink-500/20 hover:bg-pink-600/30 text-pink-300 px-5 py-2 rounded-full backdrop-blur-md border border-pink-300 transition flex items-center gap-2"
                            >
                                <Heart size={18} /> Add to Wishlist
                            </button>

                            <button
                                onClick={handleChatClick}
                                className="bg-blue-500/20 hover:bg-blue-600/30 text-blue-300 px-5 py-2 rounded-full backdrop-blur-md border border-blue-300 transition flex items-center gap-2"
                                // Disable chat button if current user is the seller
                                disabled={isSeller}
                            >
                                <MessageSquare size={18} /> {isSeller ? "You are the Seller" : "Chat with Seller"}
                            </button>

                            <button
                                onClick={handlePurchase}
                                className="bg-green-500/20 hover:bg-green-600/30 text-green-300 px-5 py-2 rounded-full backdrop-blur-md border border-green-300 transition flex items-center gap-2"
                                // Disable purchase button if current user is the seller
                                disabled={isSeller}
                            >
                                <ShoppingCart size={18} /> {isSeller ? "Your Product" : "Purchase"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Box */}
            {isChatOpen && product && (
                <div className="fixed bottom-5 right-5 z-50 w-[350px] md:w-[400px]">
                    <ChatBox
                        productId={product.product_id}
                        sellerId={product.seller_id}
                        buyerId={isSeller ? null : parseInt(currentUserId)} // Ensure buyerId is a number or null
                        currentUserId={currentUserId}
                        onClose={() => setIsChatOpen(false)}
                    />
                </div>
            )}
            <Footer />
        </div>
    );
};

export default ProductDetail;

// Reusable component for displaying product details
const DetailItem = ({ icon: Icon, label, value, isLink = false, linkPrefix = '' }) => (
    <div className="flex items-center gap-3 py-1">
        <Icon size={20} className="text-blue-400 flex-shrink-0" />
        <div className="flex flex-col">
            <p className="text-sm text-gray-400">{label}</p>
            {isLink ? (
                <a href={`${linkPrefix}${value}`} className="text-white font-medium hover:text-blue-300 transition-colors duration-200">
                    {value || 'N/A'}
                </a>
            ) : (
                <p className="text-white font-medium">{value || 'N/A'}</p>
            )}
        </div>
    </div>
);