import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CategoryGrid from '../components/CategoryGrid';
import ProductGrid from '../components/ProductGrid';
import IntroBanner from '../components/IntroBanner';
import axios from 'axios';

const PORT = 5000;
const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/recent/all`);
                setProducts(res.data);
                setError(res.data.length === 0); // if array is empty
            } catch (err) {
                console.error("Error fetching products:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-900 text-white">
            <Header />
            <main className="flex-grow px-4 py-8">
                {/* Intro Banner Section */}
                <IntroBanner />
                <CategoryGrid />

                {/* Recent Ads Section */}
                {/* <h2 className="text-2xl font-semibold mb-6 text-center mt-10">Recent Ads</h2> */}

                {loading ? (
                    //show a loading spinner or skeleton
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                    </div>
                ) : error ? (
                    <div className="max-w-2xl mx-auto text-center px-4 py-4 bg-red-500/10 border border-red-400 text-red-200 backdrop-blur-md rounded-xl shadow-md">
                        <p className="text-base font-medium">
                            There is no recent product or an error occurred while fetching data.
                        </p>
                    </div>
                ) : (
                    <ProductGrid products={products} title="Recent Ads" />
                )}
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
