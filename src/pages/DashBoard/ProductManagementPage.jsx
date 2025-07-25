// src/pages/DashBoard/ProductManagementPage.jsx

import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { PlusCircle, X } from 'lucide-react';

const BASE_URL = "http://localhost:5000/api";

function ProductManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    used_for: "",
    sellerId: "", // CHANGE 1: Changed from seller_id to sellerId to match backend
    category_id: "",
    delivery_mode: "",
  });
  const [existingImages, setExistingImages] = useState([]);
  const [selectedNewFiles, setSelectedNewFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingNewImages, setIsUploadingNewImages] = useState(false);

  // Options for dropdowns
  const usedForOptions = [
    { label: 'New', value: 'new' },
    { label: 'Used - Less than 1 year', value: 'less_than_1_year' },
    { label: 'Used - 1 to 3 years', value: '1_3_years' },
    { label: 'Used - 3 to 5 years', value: '3_5_years' },
    { label: 'Used - More than 5 years', value: 'more_than_5_years' },
  ];

  const deliveryModeOptions = [
    { label: 'Delivery', value: 'delivery' },
    { label: 'Pickup', value: 'pickup' },
  ];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchProductAndImages() {
      try {
        const productRes = await axios.get(`${BASE_URL}/products/${id}`);
        const productData = productRes.data;
        setProduct(productData);
        setFormData({
          title: productData.title,
          description: productData.description,
          price: productData.price,
          used_for: productData.used_for || "",
          sellerId: productData.seller_id, // CHANGE 2: Assign productData.seller_id to sellerId
          category_id: productData.category_id,
          delivery_mode: productData.delivery_mode,
        });

        const imagesRes = await axios.get(`${BASE_URL}/products/${id}/images`);
        setExistingImages(imagesRes.data || []);

        const categoriesRes = await axios.get(`${BASE_URL}/categories`);
        if (categoriesRes.data && Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        } else {
          console.error("API /api/categories did not return an array:", categoriesRes.data);
          toast.error("Failed to load product categories.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching product or images:", err);
        setError("Failed to load product details or images.");
        setLoading(false);
        toast.error("Failed to load product details.");
      }
    }

    fetchProductAndImages();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewImageSelection = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedNewFiles(prevFiles => [...prevFiles, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setNewImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setSelectedNewFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setNewImagePreviews(prevPreviews => {
      const newPreviews = prevPreviews.filter((_, index) => index !== indexToRemove);
      URL.revokeObjectURL(prevPreviews[indexToRemove]);
      return newPreviews;
    });
  };

  const handleDeleteExistingImage = async (imageUrl, mediaId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }
    try {
      await axios.delete(`${BASE_URL}/products/${id}/images/${mediaId}`);
      toast.success("Image deleted successfully!");
      setExistingImages(prevImages => prevImages.filter(img => img.media_id !== mediaId));
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to delete image.";
      console.error("Error deleting image:", err);
      toast.error(errorMessage);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setError("");

    // CHANGE 3: Destructure sellerId (camelCase) from formData
    const { title, description, price, used_for, category_id, delivery_mode, sellerId } = formData;

    // Validation
    // CHANGE 4: Validate sellerId
    if (!title || !description || !price || !used_for || !category_id || !delivery_mode || !sellerId) {
      setError("All product fields (including seller ID) are required.");
      toast.error("Please fill in all required product fields.");
      setIsUpdating(false);
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      setError("Price must be a positive number.");
      toast.error("Price must be a positive number.");
      setIsUpdating(false);
      return;
    }

    try {
      // Step 1: Update product details
      const dataToUpdate = {
        title,
        description,
        price: parseFloat(price),
        usedFor: used_for, // CHANGE 5: Match backend's usedFor
        categoryId: parseInt(category_id), // CHANGE 6: Match backend's categoryId
        deliveryMode: delivery_mode, // CHANGE 7: Match backend's deliveryMode
        sellerId: parseInt(sellerId), // CHANGE 8: Ensure sellerId is an integer and sent as sellerId
      };

      await axios.patch(`${BASE_URL}/products/${id}`, dataToUpdate);
      toast.success("Product details updated successfully!");

      // Step 2: Upload new images if any
      if (selectedNewFiles.length > 0) {
        setIsUploadingNewImages(true);
        const imageUrlsToLink = [];

        for (const file of selectedNewFiles) {
          const imageFormData = new FormData();
          imageFormData.append('image', file);

          try {
            const uploadRes = await axios.post(`${BASE_URL}/uploadImage/uploadProduct/${id}`, imageFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            if (uploadRes.data.url && uploadRes.data.media_id) {
              imageUrlsToLink.push({ image: uploadRes.data.url, media_id: uploadRes.data.media_id });
            } else {
              //toast.warn(`Could not get URL or media ID for ${file.name}.`);
            }
          } catch (uploadErr) {
            console.error(`Error uploading ${file.name}:`, uploadErr);
            toast.error(`Failed to upload ${file.name}.`);
          }
        }

        if (imageUrlsToLink.length > 0) {
          // Send the array of { image: "url", media_id: "id" } if your backend expects it.
          // Your current backend `uploadProductImages` only expects an array of URLs.
          // If your backend `uploadProductImages` needs `media_id` as well for linking,
          // you'll need to modify that backend function.
          // For now, based on your `uploadProductImages` backend code:
          const urlsOnly = imageUrlsToLink.map(img => img.image);
          const linkRes = await axios.post(`${BASE_URL}/products/${id}/images`, { images: urlsOnly });
          toast.success(`${linkRes.data.message || 'New images added successfully!'}`); // Adjust message as per backend response
          // After successful linking, re-fetch images to update existingImages with media_ids
          // Or if linkRes.data.newImages returns the new images with media_ids:
          // setExistingImages(prev => [...prev, ...linkRes.data.newImages]);
          // A safer approach might be to re-fetch all images:
          const updatedImagesRes = await axios.get(`${BASE_URL}/products/${id}/images`);
          setExistingImages(updatedImagesRes.data || []);

          setSelectedNewFiles([]);
          setNewImagePreviews([]);
        } else if (selectedNewFiles.length > 0) {
          //toast.warn("No new images were successfully uploaded or linked.");
        }
        setIsUploadingNewImages(false);
      }
      navigate("/userDashboard");

    } catch (err) {
      const errorMessage = err.response?.data?.error || "An error occurred during product update or image upload.";
      console.error("Full error:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
      setIsUploadingNewImages(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleBackClick = () => {
    navigate("/userDashboard");
  };

  if (loading)
    return <div className="p-6 text-center text-gray-400">Loading product details...</div>;
  if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-950 to-gray-900 text-white p-6">
      <div className="max-w-5xl mx-auto bg-gray-900 p-6 rounded-xl shadow-lg border border-blue-800/30">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center text-blue-400 hover:text-blue-200 transition"
          >
            <FiArrowLeft className="mr-2" /> Back to Dashboard
          </button>
          <h2 className="text-2xl font-semibold text-blue-300">Manage Product: {product?.title}</h2>
        </div>

        <form onSubmit={handleUpdateProduct} className="space-y-6">
          {/* Product Details Fields */}
          <div>
            <label htmlFor="title" className="block mb-1 text-sm text-blue-300">Title</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 text-sm text-blue-300">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block mb-1 text-sm text-blue-300">Price (৳)</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700 focus:ring focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="any"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="used_for" className="block mb-1 text-sm text-blue-300">Usage Duration</label>
            <select
              id="used_for"
              name="used_for"
              value={formData.used_for}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700 focus:ring focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
              required
            >
              <option value="" disabled>Select Usage Duration</option>
              {usedForOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-7">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <div className="relative">
            <label htmlFor="category_id" className="block mb-1 text-sm text-blue-300">Category</label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700 focus:ring focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
              required
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-7">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          <div className="relative">
            <label htmlFor="delivery_mode" className="block mb-1 text-sm text-blue-300">Delivery Mode</label>
            <select
              id="delivery_mode"
              name="delivery_mode"
              value={formData.delivery_mode}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700 focus:ring focus:ring-blue-500 focus:border-blue-500 appearance-none pr-8"
              required
            >
              <option value="" disabled>Select Delivery Mode</option>
              {deliveryModeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none mt-7">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
          {/* Hidden Seller ID field - formData.sellerId is now populated correctly */}
          <input type="hidden" name="sellerId" value={formData.sellerId} />


          {/* Image Management Section */}
          <div className="relative pt-4">
            <h3 className="text-xl font-semibold text-blue-300 mb-4">Product Images</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
              {/* Existing Image Previews */}
              {existingImages.map((img, index) => (
                <div key={`existing-${img.media_id || index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-slate-600 shadow-md group">
                  <img src={img.image} alt={`Existing product thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleDeleteExistingImage(img.image, img.media_id)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {/* New Image Previews */}
              {newImagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-green-500 shadow-md group">
                  <img src={preview} alt={`New product thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Remove new image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}

              {/* Add New Image Button */}
              <div
                onClick={triggerFileInput}
                className="w-24 h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-500 text-blue-400 cursor-pointer hover:border-blue-400 hover:text-blue-300 transition-colors duration-200 bg-gray-700/50"
              >
                <PlusCircle size={32} />
                <span className="text-xs mt-1">Add Image</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleNewImageSelection}
                  ref={fileInputRef}
                  className="hidden"
                />
              </div>
            </div>
            {isUploadingNewImages && <p className="text-blue-400 text-sm mt-4 text-center">Uploading new images...</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md shadow-md transition"
              disabled={isUpdating || isUploadingNewImages}
            >
              {(isUpdating || isUploadingNewImages) ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isUpdating ? "Saving Product..." : "Adding New Images..."}
                </span>
              ) : (
                <>
                  <FiSave /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductManagementPage;