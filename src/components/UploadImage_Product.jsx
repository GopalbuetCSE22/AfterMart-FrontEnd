import React, { useState } from 'react';
import { motion } from 'framer-motion'; // For animations
import { FiUploadCloud, FiImage, FiAlertCircle, FiCheckCircle, FiPackage } from 'react-icons/fi'; // Icons

function UploadImage() {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false); // New loading state
  const [error, setError] = useState(false); // New error state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setMessage(''); // Clear previous messages
    setUrl(''); // Clear previous URL
    setError(false); // Clear previous error

    const productId = localStorage.getItem('product_id');
    console.log('Product ID:', productId);

    if (!productId) {
      setMessage('Product ID not found. Please select a product first.');
      setError(true);
      setLoading(false);
      return;
    }
    if (!image) {
      setMessage('Please select an image for your product.');
      setError(true);
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('image', image);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploadImage/uploadProduct/${productId}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Product image uploaded successfully!');
        setUrl(data.url);
        setError(false);
        setImage(null); // Clear the selected file input
      } else {
        setMessage(data.error || 'Product image upload failed. Please try again.');
        setError(true);
      }
    } catch (err) {
      setMessage('Network error. Could not connect to the server to upload image.');
      setError(true);
      console.error('Upload error:', err);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-800/40 rounded-xl shadow-lg text-gray-100 font-sans"
    >
      <h2 className="text-3xl font-bold text-center text-purple-300 mb-6 flex items-center justify-center gap-3">
        <FiPackage className="text-purple-400" /> Upload Product Image
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="product-image-upload" className="block text-purple-200 text-lg font-medium mb-2 cursor-pointer">
            <div className="flex items-center gap-2">
              <FiImage className="text-purple-400" /> Select Product Image
            </div>
          </label>
          <input
            id="product-image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="block w-full text-sm text-gray-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-purple-600 file:text-white
                       hover:file:bg-purple-700 transition-colors
                       cursor-pointer outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          {image && (
            <p className="mt-2 text-sm text-gray-400">
              Selected: <span className="font-semibold text-purple-300">{image.name}</span>
            </p>
          )}
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 ease-in-out flex items-center justify-center gap-2
            ${loading
              ? "bg-purple-500 cursor-not-allowed opacity-70"
              : "bg-purple-700 hover:bg-purple-800 text-white shadow-md hover:shadow-lg"
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
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 underline font-medium transition-colors"
          >
            <FiImage /> View Uploaded Image
          </a>
        </motion.div>
      )}
    </motion.div>
  );
}

export default UploadImage;