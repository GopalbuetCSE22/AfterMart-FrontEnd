import React, { useState } from "react";
import axios from "axios";

// Base URL for API calls. In a real application, this would typically come from environment variables.
const BASE_URL = `${process.env.REACT_APP_API_URL}/api/reviews`;

const ReviewModal = ({
    type, // Type of review: 'seller' or 'delivery'
    onClose, // Function to call when the modal needs to be closed
    product_id, // ID of the product being reviewed (relevant for seller reviews)
    seller_id, // ID of the seller being reviewed (relevant for seller reviews)
    shipment_id, // ID of the shipment being reviewed (relevant for delivery reviews)
    // deliveryman_id is not used in the provided logic, so it's commented out.
    // deliveryman_id,
}) => {
    // State for the current rating selected by the user, initialized to 5
    const [rating, setRating] = useState(5);
    // State for the content/message of the review
    const [content, setContent] = useState("");
    // State to manage loading status during API calls
    const [loading, setLoading] = useState(false);
    // State to display messages to the user (success/error)
    const [message, setMessage] = useState("");
    // State to manage the rating displayed on hover for star animation
    const [hoverRating, setHoverRating] = useState(0);

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setMessage(""); // Clear any previous messages
        setLoading(true); // Set loading to true

        try {
            // Determine the API endpoint and payload based on the review type
            if (type === "seller") {
                await axios.post(`${BASE_URL}/reviews/seller`, {
                    reviewer_id: localStorage.getItem("user_id"), // Get reviewer ID from local storage
                    reviewee_id: seller_id,
                    product_id,
                    rating,
                    content,
                });
                setMessage("Seller review submitted!"); // Success message for seller review
            } else if (type === "delivery") {
                await axios.post(`${BASE_URL}/reviews/shipment`, {
                    shipment_id,
                    rating,
                    review: content, // 'review' is the key expected by the backend for shipment reviews
                });
                setMessage("Delivery review submitted!"); // Success message for delivery review
            }

            // Close the modal after a short delay to allow the message to be seen
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            // Log detailed error information for debugging
            console.log('Details for product:', product_id, seller_id, shipment_id);
            console.error("Error submitting review:", err);
            setMessage("Failed to submit review. Please try again."); // Error message
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        // Overlay for the modal, covers the entire screen
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
            onClick={onClose} // Close modal when clicking outside
        >
            {/* Modal content container */}
            <div
                onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-8 w-full max-w-lg shadow-2xl border border-blue-700 transform transition-all duration-300 scale-100 opacity-100 animate-fade-in"
            >
                {/* Modal title */}
                <h2 className="text-3xl font-extrabold text-blue-400 mb-6 text-center tracking-wide">
                    {type === "seller" ? "Rate Seller" : "Rate Delivery"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Rating section */}
                    <div>
                        <label className="block text-lg font-medium text-blue-200 mb-2">Rating</label>
                        <div className="flex justify-center space-x-1">
                            {[...Array(5)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <svg
                                        key={index}
                                        className={`w-10 h-10 cursor-pointer transition-transform duration-200 ease-in-out
                                            ${starValue <= (hoverRating || rating) ? "text-yellow-400 transform scale-110" : "text-gray-500"}
                                            hover:text-yellow-300 hover:scale-125`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        onMouseEnter={() => setHoverRating(starValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(starValue)}
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                                    </svg>
                                );
                            })}
                        </div>
                    </div>

                    {/* Review message section */}
                    <div>
                        <label className="block text-lg font-medium text-blue-200 mb-2">
                            {type === "seller" ? "Review Message" : "Delivery Feedback"}
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={4} // Increased rows for more input space
                            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                            placeholder={
                                type === "seller"
                                    ? "Share your experience with the seller..."
                                    : "How was the delivery experience? Any feedback for the delivery person?"
                            }
                        />
                    </div>

                    {/* Message display (success/error) */}
                    {message && (
                        <p className={`text-center text-md font-semibold ${message.includes("Failed") ? "text-red-400" : "text-green-400"} transition-opacity duration-300 animate-fade-in`}>
                            {message}
                        </p>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-end gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-700 hover:bg-blue-600 rounded-lg text-white font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;

