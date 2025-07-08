import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
    Heart,
    MessageSquare,
    ShoppingCart,
    Calendar,
    User,
    MapPin,
    Tag,
    Clock,
    Banknote,
    Mail,
    Phone,
    Folders
} from 'lucide-react';
import { toast } from 'react-toastify';

const PORT = 5000;

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [images, setImages] = useState([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthInfo = useCallback(() => {
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('user_id');
        return { token, userId };
    }, []);

    useEffect(() => {
        async function fetchProductDetails() {
            try {
                setLoading(true);
                setError(null);

                const productRes = await axios.get(`http://localhost:${PORT}/api/products/${id}`);
                setProduct(productRes.data);

                const imagesRes = await axios.get(`http://localhost:${PORT}/api/products/${id}/images`);
                setImages(imagesRes.data);
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError('Failed to load product details. Please try again later.');
            } finally {
                setLoading(false);
            }
        }

        fetchProductDetails();
    }, [id]);

    const handleAddToWishlist = async () => {
        const { token, userId } = getAuthInfo();

        if (!token || !userId) {
            toast.info("Please log in to add items to your wishlist.");
            navigate('/userlogin');
            return;
        }

        try {
            const res = await axios.post(
                `http://localhost:5000/api/products/${id}/wishlist`,
                { userId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(res.data.message || 'Product added to your wishlist successfully!');
        } catch (err) {
            console.error("Error adding to wishlist:", err);
            if (err.response) {
                if (err.response.status === 401) {
                    toast.error("Your session has expired or you are not authorized. Please log in again.");
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user_id');
                    navigate('/userlogin');
                } else if (err.response.status === 409) {
                    toast.error(err.response.data.error || 'This product is already in your wishlist!');
                } else if (err.response.data && err.response.data.error) {
                    toast.error(err.response.data.error);
                } else {
                    toast.error('Failed to add to wishlist due to server error.');
                }
            } else if (err.request) {
                toast.error('Network error. Please check your internet connection.');
            } else {
                toast.error('An unexpected error occurred.');
            }
        }
    };

    if (loading) {
        //show some nice animation for loading
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }
    if (error) {
        return <p className="text-center text-red-500 mt-10">{error}</p>;
    }
    if (!product) {
        return <p className="text-center mt-10">Product not found.</p>;
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <Header />

            <div className="container mx-auto p-6 max-w-6xl">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Image Section */}
                    <div className="md:w-1/2">
                        <div className="rounded-2xl overflow-hidden shadow-lg mb-4 bg-slate-800">
                            <img
                                src={images[mainImageIndex] || 'https://placehold.co/600x400/334155/E2E8F0?text=No+Image'}
                                alt={`Product Image ${mainImageIndex + 1}`}
                                className="w-full h-80 object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/334155/E2E8F0?text=No+Image'; }} //
                            />
                        </div>
                        <div className="flex gap-3 overflow-x-auto pb-2">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Thumbnail ${idx + 1}`}
                                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 ${idx === mainImageIndex ? 'border-blue-400 shadow-md' : 'border-transparent'}`}
                                    onClick={() => setMainImageIndex(idx)}
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/334155/E2E8F0?text=N/A'; }} // Thumbnail fallback
                                />
                            ))}
                        </div>
                    </div>

                    {/* Info Section - Reorganized and Professionalized */}
                    <div className="md:w-1/2 space-y-6">
                        <h1 className="text-4xl font-bold text-blue-300 mb-4">{product.title}</h1>
                        <p className="text-gray-300 text-lg leading-relaxed">{product.description}</p>

                        {/* Price Section */}
                        <div className="bg-slate-800 p-4 rounded-xl shadow-inner flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Banknote size={24} className="text-green-400" />
                                <span className="text-xl font-bold text-green-400">Price:</span>
                            </div>
                            <span className="text-4xl font-extrabold text-green-300">
                                ৳ {product.price.toLocaleString()}
                            </span>
                        </div>

                        {/* Product Details Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800 p-4 rounded-xl shadow-inner">
                            <DetailItem icon={Calendar} label="Posted On" value={new Date(product.posted_at).toLocaleDateString()} />
                            <DetailItem icon={Clock} label="Used For" value={`${product.used_for}`} />
                            <DetailItem icon={MapPin} label="Location" value={`${product.seller_area}, ${product.seller_district}`} />
                            <DetailItem icon={Tag} label="Category" value={product.name} />
                        </div>

                        {/* Seller Info Section */}
                        <div className="bg-slate-800 p-4 rounded-xl shadow-inner space-y-3">
                            <h3 className="text-xl font-semibold text-blue-300 flex items-center gap-2 mb-3">
                                <User size={20} /> Seller Information
                            </h3>
                            <DetailItem icon={User} label="Name" value={product.seller_name} />
                            {product.seller_email && <DetailItem icon={Mail} label="Email" value={product.seller_email} isLink={true} linkPrefix="mailto:" />}
                            {product.seller_phone && <DetailItem icon={Phone} label="Phone" value={product.seller_phone} isLink={true} linkPrefix="tel:" />}
                        </div>

                        {/* Action Buttons - UNCHANGED */}
                        <div className="flex flex-wrap gap-4 pt-6">
                            <button
                                onClick={handleAddToWishlist}
                                className="bg-pink-500/20 hover:bg-pink-600/30 text-pink-300 px-5 py-2 rounded-full backdrop-blur-md border border-pink-300 transition flex items-center gap-2"
                            >
                                <Heart size={18} /> Add to Wishlist
                            </button>
                            <button
                                className="bg-blue-500/20 hover:bg-blue-600/30 text-blue-300 px-5 py-2 rounded-full backdrop-blur-md border border-blue-300 transition flex items-center gap-2"
                            >
                                <MessageSquare size={18} /> Chat with Seller
                            </button>
                            <button
                                className="bg-green-500/20 hover:bg-green-600/30 text-green-300 px-5 py-2 rounded-full backdrop-blur-md border border-green-300 transition flex items-center gap-2"
                            >
                                <ShoppingCart size={18} /> Purchase
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductDetail;


// Helper component for consistent detail item styling
const DetailItem = ({ icon: Icon, label, value, isLink = false, linkPrefix = '' }) => (
    <div className="flex items-center gap-3 py-1">
        <Icon size={20} className="text-blue-400 flex-shrink-0" />
        <div className="flex flex-col">
            <p className="text-sm text-gray-400">{label}</p>
            {isLink ? (
                <a href={`${linkPrefix}${value}`} className="text-white font-medium hover:text-blue-300 transition-colors duration-200">
                    {value}
                </a>
            ) : (
                <p className="text-white font-medium">{value}</p>
            )}
        </div>
    </div>
);
