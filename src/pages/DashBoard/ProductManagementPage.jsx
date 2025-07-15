// src/pages/DashBoard/ProductManagementPage.jsx

import React, { useEffect, useState, useRef, useCallback } from "react"; // Added useCallback
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiArrowLeft,
  FiSave,
  FiTrash2,
  FiPlus,
  FiMessageSquare,
  FiEdit,
} from "react-icons/fi";
import ChatBox from "../../components/ChatBox"; // adjust if needed
import UploadImage from "../../components/UploadImage"; // Import your UploadImage component
import UploadImage_Product from "../../components/UploadImage_Product"; // Import your UploadImage_Product component
const BASE_URL = "http://localhost:5000/api";
function ProductManagementPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("edit");
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    used_for: "",
    sellerId: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null); // { buyerId }
  // NEW STATE: Trigger for conversations refresh
  const [refreshConversationsTrigger, setRefreshConversationsTrigger] =
    useState(0);

  const productID = localStorage.getItem("product_id"); // Assuming you store product ID in localStorage

  // console.log(productID);
  
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`${BASE_URL}/products/${id}`);
        setProduct(res.data);
        setFormData({
          title: res.data.title,
          description: res.data.description,
          price: res.data.price,
          used_for: res.data.used_for || "",
          sellerId: res.data.seller_id,
        });
        setImages(res.data.images || []);
        setLoading(false);
        localStorage.setItem("product_id", res.data.product_id); // Store product ID in localStorage
        console.log(productID);
        
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product.");
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // Define fetchConversations as a useCallback to prevent unnecessary re-creations
  const fetchConversations = useCallback(async () => {
    if (!formData.sellerId || !id) return; // Ensure all necessary IDs are available
    try {
      // Updated endpoint to match your router.get('/conversations', ...)
      // It expects query parameters, not path parameters like /${id}/${sellerId}
      const res = await axios.get(`${BASE_URL}/messages/conversations`, {
        params: {
          productId: id,
          sellerId: formData.sellerId,
        },
      });
      setConversations(res.data);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      // Consider a toast.error here as well if fetching fails consistently
    }
  }, [id, formData.sellerId]); // Dependencies for useCallback

  useEffect(() => {
    if (activeTab === "chat") {
      fetchConversations();
      // Set up a polling interval for conversations as well
      const intervalId = setInterval(fetchConversations, 10000); // Poll every 10 seconds
      return () => clearInterval(intervalId); // Cleanup interval on unmount or dependency change
    }
  }, [activeTab, fetchConversations, refreshConversationsTrigger]); // Added refreshConversationsTrigger

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProduct = async () => {
    try {
      const dataToUpdate = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        used_for: formData.used_for,
        sellerId: formData.sellerId,
      };

      await axios.patch(`${BASE_URL}/products/${id}`, dataToUpdate);
      toast.success("Product updated successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Update failed.";
      toast.error(errorMessage);
    }
  };

  const handleDeleteImage = async (mediaId) => {
    toast.info(`Delete image ${mediaId} (not yet implemented)`);
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    toast.info(
      `${files.length} image(s) selected (upload not yet implemented)`
    );
  };

  const handleBackClick = () => {
    navigate("/userDashboard");
  };

  // Function to call when ChatBox closes or a new conversation is started externally
  const handleChatBoxClose = () => {
    setActiveChat(null);
    // Trigger a refresh of the conversation list when returning from chat view
    setRefreshConversationsTrigger((prev) => prev + 1);
  };

  if (loading)
    return <div className="p-6 text-center text-gray-400">Loading...</div>;
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
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                activeTab === "edit"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-800 text-blue-300 hover:bg-gray-700"
              }`}
            >
              <FiEdit /> Edit Product
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                activeTab === "chat"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-800 text-blue-300 hover:bg-gray-700"
              }`}
            >
              <FiMessageSquare /> Chat
            </button>
          </div>
        </div>

        {/* EDIT TAB */}
        {activeTab === "edit" && (
          <div className="space-y-6">
            <div>
              <label className="block mb-1 text-sm text-blue-300">Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-blue-300">
                Description
              </label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-blue-300">
                Price (৳)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-blue-300">
                Used For
              </label>
              <input
                name="used_for"
                value={formData.used_for}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-blue-700"
              />
            </div>

            <UploadImage_Product />
            <button
              onClick={handleUpdateProduct}
              className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-md shadow-md transition"
            >
              <FiSave /> Save Changes
            </button>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === "chat" && (
          <div className="mt-4">
            {!activeChat ? (
              <div>
                <h2 className="text-xl font-semibold text-blue-300 mb-4">
                  Buyers Who Messaged
                </h2>
                <ul className="space-y-3">
                  {conversations.length === 0 && (
                    <p className="text-gray-400">No conversations yet.</p>
                  )}
                  {conversations.map((conv) => (
                    <li
                      key={conv.conversation_id}
                      className="bg-gray-800 p-4 rounded-md hover:bg-gray-700 transition cursor-pointer"
                      onClick={() =>
                        setActiveChat({
                          buyerId: conv.buyer_id,
                          conversationId: conv.conversation_id,
                        })
                      } // Pass conversationId
                    >
                      Buyer: {conv.buyer_name} ({conv.buyer_email})
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <ChatBox
                productId={id}
                sellerId={formData.sellerId}
                buyerId={activeChat.buyerId}
                conversationId={activeChat.conversationId} // Pass existing conversationId
                currentUserId={formData.sellerId}
                onClose={handleChatBoxClose} // Use the new handler
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductManagementPage;
