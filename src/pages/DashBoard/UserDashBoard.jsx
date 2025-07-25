import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiHome,
  FiBox,
  FiShoppingBag,
  FiHeart,
  FiBell,
  FiUser,
  FiLogOut,
  FiMessageSquare,
  FiArrowLeft,
} from "react-icons/fi";
// Removed: import UploadImage from "../../components/UploadImage";
import ChatBox from "../../components/ChatBox";
import ProfileImageUploader from "../../components/ProfileImageUploader"; // NEW: Import the new component

const BASE_URL = "http://localhost:5000/api";

// Example logo SVG (replace with your own if needed)
const Logo = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#2563eb" />
    <path
      d="M24 12L34 36H14L24 12Z"
      fill="white"
      stroke="#1e40af"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

function UserDashBoard() {
  const [activeSection, setActiveSection] = useState("Info");
  const [userPhoto, setUserPhoto] = useState("");
  const [userPhotoRefreshKey, setUserPhotoRefreshKey] = useState(0);

  const [myProducts, setMyProducts] = useState([]);
  const [myProductsLoading, setMyProductsLoading] = useState(false);
  const [myProductsError, setMyProductsError] = useState(null);

  const [boughtProducts, setBoughtProducts] = useState([]);
  const [boughtProductsLoading, setBoughtProductsLoading] = useState(false);
  const [boughtProductsError, setBoughtProductsError] = useState(null);

  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [userInfoError, setUserInfoError] = useState(null);

  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState(null);

  const [selectedProductForChat, setSelectedProductForChat] = useState(null);
  const [productConversations, setProductConversations] = useState([]);
  const [productConversationsLoading, setProductConversationsLoading] = useState(false);
  const [productConversationsError, setProductConversationsError] = useState(null);
  const [activeChatDetails, setActiveChatDetails] = useState(null);
  const [refreshConversationsTrigger, setRefreshConversationsTrigger] = useState(0);

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!userId) {
      alert("You are not logged in. Please log in to access your dashboard.");
      navigate("/login");
    }
  }, [userId, navigate]);

  const fetchUserPhoto = () => {
    if (userId) {
      fetch(`${BASE_URL}/uploadImage/getProfilePic/${userId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.profile_picture) {
            setUserPhoto(data.profile_picture);
          } else {
            setUserPhoto(DEFAULT_USER_IMAGE); // Use default image if none found
          }
        })
        .catch((error) => {
          console.error("Failed to fetch user photo:", error);
          setUserPhoto(DEFAULT_USER_IMAGE); // Fallback to default on error
        });
    }
  };

  useEffect(() => {
    fetchUserPhoto();
  }, [userId, userPhotoRefreshKey]);

  useEffect(() => {
    if ((activeSection === "myProducts" || activeSection === "chat") && userId) {
      setMyProductsLoading(true);
      setMyProductsError(null);
      fetch(`${BASE_URL}/products/mine?seller_id=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch my products");
          return res.json();
        })
        .then((data) => {
          setMyProducts(Array.isArray(data) ? data : []);
          setMyProductsLoading(false);
        })
        .catch((error) => {
          setMyProductsError("Failed to load your products: " + error.message);
          setMyProductsLoading(false);
        });
    }
  }, [activeSection, userId]);

  useEffect(() => {
    if (activeSection === "bought" && userId) {
      setBoughtProductsLoading(true);
      setBoughtProductsError(null);
      fetch(`${BASE_URL}/products/boughtProducts/${userId}`)
        .then((res) => {
          if (res.status === 404) {
            setBoughtProducts([]);
            setBoughtProductsLoading(false);
            return;
          }
          if (!res.ok) throw new Error("Failed to fetch bought products");
          return res.json();
        })
        .then((data) => {
          setBoughtProducts(Array.isArray(data) ? data : []);
          setBoughtProductsLoading(false);
        })
        .catch((error) => {
          setBoughtProductsError("Failed to load bought products: " + error.message);
          setBoughtProductsLoading(false);
        });
    }
  }, [activeSection, userId]);

  useEffect(() => {
    if (activeSection === "Info" && userId) {
      setUserInfoLoading(true);
      setUserInfoError(null);
      fetch(`${BASE_URL}/users/info/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch user info");
          return res.json();
        })
        .then((data) => {
          setUserInfo(data);
          setUserInfoLoading(false);
        })
        .catch((error) => {
          setUserInfoError("Failed to load user info: " + error.message);
          setUserInfoLoading(false);
        });
    }
  }, [activeSection, userId]);

  useEffect(() => {
    if (activeSection === "wishlist" && userId) {
      setWishlistLoading(true);
      setWishlistError(null);
      fetch(`${BASE_URL}/products/wishlist/all?user_id=${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch wishlist");
          return res.json();
        })
        .then((data) => {
          setWishlist(Array.isArray(data) ? data : []);
          setWishlistLoading(false);
        })
        .catch((error) => {
          setWishlistError("Failed to load wishlist: " + error.message);
          setWishlistLoading(false);
        });
    }
  }, [activeSection, userId]);

  useEffect(() => {
    if (activeSection === "notifications" && userId) {
      setNotificationsLoading(true);
      setNotificationsError(null);
      fetch(`${BASE_URL}/notifications/${userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch notifications");
          return res.json();
        })
        .then((data) => {
          setNotifications(Array.isArray(data) ? data : []);
          setNotificationsLoading(false);
        })
        .catch((error) => {
          setNotificationsError("Failed to load notifications: " + error.message);
          setNotificationsLoading(false);
        });
    }
  }, [activeSection, userId]);

  const fetchProductConversations = useCallback(async (productIdToFetch) => {
    if (!userId || !productIdToFetch) return;
    setProductConversationsLoading(true);
    setProductConversationsError(null);
    try {
      const res = await axios.get(`${BASE_URL}/messages/conversations`, {
        params: {
          productId: productIdToFetch,
          sellerId: userId,
        },
      });
      setProductConversations(res.data);
    } catch (err) {
      console.error("Error fetching product conversations:", err);
      setProductConversationsError("Failed to load conversations for this product.");
    } finally {
      setProductConversationsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (activeSection === "chat" && selectedProductForChat?.product_id) {
      fetchProductConversations(selectedProductForChat.product_id);
      const intervalId = setInterval(() => {
        fetchProductConversations(selectedProductForChat.product_id);
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [activeSection, selectedProductForChat, fetchProductConversations, refreshConversationsTrigger]);

  // Function to trigger profile photo refresh
  const handlePhotoUploadSuccess = () => {
    setUserPhotoRefreshKey((prevKey) => prevKey + 1);
  };

  const handleSelectProductForChat = (product) => {
    setSelectedProductForChat(product);
    setActiveChatDetails(null);
    setRefreshConversationsTrigger(prev => prev + 1);
  };

  const handleSelectBuyerConversation = (buyerId, conversationId) => {
    setActiveChatDetails({
      productId: selectedProductForChat.product_id,
      sellerId: userId,
      buyerId: buyerId,
      conversationId: conversationId,
    });
  };

  const handleChatBoxClose = () => {
    setActiveChatDetails(null);
    setRefreshConversationsTrigger((prev) => prev + 1);
  };

  const renderMyProductsTable = () => {
    if (myProductsLoading) {
      return <div className="text-blue-400 mt-6">Loading your products...</div>;
    }
    if (myProductsError) {
      return <div className="text-red-400 mt-6">{myProductsError}</div>;
    }
    if (!myProducts.length) {
      return <div className="text-gray-400 mt-6">No products listed yet.</div>;
    }
    return (
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-xl">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Product
              </th>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Price
              </th>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {myProducts.map((prod) => (
              <tr
                key={prod.product_id}
                className="border-b border-gray-800 hover:bg-blue-900/20 transition"
              >
                <td className="px-4 py-3 text-gray-100 flex gap-3 items-center">
                  <span>{prod.title + " (" + prod.description + ")"}</span>
                  <button
                    className="ml-3 text-sm bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-md shadow"
                    onClick={() =>
                      navigate(`/dashboard/product/${prod.product_id}`)
                    }
                  >
                    Edit
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-100">{prod.price}৳</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${prod.isavailable === false
                      ? "bg-red-700 text-red-100"
                      : "bg-green-700 text-green-100"
                      }`}
                  >
                    {prod.isavailable === false ? "Sold" : "Available"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {prod.posted_at
                    ? new Date(prod.posted_at).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBoughtProductsTable = () => {
    if (boughtProductsLoading) {
      return (
        <div className="text-blue-400 mt-6">Loading bought products...</div>
      );
    }
    if (boughtProductsError) {
      return <div className="text-red-400 mt-6">{boughtProductsError}</div>;
    }
    if (!boughtProducts.length) {
      return <div className="text-gray-400 mt-6">No products bought yet.</div>;
    }
    return (
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-xl">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Product
              </th>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Price
              </th>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Deliveryman
              </th>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-left text-blue-300 font-semibold">
                Bought On
              </th>
            </tr>
          </thead>
          <tbody>
            {boughtProducts.map((item) => (
              <tr
                key={item.purchase_id || item.product_id}
                className="border-b border-gray-800 hover:bg-blue-900/20 transition"
              >
                <td className="px-4 py-3 text-gray-100">{item.title}</td>
                <td className="px-4 py-3 text-gray-100">{item.price}৳</td>
                <td className="px-4 py-3 text-gray-100">
                  {item.name ? (
                    <span>
                      {item.name}
                      {item.phone ? (
                        <span className="ml-2 text-xs text-gray-400">
                          ({item.phone})
                        </span>
                      ) : null}
                    </span>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${item.status === "delivered"
                      ? "bg-green-700 text-green-100"
                      : "bg-yellow-700 text-yellow-100"
                      }`}
                  >
                    {item.status
                      ? item.status.charAt(0).toUpperCase() +
                      item.status.slice(1)
                      : "Pending"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {item.accepted_at
                    ? new Date(item.accepted_at).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUserInfo = () => {
    if (userInfoLoading) {
      return <div className="text-blue-400 mt-6">Loading user info...</div>;
    }
    if (userInfoError) {
      return <div className="text-red-400 mt-6">{userInfoError}</div>;
    }
    if (!userInfo) {
      return <div className="text-gray-400 mt-6">No user info found.</div>;
    }
    return (
      <div className="mt-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-8 shadow-xl border border-blue-900/30">
        <div className="flex flex-col gap-4 text-gray-200 text-lg">
          <div>
            <span className="font-semibold text-blue-300">Name:</span>{" "}
            {userInfo.name || "-"}
          </div>
          <div>
            <span className="font-semibold text-blue-300">Email:</span>{" "}
            {userInfo.email || "-"}
          </div>
          <div>
            <span className="font-semibold text-blue-300">Phone:</span>{" "}
            {userInfo.phone || "-"}
          </div>
          <div>
            <span className="font-semibold text-blue-300">Joined:</span>{" "}
            {userInfo.created_at
              ? new Date(userInfo.created_at).toLocaleDateString()
              : "-"}
          </div>
        </div>
      </div>
    );
  };

  const renderWishlistTable = () => {
    if (wishlistLoading) {
      return <div className="text-pink-400 mt-6">Loading wishlist...</div>;
    }
    if (wishlistError) {
      return <div className="text-red-400 mt-6">{wishlistError}</div>;
    }
    if (!wishlist.length) {
      return <div className="text-gray-400 mt-6">No products in wishlist.</div>;
    }
    return (
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl shadow-xl">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-pink-300 font-semibold">
                Product
              </th>
              <th className="px-4 py-3 text-left text-pink-300 font-semibold">
                Price
              </th>
              <th className="px-4 py-3 text-left text-pink-300 font-semibold">
                Status
              </th>
              <th className="px-4 py-3 text-left text-pink-300 font-semibold">
                Added On
              </th>
            </tr>
          </thead>
          <tbody>
            {wishlist.map((prod) => (
              <tr
                key={prod.product_id}
                className="border-b border-gray-800 hover:bg-pink-900/20 transition cursor-pointer"
                onClick={() => navigate(`/product/${prod.product_id}`)}
              >
                <td className="px-4 py-3 text-gray-100">
                  {prod.title +
                    (prod.description ? ` (${prod.description})` : "")}
                </td>
                <td className="px-4 py-3 text-gray-100">{prod.price}৳</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${prod.isavailable === false
                      ? "bg-red-700 text-red-100"
                      : "bg-green-700 text-green-100"
                      }`}
                  >
                    {prod.isavailable === false ? "Sold" : "Available"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">
                  {prod.posted_at
                    ? new Date(prod.posted_at).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderNotifications = () => {
    if (notificationsLoading) {
      return (
        <div className="text-yellow-400 mt-6">Loading notifications...</div>
      );
    }

    if (notificationsError) {
      return <div className="text-red-400 mt-6">{notificationsError}</div>;
    }

    if (!notifications.length) {
      return <div className="text-gray-400 mt-6">No notifications yet.</div>;
    }

    return (
      <ul className="mt-6 space-y-4">
        {notifications.map((note) => (
          <li
            key={note.id}
            className={`p-4 rounded-xl shadow-md border ${note.is_read
              ? "bg-gray-800/80 border-gray-700 text-gray-300"
              : "bg-yellow-900/30 border-yellow-600 text-yellow-200"
              }`}
          >
            <h4 className="text-lg font-semibold">{note.title}</h4>
            <p className="text-xs mt-2 text-gray-400">
              {new Date(note.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    );
  };

  const renderChatContent = () => {
    if (!userId) {
      return <div className="text-red-400 mt-6">User ID not found. Cannot load chat.</div>;
    }

    if (activeChatDetails) {
      return (
        <ChatBox
          productId={activeChatDetails.productId}
          sellerId={activeChatDetails.sellerId}
          buyerId={activeChatDetails.buyerId}
          conversationId={activeChatDetails.conversationId}
          currentUserId={userId}
          onClose={handleChatBoxClose}
        />
      );
    }

    if (selectedProductForChat) {
      return (
        <div className="mt-6">
          <button
            onClick={() => {
              setSelectedProductForChat(null);
              setProductConversations([]);
            }}
            className="flex items-center text-blue-400 hover:text-blue-200 transition mb-4"
          >
            <FiArrowLeft className="mr-2" /> Back to Product List
          </button>
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">
            Conversations for "{selectedProductForChat.title}"
          </h2>
          {productConversationsLoading && <div className="text-blue-400">Loading conversations...</div>}
          {productConversationsError && <div className="text-red-400">{productConversationsError}</div>}
          {!productConversationsLoading && !productConversationsError && productConversations.length === 0 && (
            <p className="text-gray-400">No conversations for this product yet.</p>
          )}
          <ul className="space-y-3">
            {productConversations.map((conv) => (
              <li
                key={conv.conversation_id}
                className="bg-gray-800 p-4 rounded-md hover:bg-gray-700 transition cursor-pointer"
                onClick={() =>
                  handleSelectBuyerConversation(conv.buyer_id, conv.conversation_id)
                }
              >
                Buyer: {conv.buyer_name} ({conv.buyer_email})
                {conv.unread_messages_count > 0 && (
                  <span className="ml-3 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {conv.unread_messages_count} New
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="mt-6">
        <h2 className="text-2xl font-semibold text-blue-300 mb-4">
          Select a Product to View Chats
        </h2>
        {myProductsLoading && <div className="text-blue-400">Loading your products...</div>}
        {myProductsError && <div className="text-red-400">{myProductsError}</div>}
        {!myProductsLoading && !myProductsError && myProducts.length === 0 && (
          <p className="text-gray-400">You haven't listed any products yet to receive messages on.</p>
        )}
        <ul className="space-y-3">
          {myProducts.map((prod) => (
            <li
              key={prod.product_id}
              className="bg-gray-800 p-4 rounded-md hover:bg-gray-700 transition cursor-pointer flex justify-between items-center"
              onClick={() => handleSelectProductForChat(prod)}
            >
              <div>
                <span className="font-medium text-gray-100">{prod.title}</span>
                <p className="text-sm text-gray-400">{prod.description}</p>
              </div>
              <span className="text-sm text-purple-400">
                View Conversations <FiMessageSquare className="inline-block ml-1" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  };


  const renderMainContent = () => {
    switch (activeSection) {
      case "Info":
        return (
          <>
            <h1 className="text-4xl font-extrabold text-blue-200 mb-2 flex items-center gap-3 drop-shadow-lg">
              <FiUser className="text-blue-400" /> Welcome to Your Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              This is your dashboard home.
            </p>
            {renderUserInfo()}
          </>
        );
      case "myProducts":
        return (
          <>
            <h1 className="text-4xl font-extrabold text-blue-200 mb-2 flex items-center gap-3 drop-shadow-lg">
              <FiBox className="text-blue-400" /> My Products
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Here are your listed products.
            </p>
            {renderMyProductsTable()}
          </>
        );
      case "bought":
        return (
          <>
            <h1 className="text-4xl font-extrabold text-blue-200 mb-2 flex items-center gap-3 drop-shadow-lg">
              <FiShoppingBag className="text-blue-400" /> My Bought Products
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Here are the products you have purchased.
            </p>
            {renderBoughtProductsTable()}
          </>
        );
      case "wishlist":
        return (
          <>
            <h1 className="text-4xl font-extrabold text-pink-200 mb-2 flex items-center gap-3 drop-shadow-lg">
              <FiHeart className="text-pink-400" /> Wishlist
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Here are your favorite products.
            </p>
            {renderWishlistTable()}
          </>
        );
      case "notifications":
        return (
          <>
            <h1 className="text-4xl font-extrabold text-yellow-200 mb-2 flex items-center gap-3 drop-shadow-lg">
              <FiBell className="text-yellow-400" /> Notifications
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Here are your notifications.
            </p>
            {renderNotifications()}
          </>
        );
      case "chat":
        return (
          <>
            <h1 className="text-4xl font-extrabold text-purple-200 mb-2 flex items-center gap-3 drop-shadow-lg">
              <FiMessageSquare className="text-purple-400" /> My Chats
            </h1>
            <p className="mt-2 text-lg text-gray-400">
              Manage conversations with buyers for your products.
            </p>
            {renderChatContent()}
          </>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!userId) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 via-gray-950 to-blue-900">
      {/* Sidebar */}
      <aside className="w-80 bg-gradient-to-b from-blue-950/95 via-gray-900/90 to-gray-800/90 text-white pt-8 pb-4 px-8 space-y-4 fixed h-full shadow-2xl rounded-r-3xl flex flex-col items-center backdrop-blur-2xl border-r border-blue-900/80 z-20"> {/* Adjusted padding and spacing */}
        <div className="flex flex-col items-center mb-4"> {/* Adjusted margin-bottom */}
          {/* <div className="mb-3">
            <Logo />
          </div> */}
          {/* Replaced the old image display with ProfileImageUploader */}
          <ProfileImageUploader
            currentImageUrl={`${userPhoto}?t=${userPhotoRefreshKey}`} // Pass current photo URL with cache-busting
            onUploadSuccess={handlePhotoUploadSuccess} // Pass the refresh callback
          />
          <h2 className="text-2xl font-bold tracking-wide text-blue-200 drop-shadow-lg">
            {userInfo ? userInfo.name || "User" : "Loading..."}
          </h2>
        </div>
        <nav className="flex flex-col w-full space-y-2"> {/* Adjusted spacing */}
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${activeSection === "Info"
              ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
              : "hover:bg-blue-900/60 hover:text-white text-blue-200"
              }`}
            onClick={() => setActiveSection("Info")}
          >
            <FiHome className="text-xl" /> Info
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${activeSection === "myProducts"
              ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
              : "hover:bg-blue-900/60 hover:text-white text-blue-200"
              }`}
            onClick={() => setActiveSection("myProducts")}
          >
            <FiBox className="text-xl" /> My Products
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${activeSection === "bought"
              ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
              : "hover:bg-blue-900/60 hover:text-white text-blue-200"
              }`}
            onClick={() => setActiveSection("bought")}
          >
            <FiShoppingBag className="text-xl" /> My Bought Products
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${activeSection === "wishlist"
              ? "bg-gradient-to-r from-pink-900 via-pink-800 to-gray-900 text-white shadow-xl ring-2 ring-pink-700"
              : "hover:bg-pink-900/60 hover:text-white text-pink-200"
              }`}
            onClick={() => setActiveSection("wishlist")}
          >
            <FiHeart className="text-xl" /> Wishlist
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${activeSection === "notifications"
              ? "bg-gradient-to-r from-yellow-900 via-yellow-800 to-gray-900 text-white shadow-xl ring-2 ring-yellow-700"
              : "hover:bg-yellow-900/60 hover:text-white text-yellow-200"
              }`}
            onClick={() => setActiveSection("notifications")}
          >
            <FiBell className="text-xl" /> Notifications
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${activeSection === "chat"
              ? "bg-gradient-to-r from-purple-900 via-purple-800 to-gray-900 text-white shadow-xl ring-2 ring-purple-700"
              : "hover:bg-purple-900/60 hover:text-white text-purple-200"
              }`}
            onClick={() => {
              setActiveSection("chat");
              setSelectedProductForChat(null);
              setActiveChatDetails(null);
            }}
          >
            <FiMessageSquare className="text-xl" /> Chat
          </button>
        </nav>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-green-900 via-green-800 to-gray-900 text-green-200 hover:bg-green-900/80 transition font-semibold shadow-lg"
        >
          <FiHome className="text-xl" /> Home Page
        </button>
        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-900 via-red-800 to-gray-900 text-red-200 hover:bg-red-900/80 transition font-semibold shadow-lg"
        >
          <FiLogOut className="text-xl" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-12 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-gradient-to-br from-blue-950/90 via-gray-900/90 to-blue-900/90 rounded-3xl shadow-2xl p-10 w-full max-w-3xl min-h-[350px] border border-blue-900/60 ring-1 ring-blue-900/40">
          {renderMainContent()}
        </div>
      </main>
    </div>
  );
}

export default UserDashBoard;