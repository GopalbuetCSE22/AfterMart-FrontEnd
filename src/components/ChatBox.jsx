import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from 'axios';
import { Paperclip, Send, Trash2, X, Loader2, MessageCircleMore } from "lucide-react"; // Added MessageCircleMore icon

const BASE_URL = 'http://localhost:5000/api';

const ChatBox = ({ productId, sellerId, buyerId, conversationId: initialConversationId, currentUserId, onClose }) => {
    // Initialize conversationId using the prop if available, otherwise null
    const [conversationId, setConversationId] = useState(initialConversationId);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null); // Ref for hidden file input
    const chatBoxRef = useRef(null); // Ref for the chatbox container for outside click and dragging

    const [buyerName, setBuyerName] = useState("Loading...");
    const [sellerName, setSellerName] = useState("Loading...");

    // New states for image attachment
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isUploadingImage, setIsUploadingImage] = useState(false); // For image upload to ImageKit
    const [isSendingMessage, setIsSendingMessage] = useState(false); // Combined loading for sending message

    // State for message deletion hover
    const [hoveredMessageId, setHoveredMessageId] = useState(null);

    // States for dragging functionality
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 520 }); // Initial position (bottom-right)
    const dragStart = useRef({ x: 0, y: 0 }); // Stores initial mouse position
    const elementStart = useRef({ x: 0, y: 0 }); // Stores initial element position

    // Scrolls the chat to the bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Effect to scroll to bottom when messages array changes
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Effect to fetch buyer and seller names when their IDs are available
    useEffect(() => {
        const fetchNames = async () => {
            if (buyerId) {
                try {
                    const res = await axios.get(`${BASE_URL}/users/getName/${buyerId}`); // Assuming /api/users/getName/:id endpoint
                    setBuyerName(res.data?.name || "Unknown Buyer");
                } catch (error) {
                    console.error(`Failed to fetch buyer name for ID ${buyerId}:`, error);
                    setBuyerName("Error loading name");
                }
            }
            if (sellerId) {
                try {
                    const res = await axios.get(`${BASE_URL}/users/getName/${sellerId}`); // Assuming /api/users/getName/:id endpoint
                    setSellerName(res.data?.name || "Unknown Seller");
                } catch (error) {
                    console.error(`Failed to fetch seller name for ID ${sellerId}:`, error);
                    setSellerName("Error loading name");
                }
            }
        };
        fetchNames();
    }, [buyerId, sellerId]); // Dependencies: re-fetch names if buyerId or sellerId changes

    // Effect to start or retrieve conversation ID
    useEffect(() => {
        // If an initialConversationId is provided, we already have the ID, so no need to call startConversation
        if (initialConversationId) {
            setConversationId(initialConversationId);
            return; // Exit early as we don't need to start a new one
        }

        // Only proceed to start a conversation if no ID was provided (i.e., it's a new chat initiation)
        const startConversation = async () => {
            try {
                const res = await axios.post(`${BASE_URL}/messages/start`, { productId, buyerId, sellerId });
                if (res.data.conversationId) {
                    setConversationId(res.data.conversationId);
                } else {
                    console.error("Failed to get conversation ID from start endpoint.");
                    // Optionally show a toast error to the user
                }
            } catch (error) {
                console.error("Failed to start conversation", error);
                // Optionally show a toast error to the user
            }
        };

        startConversation();
    }, [productId, buyerId, sellerId, initialConversationId]); // Dependencies: if any of these change, re-run

    // Effect to fetch messages once conversationId is available
    useEffect(() => {
        if (!conversationId) return; // Don't fetch messages if conversationId isn't set yet

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/messages/${conversationId}`);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        fetchMessages(); // Fetch immediately on conversationId change
        const intervalId = setInterval(fetchMessages, 5000); // Then poll every 5 seconds
        return () => clearInterval(intervalId); // Cleanup on unmount or conversationId change
    }, [conversationId]); // Dependency: re-fetch messages if conversationId changes

    // Handles file input change for image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file)); // Create a local URL for instant preview
        } else {
            setSelectedImageFile(null);
            setImagePreviewUrl(null);
        }
        // Clear the file input value so the same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Handles removing the selected image preview
    const handleRemoveImagePreview = () => {
        setSelectedImageFile(null);
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl); // Clean up the object URL to prevent memory leaks
        }
        setImagePreviewUrl(null);
    };

    // Function to handle sending a message (can include text and/or an image)
    const handleSendMessage = useCallback(async () => {
        // Do not proceed if no text and no image are selected, or if conversationId is missing
        if ((!newMessage.trim() && !selectedImageFile) || !conversationId) {
            console.error("Cannot send empty message or missing conversation ID.");
            return;
        }

        setIsSendingMessage(true); // Start overall sending loading
        let mediaUrl = null;

        try {
            // Step 1: Upload image to ImageKit via your backend proxy if an image is selected
            if (selectedImageFile) {
                setIsUploadingImage(true); // Start image specific upload loading
                const imgForm = new FormData();
                imgForm.append("image", selectedImageFile); // 'image' must match Multer field name on backend

                // Send the image to your backend's image upload endpoint for message media
                const uploadRes = await axios.post(`${BASE_URL}/uploadImage/uploadMessageMedia`, imgForm, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // Important for FormData
                    },
                });

                if (uploadRes.data && uploadRes.data.url) {
                    mediaUrl = uploadRes.data.url; // Get the URL of the uploaded image
                } else {
                    // If image upload fails, throw an error to stop message sending
                    throw new Error(uploadRes.data.error || 'Image upload failed. Please try again.');
                }
            }

            // Step 2: Send the message content and/or the uploaded image URL to the message endpoint
            await axios.post(`${BASE_URL}/messages/send`, {
                conversationId,
                senderId: currentUserId,
                content: newMessage.trim(), // Send trimmed text content (can be empty string if only image)
                mediaUrl: mediaUrl, // Pass the uploaded image URL (will be null if no image was selected)
            });

            // Clear input fields and loading states after successful send
            setNewMessage("");
            handleRemoveImagePreview(); // Clear image preview and file
            setIsUploadingImage(false); // Ensure image upload loading is off

            // Re-fetch messages immediately after sending for instant UI update
            const res = await axios.get(`${BASE_URL}/messages/${conversationId}`);
            setMessages(res.data);
            scrollToBottom(); // Scroll to bottom to show the new message
        } catch (error) {
            console.error("Failed to send message:", error.response?.data?.error || error.message);
            // Optionally, show a user-friendly error message (e.g., using a toast notification)
        } finally {
            setIsSendingMessage(false); // End overall sending loading
            setIsUploadingImage(false); // Ensure image upload loading is off
        }
    }, [newMessage, selectedImageFile, conversationId, currentUserId, handleRemoveImagePreview]);

    // Function to handle deleting a message
    const handleDeleteMessage = useCallback(async (messageId) => {
        if (!window.confirm("Are you sure you want to delete this message? This action cannot be undone.")) {
            return; // If user cancels, do nothing
        }

        try {
            // Send DELETE request to the backend
            await axios.delete(`${BASE_URL}/messages/${messageId}`);
            console.log(`Message ${messageId} deleted successfully.`);

            // Re-fetch messages to update the UI after deletion
            const res = await axios.get(`${BASE_URL}/messages/${conversationId}`);
            setMessages(res.data);
        } catch (error) {
            console.error(`Failed to delete message ${messageId}:`, error.response?.data?.error || error.message);
            // Optionally, show a user-friendly error message
        }
    }, [conversationId]);

    // Handles key presses in the textarea (e.g., Enter to send, Escape to close)
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { // Send on Enter, but allow Shift+Enter for new line
            e.preventDefault(); // Prevent default new line behavior
            handleSendMessage();
        } else if (e.key === "Escape") {
            if (onClose) onClose(); // Close chatbox on Escape key
        }
    };

    // --- Draggable functionality ---
    const onMouseDown = (e) => {
        setIsDragging(true);
        dragStart.current = { x: e.clientX, y: e.clientY };
        elementStart.current = { x: position.x, y: position.y };
    };

    const onMouseMove = useCallback((e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPosition({
            x: elementStart.current.x + dx,
            y: elementStart.current.y + dy,
        });
    }, [isDragging]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        } else {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, onMouseMove, onMouseUp]);

    // --- Close on outside click functionality ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatBoxRef.current && !chatBoxRef.current.contains(event.target)) {
                if (onClose) onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);


    return (
        // Main container for the chat box, fixed at bottom-right, now with dynamic position
        <div
            ref={chatBoxRef}
            className="fixed bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl w-96 flex flex-col h-[500px] text-white z-50 overflow-hidden border border-gray-700"
            style={{ left: position.x, top: position.y }}
        >
            {/* Chat Box Header - Draggable Area */}
            <div
                className="flex items-center justify-between bg-gray-800 bg-opacity-70 backdrop-blur-sm px-4 py-3 rounded-t-2xl border-b border-gray-700 cursor-grab active:cursor-grabbing"
                onMouseDown={onMouseDown}
            >
                <h3 className="font-semibold text-lg text-teal-400 drop-shadow-md">
                    Chat with {currentUserId === buyerId ? sellerName : buyerName}
                </h3>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Close chat"
                >
                    <X size={20} /> {/* Lucide-react X icon */}
                </button>
            </div>

            {/* Messages Display Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-teal-700 scrollbar-track-gray-800">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4">
                        <MessageCircleMore size={64} className="text-teal-600 mb-4 opacity-70" />
                        <p className="text-lg font-medium">No messages yet!</p>
                        <p className="text-sm">Start the conversation by sending a message.</p>
                    </div>
                )}

                {messages.map((msg) => {
                    const isSender = msg.sender_id === parseInt(currentUserId);
                    const hasMedia = msg.media_urls && msg.media_urls.length > 0;

                    return (
                        <div
                            key={msg.message_id}
                            // Add 'relative' to the outermost container to serve as positioning context for the absolute delete button
                            className={`flex ${isSender ? "justify-end" : "justify-start"} relative`}
                            onMouseEnter={() => setHoveredMessageId(msg.message_id)}
                            onMouseLeave={() => setHoveredMessageId(null)}
                        >
                            <div className={`flex items-end max-w-[80%]`} style={{ position: 'relative' }}> {/* Ensure this is relative for absolute positioning */}
                                {/* Delete button */}
                                {isSender && (
                                    <button
                                        onClick={() => handleDeleteMessage(msg.message_id)}
                                        className={`absolute p-1 text-red-400 hover:text-red-500 transition-opacity duration-200 z-10
                                            ${hoveredMessageId === msg.message_id ? 'opacity-100' : 'opacity-0'}
                                            ${isSender ? 'left-[-20px] top-[-5px]' : 'right-[-20px] top-[-5px]'}` // Adjusted positioning
                                        }
                                        aria-label="Delete message"
                                    >
                                        <Trash2 size={16} /> {/* Lucide-react Trash2 icon */}
                                    </button>
                                )}
                                <div className={`px-4 py-2 rounded-xl whitespace-pre-wrap shadow-md ${isSender ? "bg-teal-700 text-white rounded-br-none" : "bg-gray-700 text-white rounded-bl-none"}`}>
                                    {hasMedia && (
                                        <div className="mb-2">
                                            {msg.media_urls.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt="Message attachment"
                                                    className="max-w-full h-auto rounded-lg object-cover border border-gray-600 mb-1"
                                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x100/334155/E2E8F0?text=Image+Error"; }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                    {/* Display text content only if it exists */}
                                    {msg.content && <p className="text-sm">{msg.content}</p>}
                                    <div className="text-xs text-gray-300 mt-1 text-right opacity-80">
                                        {/* Format timestamp to show only hour and minute */}
                                        {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} /> {/* Ref for scrolling to bottom */}
            </div>

            {/* Image Preview Section - Shown when an image is selected */}
            {imagePreviewUrl && (
                <div className="relative p-3 bg-gray-800 border-t border-gray-700 flex items-center justify-between rounded-b-2xl">
                    <img src={imagePreviewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-gray-600 mr-3" />
                    {/* Display filename, truncated if long */}
                    <span className="text-sm text-gray-300 flex-grow truncate font-mono">{selectedImageFile?.name}</span>
                    {/* Button to remove image preview */}
                    <button
                        onClick={handleRemoveImagePreview}
                        className="text-gray-400 hover:text-red-400 p-1 rounded-full transition-colors duration-200"
                        aria-label="Remove image"
                    >
                        <X size={18} /> {/* Lucide-react X icon */}
                    </button>
                </div>
            )}

            {/* Message Input Area */}
            <div className="bg-gray-800 bg-opacity-70 backdrop-blur-sm px-4 py-3 rounded-b-2xl border-t border-gray-700 flex items-center space-x-2">
                {/* Hidden file input for image selection */}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isSendingMessage} // Disable input while message is sending
                />
                {/* Button to trigger the hidden file input */}
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="p-2 text-gray-400 hover:text-teal-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full"
                    title="Attach Image"
                    disabled={isSendingMessage} // Disable button while message is sending
                >
                    <Paperclip size={20} /> {/* Lucide-react Paperclip icon */}
                </button>

                {/* Textarea for message input */}
                <textarea
                    rows={1}
                    placeholder="Type your message..."
                    className="flex-grow resize-none rounded-xl bg-gray-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-inner custom-scrollbar"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isSendingMessage} // Disable textarea while message is sending
                    style={{ maxHeight: '100px' }} // Prevent textarea from growing too large
                />
                {/* Send Message Button */}
                <button
                    onClick={handleSendMessage}
                    // Disable if no text and no image, or if message is currently sending
                    disabled={(!newMessage.trim() && !selectedImageFile) || isSendingMessage}
                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl px-4 py-2 font-semibold transition-all duration-200 flex items-center justify-center gap-1 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                    {isSendingMessage ? (
                        <Loader2 className="w-5 h-5 animate-spin" /> // Show loader when sending
                    ) : (
                        <Send size={20} /> // Show send icon normally
                    )}
                    <span className="hidden sm:inline">Send</span>
                </button>
            </div>
        </div>
    );
};

export default ChatBox;