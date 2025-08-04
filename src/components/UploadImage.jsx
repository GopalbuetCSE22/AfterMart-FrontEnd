import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiUploadCloud, FiImage, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

function UploadImage({ onUploadSuccess }) {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setUrl("");
    setError(false);

    const userid = localStorage.getItem("user_id");
    console.log("User ID:", userid); // Keep this for debugging

    if (!userid) {
      setMessage("User not logged in. Please log in to upload.");
      setError(true);
      setLoading(false);
      return;
    }
    if (!image) {
      setMessage("Please select an image to upload.");
      setError(true);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/api/uploadImage/upload/${userid}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Image uploaded successfully!");
        setUrl(data.url);
        setError(false);
        setImage(null); // Clear the selected file input
        if (onUploadSuccess) {
          onUploadSuccess(); // Notify parent to reload the photo
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
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-blue-800/40 rounded-xl shadow-lg text-gray-100 font-sans"
    >
      <h2 className="text-3xl font-bold text-center text-blue-300 mb-6 flex items-center justify-center gap-3">
        <FiUploadCloud className="text-blue-400" /> Upload Profile Photo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="file-upload" className="block text-blue-200 text-lg font-medium mb-2 cursor-pointer">
            <div className="flex items-center gap-2">
              <FiImage className="text-blue-400" /> Choose Image
            </div>
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-600 file:text-white
                       hover:file:bg-blue-700 transition-colors
                       cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {image && (
            <p className="mt-2 text-sm text-gray-400">
              Selected file: <span className="font-semibold text-blue-300">{image.name}</span>
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2
            ${loading
              ? "bg-blue-500 cursor-not-allowed opacity-70"
              : "bg-blue-700 hover:bg-blue-800 text-white shadow-md hover:shadow-lg"
            }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </>
          ) : (
            <>
              <FiUploadCloud className="text-xl" /> Upload Image
            </>
          )}
        </motion.button>
      </form>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-3 rounded-md flex items-center gap-2 font-medium text-sm
            ${error ? "bg-red-900/40 text-red-300 border border-red-700" : "bg-green-900/40 text-green-300 border border-green-700"}`}
        >
          {error ? <FiAlertCircle className="text-lg" /> : <FiCheckCircle className="text-lg" />}
          {message}
        </motion.p>
      )}

      {url && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center"
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
          >
            <FiImage /> View Uploaded Image
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}

export default UploadImage;