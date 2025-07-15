import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadImage from "../../components/UploadImage";
import {
  FiHome,
  FiBox,
  FiShoppingBag,
  FiHeart,
  FiBell,
  FiUser,
  FiLogOut,
} from "react-icons/fi";
import Header from "../../components/Header";

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

  const navigate = useNavigate();
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    navigate("/login");
    alert("You are not logged in. Please log in to access your dashboard.");
    navigate("/login");
    return; // Prevent rendering if userId is not found
  }
  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/api/uploadImage/getProfilePic/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setUserPhoto(data[0].profile_picture);
          } else {
            setUserPhoto(null);
          }
        })
        .catch(() => setUserPhoto(null));
    }
  }, [userId]);

  useEffect(() => {
    if (activeSection === "myProducts" && userId) {
      setMyProductsLoading(true);
      setMyProductsError(null);
      fetch(`http://localhost:5000/api/products/mine?seller_id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setMyProducts(Array.isArray(data) ? data : []);
          setMyProductsLoading(false);
        })
        .catch(() => {
          setMyProductsError("Failed to load your products.");
          setMyProductsLoading(false);
        });
    }
  }, [activeSection, userId]);

  useEffect(() => {
    if (activeSection === "bought" && userId) {
      setBoughtProductsLoading(true);
      setBoughtProductsError(null);
      fetch(`http://localhost:5000/api/products/boughtProducts/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setBoughtProducts(Array.isArray(data) ? data : []);
          setBoughtProductsLoading(false);
        })
        .catch(() => {
          setBoughtProductsError("Failed to load bought products.");
          setBoughtProductsLoading(false);
        });
    }
  }, [activeSection, userId]);

  useEffect(() => {
    if (activeSection === "Info" && userId) {
      setUserInfoLoading(true);
      setUserInfoError(null);
      fetch(`http://localhost:5000/api/users/info/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setUserInfo(data);
          setUserInfoLoading(false);
        })
        .catch(() => {
          setUserInfoError("Failed to load user info.");
          setUserInfoLoading(false);
        });
    }
  }, [activeSection, userId]);

  useEffect(() => {
    if (activeSection === "wishlist" && userId) {
      setWishlistLoading(true);
      setWishlistError(null);
      fetch(`http://localhost:5000/api/products/wishlist/all?user_id=${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setWishlist(Array.isArray(data) ? data : []);
          setWishlistLoading(false);
        })
        .catch(() => {
          setWishlistError("Failed to load wishlist.");
          setWishlistLoading(false);
        });
    }
  }, [activeSection, userId]);

  useEffect(() => {
    if (activeSection === "notifications" && userId) {
      setNotificationsLoading(true);
      setNotificationsError(null);
      fetch(`http://localhost:5000/api/notifications/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          setNotifications(Array.isArray(data) ? data : []);
          setNotificationsLoading(false);
        })
        .catch(() => {
          setNotificationsError("Failed to load notifications.");
          setNotificationsLoading(false);
        });
    }
  }, [activeSection, userId]);

  // ! change the userphoto instantly
  const fetchUserPhoto = () => {
    if (userId) {
      fetch(`http://localhost:5000/api/uploadImage/getProfilePic/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setUserPhoto(data[0].profile_picture);
          } else {
            setUserPhoto(null);
          }
        })
        .catch(() => setUserPhoto(null));
    }
  };

  useEffect(() => {
    fetchUserPhoto();
  }, [userId]);

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
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      prod.isavailable === false
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
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      item.status === "delivered"
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
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      prod.isavailable === false
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
            className={`p-4 rounded-xl shadow-md border ${
              note.is_read
                ? "bg-gray-800/80 border-gray-700 text-gray-300"
                : "bg-yellow-900/30 border-yellow-600 text-yellow-200"
            }`}
          >
            <h4 className="text-lg font-semibold">{note.title}</h4>
            {/* <p className="text-sm mt-1">{note.description}</p> */}
            <p className="text-xs mt-2 text-gray-400">
              {new Date(note.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
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
    }
  };

  // Optional: Logout handler
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-950 via-gray-950 to-blue-900">
      {/* Sidebar */}

      <aside className="w-80 bg-gradient-to-b from-blue-950/95 via-gray-900/90 to-gray-800/90 text-white p-8 space-y-8 fixed h-full shadow-2xl rounded-r-3xl flex flex-col items-center backdrop-blur-2xl border-r border-blue-900/80 z-20">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-3">
            <Logo />
          </div>
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-gray-800 via-blue-900 to-black flex items-center justify-center mb-3 shadow-xl border-4 border-blue-900/60 overflow-hidden ring-4 ring-blue-800/40">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt="user profile"
                className="w-full h-full object-cover"
                style={{ maxWidth: "96px", maxHeight: "96px" }}
              />
            ) : (
              <span className="text-4xl font-bold text-gray-300">U</span>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-wide text-blue-200 drop-shadow-lg">
            {/* show the user name instead of aftermart */}
            {userInfo ? userInfo.name || "User" : "Loading..."}
          </h2>
        </div>
        <nav className="flex flex-col w-full space-y-3">
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${
              activeSection === "Info"
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
                : "hover:bg-blue-900/60 hover:text-white text-blue-200"
            }`}
            onClick={() => setActiveSection("Info")}
          >
            <FiHome className="text-xl" /> Info
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${
              activeSection === "myProducts"
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
                : "hover:bg-blue-900/60 hover:text-white text-blue-200"
            }`}
            onClick={() => setActiveSection("myProducts")}
          >
            <FiBox className="text-xl" /> My Products
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${
              activeSection === "bought"
                ? "bg-gradient-to-r from-blue-900 via-blue-800 to-gray-900 text-white shadow-xl ring-2 ring-blue-700"
                : "hover:bg-blue-900/60 hover:text-white text-blue-200"
            }`}
            onClick={() => setActiveSection("bought")}
          >
            <FiShoppingBag className="text-xl" /> My Bought Products
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${
              activeSection === "wishlist"
                ? "bg-gradient-to-r from-pink-900 via-pink-800 to-gray-900 text-white shadow-xl ring-2 ring-pink-700"
                : "hover:bg-pink-900/60 hover:text-white text-pink-200"
            }`}
            onClick={() => setActiveSection("wishlist")}
          >
            <FiHeart className="text-xl" /> Wishlist
          </button>
          <button
            className={`flex items-center gap-3 transition-all duration-200 text-left px-5 py-3 rounded-xl font-medium tracking-wide ${
              activeSection === "notifications"
                ? "bg-gradient-to-r from-yellow-900 via-yellow-800 to-gray-900 text-white shadow-xl ring-2 ring-yellow-700"
                : "hover:bg-yellow-900/60 hover:text-white text-yellow-200"
            }`}
            onClick={() => setActiveSection("notifications")}
          >
            <FiBell className="text-xl" /> Notifications
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
        <div className="mt-10 w-full max-w-2xl bg-gradient-to-br from-blue-950/80 via-gray-900/80 to-blue-900/80 rounded-2xl shadow-xl p-8 border border-blue-900/40">
          <h3 className="text-xl font-bold text-blue-200 mb-4 flex items-center gap-2">
            <FiUser className="text-blue-400" /> Update Profile Picture
          </h3>
          <UploadImage onUploadSuccess={fetchUserPhoto} />
        </div>
      </main>
    </div>
  );
}

export default UserDashBoard;
