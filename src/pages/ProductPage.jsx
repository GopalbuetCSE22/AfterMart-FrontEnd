import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ProductPage = () => {
    const { id } = useParams();
    
    // Sample product data, in a real application this would be fetched from an API
    const product = {
        id: id,
        title: 'Sample Product',
        description: 'This is a detailed description of the sample product.',
        price: 29.99,
        image: 'https://via.placeholder.com/300',
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto p-4">
                <div className="flex flex-col md:flex-row">
                    <img src={product.image} alt={product.title} className="w-full md:w-1/2 rounded-lg" />
                    <div className="md:ml-4">
                        <h1 className="text-2xl font-bold">{product.title}</h1>
                        <p className="text-lg text-gray-700 mt-2">${product.price.toFixed(2)}</p>
                        <p className="mt-4">{product.description}</p>
                        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                            Buy Now
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductPage;