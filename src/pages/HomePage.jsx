import React from 'react';
import Header from '../components/Header';
import ProductList from '../components/ProductList';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow p-4">
                <h1 className="text-2xl font-bold mb-4">Welcome to AfterMart</h1>
                <SearchBar />
                <ProductList />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;