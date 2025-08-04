// src/components/ProfileImageUploader.jsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi"; // FiUploadCloud removed

const BASE_URL = `${import.meta.env.VITE_API_URL}/uploadImage`; // Use environment variable for base URL
const DEFAULT_USER_IMAGE = "https://digitalhealthskills.com/no-user-image-icon-27/";

/**
 * ProfileImageUploader component allows users to upload/update their profile picture
 * directly from the profile image display area.
 * It provides a sleek, modern UI with hover effects and upload feedback.
 *
 * @param {string} currentImageUrl - The URL of the user's current profile picture.
 * @param {function} onUploadSuccess - Callback function to be called after a successful upload.
 */
function ProfileImageUploader({ currentImageUrl, onUploadSuccess }) {
    const [imageFile, setImageFile] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setMessage(""); // Clear previous messages
            setError(false);
            // Automatically trigger upload after file selection
            handleSubmit(file);
        }
    };

    const handleSubmit = async (fileToUpload) => {
        setLoading(true);
        setMessage("");
        setError(false);

        const userid = localStorage.getItem("user_id");

        if (!userid) {
            setMessage("User not logged in. Please log in to upload.");
            setError(true);
            setLoading(false);
            return;
        }
        if (!fileToUpload) {
            setMessage("No image selected for upload.");
            setError(true);
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("image", fileToUpload);

        try {
            const res = await fetch(
                `${BASE_URL}/uploadImage/upload/${userid}`,
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "Profile picture updated successfully!");
                setError(false);
                setImageFile(null); // Clear the selected file
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Clear the file input element
                }
                if (onUploadSuccess) {
                    onUploadSuccess(); // Notify parent (UserDashboard) to reload the photo
                }
            } else {
                setMessage(data.error || "Upload failed. Please try again.");
                setError(true);
            }
        } catch (err) {
            setMessage("Network error. Could not connect to the server.");
            setError(true);
            console.error("Upload error:", err);
        } finally {
            setLoading(false);
            // Clear message after a few seconds
            setTimeout(() => setMessage(""), 5000);
        }
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Programmatically click the hidden file input
        }
    };

    return (
        <div className="relative group w-32 h-32 rounded-full flex items-center justify-center mb-3 shadow-xl overflow-hidden cursor-pointer">
            {/* Hidden file input */}
            <input
                id="profile-image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />

            {/* Profile Image Display */}
            <img
                src={currentImageUrl || DEFAULT_USER_IMAGE}
                alt="User Profile"
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-50"
                onClick={handleImageClick}
                onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = DEFAULT_USER_IMAGE; // Fallback to default on error
                }}
            />

            {/* Overlay for hover effect and upload text */}
            <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full transition-opacity duration-300"
                onClick={handleImageClick}
            >
                <span className="text-white text-sm font-semibold text-center">
                    {loading ? "Uploading..." : "Upload Photo"}
                </span>
            </motion.div>

            {/* Dashed border on hover */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-transparent group-hover:border-blue-400 transition-all duration-300 pointer-events-none" />

            {/* Message feedback (success/error) */}
            {message && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute -bottom-10 left-1/2 -translate-x-1/2 p-2 rounded-md flex items-center gap-1 font-medium text-xs whitespace-nowrap
            ${error ? "bg-red-900/70 text-red-300 border border-red-700" : "bg-green-900/70 text-green-300 border border-green-700"}`}
                    style={{ zIndex: 30 }} // Ensure message is on top
                >
                    {error ? <FiAlertCircle className="text-sm" /> : <FiCheckCircle className="text-sm" />}
                    {message}
                </motion.p>
            )}
        </div>
    );
}

export default ProfileImageUploader;