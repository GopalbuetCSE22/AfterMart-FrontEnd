import React from 'react';
import { Calendar, User, MapPin, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <Link
            to={`/product/${product.product_id}`}
            className="relative group max-w-xs bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
        >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse pointer-events-none z-10" />

            {/* Product Image */}
            <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-2xl z-20"
            />

            {/* Info Section */}
            <div className="p-4 flex flex-col gap-2 text-white z-20">
                {/* Title */}
                <h3 className="text-lg font-semibold truncate">{product.title}</h3>

                {/* Location */}
                <div className="flex items-center text-sm text-gray-300">
                    <MapPin size={16} className="mr-1 text-blue-300" />
                    {product.seller_area}
                </div>

                {/* Date */}
                <div className="flex items-center text-xs text-gray-400">
                    <Calendar size={14} className="mr-1 text-gray-400" />
                    Posted on {new Date(product.posted_at).toLocaleDateString()}
                </div>

                {/* Seller */}
                <div className="flex items-center text-sm">
                    <User size={16} className="mr-1 text-blue-300" />
                    <span className="font-medium text-blue-300">{product.seller_name}</span>
                </div>

                {/* Price */}
                <div className="flex items-center text-base font-bold text-green-400">
                    <Tag size={18} className="mr-1 text-green-400" />
                    ৳ {product.price.toLocaleString()}
                </div>
            </div>

            {}
            <div className="px-4 pb-4 z-20">
                <div
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-2xl shadow-md transition-colors duration-300"
                >
                    View Details
                </div>
            </div>

            {/* Subtle glowing ring on hover */}
            <div className="absolute -inset-0.5 rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-10 blur-md transition duration-500" />
        </Link>
    );
};

export default ProductCard;
