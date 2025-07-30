// src/components/ProductGrid.jsx
import React from 'react';
import ProductCard from './ProductCard';

/**
 * ProductGrid renders a responsive grid of ProductCards.
 * Includes optional heading and subtle fade-in animation.
 * Styled to match the dark elegant AfterMart theme.
 * Cards flow naturally from left to right, top to bottom.
 * 
 * @param {Array} products - Array of product objects to display.
 * @param {string} title - Optional section title (e.g., "Recent Ads").
 */
const ProductGrid = ({ products, title = "Recent" }) => {
    return (
        <section className="mt-12 px-4 py-8 bg-slate-800 rounded-xl">
            {/* Section Title - Centered */}
            <h2 className="text-3xl font-semibold text-white mb-6 text-center">
                {title}
            </h2>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 animate-fadeIn justify-items-start">
                {products.length === 0 ? (
                    <p className="text-center text-gray-400 col-span-full">
                        No products to display.
                    </p>
                ) : (
                    products.map(product => (
                        <div key={product.id} className="w-[280px]">
                            <ProductCard product={product} />
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default ProductGrid;