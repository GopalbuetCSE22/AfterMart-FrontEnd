import React, { useState, useEffect } from 'react';

const IntroBanner = () => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayText, setDisplayText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const animatedTexts = [
        "Your Gateway to Great Deals",
        "Buy & Sell with Confidence",
        "Discover Hidden Treasures",
        "Sustainable Shopping Made Easy"
    ];

    useEffect(() => {
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const currentFullText = animatedTexts[currentTextIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing
                if (displayText.length < currentFullText.length) {
                    setDisplayText(currentFullText.slice(0, displayText.length + 1));
                } else {
                    // Pause before deleting
                    setTimeout(() => setIsDeleting(true), 2000);
                }
            } else {
                // Deleting
                if (displayText.length > 0) {
                    setDisplayText(displayText.slice(0, -1));
                } else {
                    setIsDeleting(false);
                    setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
                }
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [displayText, isDeleting, currentTextIndex]);

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl mb-12 shadow-2xl">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Subtle floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"></div>
                <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-float opacity-40" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-pink-400 rounded-full animate-float opacity-50" style={{ animationDelay: '3s' }}></div>
                <div className="absolute bottom-1/3 right-1/5 w-2 h-2 bg-yellow-400 rounded-full animate-float opacity-60" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative z-10 px-8 py-16 md:px-16 md:py-24">
                <div className="max-w-6xl mx-auto text-center">
                    {/* Main Brand */}
                    <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                            AfterMart
                        </h1>
                    </div>

                    {/* Typewriter Effect Tagline */}
                    <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="h-16 md:h-20 flex items-center justify-center mb-8">
                            <h2 className="text-2xl md:text-4xl font-semibold text-gray-200 min-h-[1.2em] flex items-center">
                                {displayText}
                                <span className="ml-1 animate-pulse text-blue-400">|</span>
                            </h2>
                        </div>
                    </div>

                    {/* Description */}
                    <div className={`transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Transform your pre-loved items into cash and discover amazing deals on quality second-hand products.
                            Join thousands of smart shoppers who choose sustainable, affordable shopping.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>
    );
};

export default IntroBanner;