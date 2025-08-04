import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryCard from './CategoryCard';
import {
    Monitor,
    Shirt,
    Sofa,
    Car,
    Book,
    Dumbbell,
    Baby,
    Gem,
    Wrench,
    Paintbrush,
    Package // defauly icon
} from 'lucide-react';

/**
 category-icon map
 */
const categoryIcons = {
    'Electronics': Monitor,
    'Fashion': Shirt,
    'Home Goods': Sofa,
    'Vehicles': Car,
    'Books': Book,
    'Sports & Outdoors': Dumbbell,
    'Kids & Baby': Baby,
    'Collectibles': Gem,
    'Tools & Garden': Wrench,
    'Art & Crafts': Paintbrush,
};

/**
 * Renders a responsive category grid with classy card design,
 * fetching categories dynamically from an API.
 */
const CategoryGrid = () => {
    const [categories, setCategories] = useState([]);
    // State for loading indicator
    const [loading, setLoading] = useState(true);
    // State for error handling
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories/`);
                const data = response.data;

                const categoriesWithIcons = data.map(cat => ({
                    id: cat.category_id,
                    label: cat.name,
                    description: cat.description,
                    icon: categoryIcons[cat.name] || Package
                }));
                setCategories(categoriesWithIcons);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                setError("Failed to load categories. Please try again later.");
                if (err.response) {
                    console.error("Axios error response data:", err.response.data);
                    console.error("Axios error response status:", err.response.status);
                    console.error("Axios error response headers:", err.response.headers);
                } else if (err.request) {
                    // The request was made but no response was received
                    console.error("Axios error request:", err.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Axios error message:", err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="py-12 bg-slate-800 text-white">
                <div className="container mx-auto px-4">
                    <p className="text-xl text-center">Loading categories...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-12 bg-slate-800 text-white">
                <div className="container mx-auto px-4">
                    <p className="text-xl text-center text-red-500">{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 bg-slate-800 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-10">Browse by Category</h2>

                {categories.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 justify-items-center">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                icon={category.icon}
                                label={category.label}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-xl text-center text-gray-400">No categories found.</p>
                )}
            </div>
        </section>
    );
};

export default CategoryGrid;
