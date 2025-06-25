import React from 'react';
import { Link } from 'react-router-dom';


const CategoryCard = ({ icon: Icon, label }) => {
    // if logged in, userId will be in auth token which is stored in localStorage
    const userId = localStorage.getItem('user_id');
    //if a categry is clicked, we will initiate the search with category as filter
    const categorySearchPath = `/search?category=${encodeURIComponent(label)}${userId ? `&userId=${userId}` : ''}`;

    return (
        <Link
            to={categorySearchPath}
            className="relative group w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col items-center justify-center text-white" // Added flex classes for centering content
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse pointer-events-none z-10" />

            <Icon size={36} className="mb-2 text-blue-300 group-hover:scale-110 transition-transform duration-300 z-20" />

            <p className="text-sm font-medium text-center px-2 z-20">{label}</p> {/* Added text-center and horizontal padding */}

            <div className="absolute -inset-0.5 rounded-2xl bg-blue-400 opacity-0 group-hover:opacity-10 blur-md transition duration-500" />
        </Link>
    );
};

export default CategoryCard;
