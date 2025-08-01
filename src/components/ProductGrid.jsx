// src/components/ProductGrid.jsx

import React from 'react';
import ProductCard from './ProductCard';

/**
 * ProductGrid renders a responsive grid of ProductCards.
 * Includes optional heading and subtle fade-in animation.
 * Styled to match the dark elegant AfterMart theme.
 * Cards flow naturally in a responsive grid layout.
 *
 * @param {Array} products - Array of product objects to display.
 * @param {string} title - Optional section title (e.g., "Recent Ads").
 */
const ProductGrid = ({ products, title = "Recent" }) => {
    return (
        <section className="w-full mt-12 px-4 py-8 bg-slate-800 rounded-xl">
            {/* Section Title - Centered */}
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">
                {title}
            </h2>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
                {products.length === 0 ? (
                    <p className="text-center text-gray-400 col-span-full">
                        No products to display.
                    </p>
                ) : (
                    products.map(product => (
                        <ProductCard key={product.id || product.product_id} product={product} />
                    ))
                )}
            </div>
        </section>
    );
};

export default ProductGrid;