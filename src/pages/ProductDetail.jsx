import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox";
import {
  Heart,
  MessageSquare,
  ShoppingCart,
  Calendar,
  User,
  MapPin,
  Tag,
  Clock,
  Banknote,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "react-toastify";

import { Star } from "lucide-react";
const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]); // Array of {media_id, image} objects
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Helper to get auth info from localStorage
  const getAuthInfo = useCallback(() => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("user_id");
    return { token, userId };
  }, []);

  // Fetch product details and images on component mount or ID change
  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        setError(null);

        const productRes = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(productRes.data);

        const imagesRes = await axios.get(`${BASE_URL}/products/${id}/images`);
        setImages(imagesRes.data || []); // Ensure it's an array even if API returns null/undefined
        setMainImageIndex(0); // Reset main image index when images are fetched
      } catch (err) {
        console.error("Error fetching product details:", err);
        if (err.response && err.response.status === 404) {
          setError("Product not found.");
        } else {
          setError("Failed to load product details. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [id]);

  // Handles adding a product to the user's wishlist
  const handleAddToWishlist = async () => {
    const { token, userId } = getAuthInfo();
    if (!token || !userId) {
      toast.info("Please log in to add items to your wishlist.");
      navigate("/userlogin");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/products/${id}/wishlist`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(
        res.data.message || "Product added to your wishlist successfully!"
      );
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user_id");
          navigate("/userlogin");
        } else if (err.response.status === 409) {
          toast.error(
            err.response.data.error || "Product is already in your wishlist!"
          );
        } else {
          toast.error(err.response.data?.error || "Server error occurred.");
        }
      } else {
        toast.error("Network error. Please try again later.");
      }
    }
  };

  // Handles initiating a product purchase
  const handlePurchase = async () => {
    const { token, userId } = getAuthInfo();
    if (!token || !userId) {
      toast.info("Please log in to purchase this product.");
      navigate("/userlogin");
      return;
    }

    if (product && parseInt(userId) === product.seller_id) {
      toast.warn("You cannot purchase your own product.");
      return;
    }

    try {
      // Step 1: Fetch user verification status
      const response = await fetch(`${BASE_URL}/users/isVerified/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to verify user status.");
      }

      const userData = await response.json();
      const isVerified = userData.isverified;

      // Step 2: If not verified, block the purchase
      if (!isVerified) {
        toast.warn(
          "Your account is not verified. Please wait for admin approval before purchasing."
        );
        return;
      }

      // Step 3: Proceed with purchase if verified
      const res = await axios.patch(
        `${BASE_URL}/products/buyProduct/${userId}/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || "Purchase successful!");
      // Optional: Refresh or redirect here
    } catch (err) {
      console.error("Error during purchase:", err);
      if (err.response) {
        if (err.response.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user_id");
          navigate("/userlogin");
        } else {
          toast.error(
            err.response.data?.error || "Server error occurred during purchase."
          );
        }
      } else {
        toast.error("Network error. Please try again later.");
      }
    }
  };

  // Toggles the chatbox visibility
  const handleChatClick = () => {
    const { token, userId } = getAuthInfo();
    if (!token || !userId) {
      toast.info("Please log in to chat.");
      navigate("/userlogin");
      return;
    }
    // Prevent seller from chatting with themselves about their product via this button
    if (product && parseInt(userId) === product.seller_id) {
      toast.warn("You are the seller of this product.");
      return;
    }
    setIsChatOpen(true);
  };

  // Helper function to format the 'used_for' enum values into readable strings
  const formatUsedFor = (usedForValue) => {
    switch (usedForValue) {
      case "new":
        return "New";
      case "less_than_1_year":
        return "Less than 1 year";
      case "1_3_years":
        return "1 to 3 years";
      case "3_5_years":
        return "3 to 5 years";
      case "more_than_5_years":
        return "More than 5 years";
      default:
        return "N/A";
    }
  };

  // --- Conditional Rendering for Loading, Error, and Not Found States ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl text-red-500 font-bold mb-4">Error!</h2>
        <p className="text-xl text-gray-300 mb-6">{error}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          Go to Homepage
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl text-yellow-500 font-bold mb-4">
          Product Not Found
        </h2>
        <p className="text-xl text-gray-300 mb-6">
          The product you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/products")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          Browse Other Products
        </button>
      </div>
    );
  }

  const currentUserId = localStorage.getItem("user_id");
  const isSeller =
    product.seller_id && currentUserId
      ? parseInt(currentUserId) === product.seller_id
      : false;

  //****************************** */
  const SellerReviews = ({ sellerId }) => {
    const [averageRating, setAverageRating] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
      if (!sellerId) return;

      const fetchReviews = async () => {
        try {
          const res = await axios.get(
            `${BASE_URL}/reviews/fromSellerInfo/${sellerId}`
          );
        //   console.log(res.data.reviews);

          setAverageRating(res.data.averageRating);
          setReviews(res.data.reviews);
        } catch (error) {
          console.error("Error fetching reviews:", error);
        }
      };

      fetchReviews();
    }, [sellerId]);

    // return (
    //   <div className="bg-slate-700 p-3 rounded-lg space-y-2">
    //     <h4 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
    //       <Star size={18} /> Average Rating:{" "}
    //       {averageRating !== null ? averageRating : "N/A"}
    //     </h4>

    //     {reviews.length > 0 ? (
    //       <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
    //         {reviews.map((r) => (
    //           <div key={r.id} className="bg-slate-800 p-2 rounded-md">
    //             <div className="text-sm text-white font-medium">
    //               {r.reviewer_name}
    //             </div>
    //             <div className="text-yellow-300 text-sm flex items-center gap-1">
    //               {"★".repeat(r.rating)}{" "}
    //               <span className="text-gray-400">({r.rating})</span>
    //             </div>
    //             <p className="text-gray-300 text-sm">{r.comment}</p>
    //             <p className="text-gray-300 text-sm">{r.product_name}</p>
    //           </div>
    //         ))}
    //       </div>
    //     ) : (
    //       <p className="text-gray-400 text-sm">No reviews available.</p>
    //     )}
    //   </div>
    // );

    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-lg border border-slate-700">
        {/* Average Rating Section */}
        <div className="mb-6 pb-4 border-b border-slate-700 flex items-center justify-between">
          <h4 className="text-2xl font-bold text-yellow-400 flex items-center gap-3">
            <Star size={24} className="text-yellow-400" />
            Average Rating:{" "}
            <span className="text-white">
              {averageRating !== null ? averageRating    : "N/A"}
            </span>
          </h4>
          {averageRating !== null && (
            <div className="flex items-center text-yellow-300 text-lg">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
          )}
        </div>

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-3 custom-scrollbar">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-slate-700 p-4 rounded-lg border border-slate-600 shadow-md"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-md text-white font-semibold">
                    {r.reviewer_name}
                  </div>
                  <div className="text-yellow-300 text-md flex items-center gap-1">
                    {"★".repeat(r.rating)}{" "}
                    <span className="text-gray-400 ml-1">({r.rating}/5)</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-2 leading-relaxed">
                  {r.content}
                </p>
                <p className="text-blue-300 text-xs font-medium mt-2">
                  Product: {r.product_name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8 text-lg">
            No reviews available yet. Be the first to review!
          </p>
        )}
      </div>
    );
    
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      <Header />
      <div className="container mx-auto p-6 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Section */}
          <div className="md:w-1/2">
            <div className="rounded-2xl overflow-hidden shadow-lg mb-4 bg-slate-800 flex items-center justify-center h-96">
              {" "}
              {/* Increased height and added flex for centering */}
              <img
                src={
                  images[mainImageIndex]?.image ||
                  "https://placehold.co/600x400/334155/E2E8F0?text=No+Image"
                }
                alt={`Main Product: ${product.title || "Product"}`}
                className="max-h-full max-w-full object-contain" // Changed to object-contain and max-h/max-w
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/600x400/334155/E2E8F0?text=No+Image";
                }}
              />
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.length > 0 ? (
                images.map((imgObj, idx) => (
                  <img
                    key={imgObj.media_id || idx}
                    src={
                      imgObj.image ||
                      "https://placehold.co/80x80/334155/E2E8F0?text=N/A"
                    }
                    alt={`Thumbnail ${idx + 1}`}
                    className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition-all duration-300 ${
                      idx === mainImageIndex
                        ? "border-blue-400 shadow-md"
                        : "border-transparent"
                    }`}
                    onClick={() => setMainImageIndex(idx)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/80x80/334155/E2E8F0?text=N/A";
                    }}
                  />
                ))
              ) : (
                <img
                  src="https://placehold.co/80x80/334155/E2E8F0?text=No+Images"
                  alt="No images available"
                  className="w-20 h-20 object-cover rounded-xl border-2 border-slate-700"
                />
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="md:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold text-blue-300 mb-4">
              {product.title || "Product Title N/A"}
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              {product.description ||
                "No description provided for this product."}
            </p>

            <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center shadow-inner">
              <div className="flex items-center gap-3">
                <Banknote size={24} className="text-green-400" />
                <span className="text-xl font-bold text-green-400">Price:</span>
              </div>
              <span className="text-4xl font-extrabold text-green-300">
                ৳ {(product.price ?? 0).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800 p-4 rounded-xl shadow-inner">
              <DetailItem
                icon={Calendar}
                label="Posted On"
                value={
                  product.posted_at
                    ? new Date(product.posted_at).toLocaleDateString()
                    : "N/A"
                }
              />
              <DetailItem
                icon={Clock}
                label="Used For"
                value={formatUsedFor(product.used_for)}
              />
              <DetailItem
                icon={MapPin}
                label="Location"
                value={`${product.seller_area || "N/A"}, ${
                  product.seller_district || "N/A"
                }`}
              />
              <DetailItem
                icon={Tag}
                label="Category"
                value={product.name || "N/A"}
              />
            </div>

            <div className="bg-slate-800 p-4 rounded-xl shadow-inner space-y-3">
              <h3 className="text-xl font-semibold text-blue-300 flex items-center gap-2 mb-3">
                <User size={20} /> Seller Information
              </h3>
              <DetailItem
                icon={User}
                label="Name"
                value={product.seller_name || "N/A"}
              />

              {/* <DetailItem
                icon={User}
                label="ID"
                value={product.seller_id || "N/A"}
              /> */}

              {product.seller_email && (
                <DetailItem
                  icon={Mail}
                  label="Email"
                  value={product.seller_email}
                  isLink={true}
                  linkPrefix="mailto:"
                />
              )}
              {product.seller_phone && (
                <DetailItem
                  icon={Phone}
                  label="Phone"
                  value={product.seller_phone}
                  isLink={true}
                  linkPrefix="tel:"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
              <button
                onClick={handleAddToWishlist}
                className="bg-pink-500/20 hover:bg-pink-600/30 text-pink-300 px-5 py-2 rounded-full backdrop-blur-md border border-pink-300 transition flex items-center gap-2"
              >
                <Heart size={18} /> Add to Wishlist
              </button>

              <button
                onClick={handleChatClick}
                className="bg-blue-500/20 hover:bg-blue-600/30 text-blue-300 px-5 py-2 rounded-full backdrop-blur-md border border-blue-300 transition flex items-center gap-2"
                disabled={isSeller}
              >
                <MessageSquare size={18} />{" "}
                {isSeller ? "You are the Seller" : "Chat with Seller"}
              </button>

              <button
                onClick={handlePurchase}
                className="bg-green-500/20 hover:bg-green-600/30 text-green-300 px-5 py-2 rounded-full backdrop-blur-md border border-green-300 transition flex items-center gap-2"
                disabled={isSeller}
              >
                <ShoppingCart size={18} />{" "}
                {isSeller ? "Your Product" : "Purchase"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <SellerReviews sellerId={product.seller_id} />

      {/* Chat Box */}
      {isChatOpen && product && (
        <div className="fixed bottom-5 right-5 z-50 w-[350px] md:w-[400px]">
          <ChatBox
            productId={product.product_id}
            sellerId={product.seller_id}
            buyerId={isSeller ? null : parseInt(currentUserId)}
            currentUserId={currentUserId}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetail;

// Reusable component for displaying product details
const DetailItem = ({
  icon: Icon,
  label,
  value,
  isLink = false,
  linkPrefix = "",
}) => (
  <div className="flex items-center gap-3 py-1">
    <Icon size={20} className="text-blue-400 flex-shrink-0" />
    <div className="flex flex-col">
      <p className="text-sm text-gray-400">{label}</p>
      {isLink ? (
        <a
          href={`${linkPrefix}${value}`}
          className="text-white font-medium hover:text-blue-300 transition-colors duration-200"
        >
          {value || "N/A"}
        </a>
      ) : (
        <p className="text-white font-medium">{value || "N/A"}</p>
      )}
    </div>
  </div>
);
