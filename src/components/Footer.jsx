import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-6">
            <div className="container mx-auto text-center">
                <p className="text-lg font-semibold">&copy; {new Date().getFullYear()} Aftermart. All rights reserved.</p>
                <div className="mt-4 flex justify-center space-x-4">
                    <a href="/about" className="text-white hover:underline transition duration-300">About Us</a>
                    <a href="/contact" className="text-white hover:underline transition duration-300">Contact</a>
                    <a href="/terms" className="text-white hover:underline transition duration-300">Terms of Service</a>
                </div>
                <div className="mt-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white hover:text-gray-200 transition duration-300">
                        <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white hover:text-gray-200 transition duration-300">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="mx-2 text-white hover:text-gray-200 transition duration-300">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;