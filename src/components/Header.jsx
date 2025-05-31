import React from 'react';

const Header = () => {
    return (
        <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-3xl font-extrabold tracking-wide">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-red-500">
                        AfterMart
                    </span>
                </h1>
                <nav>
                    <ul className="flex space-x-6">
                        <li>
                            <a href="/" className="hover:underline hover:text-yellow-300 transition duration-300">
                                Home
                            </a>
                        </li>
                        <li>
                            <a href="/products" className="hover:underline hover:text-yellow-300 transition duration-300">
                                Products
                            </a>
                        </li>
                        <li>
                            <a href="/about" className="hover:underline hover:text-yellow-300 transition duration-300">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/contact" className="hover:underline hover:text-yellow-300 transition duration-300">
                                Contact
                            </a>
                        </li>
                        <li>
                            <a href="/login" className="hover:underline hover:text-yellow-300 transition duration-300">
                                login
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;