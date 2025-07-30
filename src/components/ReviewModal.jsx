import React, { useState } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

const ReviewModal = ({
    type,
    onClose,
    product_id,
    seller_id,
    shipment_id,
    deliveryman_id,
}) => {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        try {
            if (type === "seller") {
                await axios.post(`${BASE_URL}/reviews/seller`, {
                    reviewer_id: localStorage.getItem("user_id"),
                    reviewee_id: seller_id,
                    product_id,
                    rating,
                    content,
                });

                setMessage("Seller review submitted!");
            } else if (type === "delivery") {
                await axios.post(`${BASE_URL}/reviews/shipment`, {
                    shipment_id,
                    rating,
                    review: content,
                });
                setMessage("Delivery review submitted!");
            }

            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            console.log('Details for product:', product_id, seller_id, shipment_id);

            console.error(err);

            setMessage("Failed to submit review.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
            onClick={onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg p-8 w-full max-w-md shadow-2xl border border-blue-800"
            >
                <h2 className="text-2xl font-bold text-blue-300 mb-4 text-center">
                    {type === "seller" ? "Rate Seller" : "Rate Delivery"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-blue-200 mb-1">Rating</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            required
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-blue-200 mb-1">
                            {type === "seller" ? "Review Message" : "Delivery Feedback"}
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                            rows={3}
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white resize-none"
                            placeholder={
                                type === "seller"
                                    ? "How was the seller?"
                                    : "How was the delivery experience?"
                            }
                        />
                    </div>

                    {message && <p className="text-sm text-center text-green-400">{message}</p>}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded text-white"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;
