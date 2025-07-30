// src/components/ProductCard.jsx
import React from 'react';
import { Calendar, User, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    // Get the current user's ID from localStorage
    const currentUserId = localStorage.getItem('user_id');

    // Determine the redirection path based on whether the current user is the seller
    const redirectTo =
        currentUserId && String(product.seller_id) === String(currentUserId)
            ? `/dashboard/product/${product.product_id}` // Redirect to edit page for seller
            : `/product/${product.product_id}`; // Redirect to public view for others

    return (
        <Link
            to={redirectTo}
            className="relative group max-w-xs h-96 rounded-2xl shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
        >
            {/* Multi-layered neon glow effect (z-0) */}
            {/* This div creates a wide, blurry glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 opacity-0 group-hover:opacity-70 blur-xl transition-all duration-700 z-0 group-hover:animate-pulse" />
            {/* This div creates a tighter, brighter glow */}
            <div className="absolute -inset-0.5 rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-80 blur-lg transition-all duration-500 z-0" />

            {/* Rotating border animation (z-5) */}
            {/* This div creates the actual spinning border effect. The inner div (bg-gray-900)
                acts as the card's background, allowing the spinning gradient to appear as a border. */}
            <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-5">
                {/* The spinning gradient layer */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 animate-spin"></div>
                {/* The inner background of the card, slightly smaller to reveal the spinning border */}
                <div className="absolute inset-[2px] rounded-2xl bg-gray-900"></div>
            </div>

            {/* Product Image Container - fills the entire card (z-10) */}
            {/* This container holds the image and its overlays, sitting on top of the spinning border. */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden z-10">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" // Subtle zoom on hover
                />
                {/* Enhanced gradient overlay with shimmer effect (z-10, same as image to blend) */}
                {/* This gradient ensures text readability over the image */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/90 to-transparent opacity-90 group-hover:opacity-100 transition-all duration-500 z-10" />

                {/* Shimmer effect overlay - light ray going through the card (z-20) */}
                {/* Made less strong and adjusted starting/ending position for a more subtle sweep */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-1/2 group-hover:translate-x-full transition-transform duration-1000 ease-in-out z-20" />
            </div>

            {/* Floating particles effect (z-20) */}
            {/* Note: `animation-delay-` classes are not standard Tailwind and would require custom CSS in tailwind.config.js */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none">
                <div className="absolute top-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '200ms' }}></div>
                <div className="absolute top-12 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '400ms' }}></div>
                <div className="absolute top-6 right-12 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '600ms' }}></div>
            </div>

            {/* Info Section - positioned absolutely at the bottom, above the gradient (z-30) */}
            {/* This section contains all the product details */}
            <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col gap-2 text-white z-30 transform group-hover:translate-y-0 transition-transform duration-500">
                {/* Title with glow effect on hover */}
                <h3 className="text-lg font-semibold truncate text-blue-200 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all duration-300">
                    {product.title}
                </h3>

                {/* Location with enhanced hover effects (animation kept) */}
                <div className="flex items-center text-sm text-gray-300 group-hover:text-blue-200 transition-colors duration-300">
                    <MapPin size={16} className="mr-1 text-blue-300 group-hover:animate-bounce" />
                    {product.seller_area}
                </div>

                {/* Date (animation removed) */}
                <div className="flex items-center text-xs text-gray-400 group-hover:text-gray-200 transition-colors duration-300">
                    <Calendar size={14} className="mr-1 text-gray-400 group-hover:text-blue-300 transition-colors duration-300" />
                    Posted on {new Date(product.posted_at).toLocaleDateString()}
                </div>

                {/* Seller (animation removed) */}
                <div className="flex items-center text-sm group-hover:text-blue-200 transition-colors duration-300">
                    <User size={16} className="mr-1 text-blue-300" /> {/* Removed group-hover:animate-pulse */}
                    <span className="font-medium text-blue-300 group-hover:text-white transition-colors duration-300">
                        {product.seller_name}
                    </span>
                </div>

                {/* Price with enhanced glow (animation removed) */}
                <div className="flex items-center text-base font-bold text-green-400 group-hover:text-green-300 group-hover:drop-shadow-[0_0_6px_rgba(34,197,94,0.8)] transition-all duration-300">
                    <Tag size={18} className="mr-1 text-green-400" /> {/* Removed group-hover:animate-spin */}
                    ৳ {product.price.toLocaleString()}
                </div>

                {/* Enhanced button with gradient and glow */}
                <div className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-2 rounded-xl shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 mt-2">
                    {currentUserId && String(product.seller_id) === String(currentUserId) ? "Edit Product" : "View Details"}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
