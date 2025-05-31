import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <img className="w-full" src={product.image} alt={product.title} />
            <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">{product.title}</div>
                <p className="text-gray-700 text-base">
                    Price: ${product.price}
                </p>
            </div>
            <div className="px-6 pt-4 pb-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ProductCard;