import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
    return (
        <div className="flex justify-center mb-4">
            <input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-1/2"
            />
            <button className="ml-2 bg-blue-500 text-white rounded-lg p-2">
                Search
            </button>
        </div>
    );
};

export default SearchBar;