import React, { useState, useEffect, useRef } from "react";

const ChatBox = ({ productId, sellerId, buyerId, currentUserId, onClose }) => {
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const startConversation = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/messages/start", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId, buyerId, sellerId }),
                });
                const data = await res.json();
                if (data.conversationId) setConversationId(data.conversationId);
            } catch (error) {
                console.error("Failed to start conversation", error);
            }
        };
        startConversation();
    }, [productId, buyerId, sellerId]);

    useEffect(() => {
        if (!conversationId) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/messages/${conversationId}`);
                const data = await res.json();
                setMessages(data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        fetchMessages();
        const intervalId = setInterval(fetchMessages, 5000);
        return () => clearInterval(intervalId);
    }, [conversationId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !conversationId) return;

        try {
            await fetch("http://localhost:5000/api/messages/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    conversationId,
                    senderId: currentUserId,
                    content: newMessage.trim(),
                }),
            });
            setNewMessage("");
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        } else if (e.key === "Escape") {
            if (onClose) onClose();
        }
    };

    return (
        <div className="bg-slate-900 rounded-lg shadow-lg max-w-xl mx-auto flex flex-col h-[500px] text-white">
            <div className="flex items-center justify-between bg-slate-800 px-4 py-2 rounded-t-lg border-b border-slate-700">
                <h3 className="font-semibold text-lg">Chat</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800">
                {messages.length === 0 && (
                    <p className="text-center text-slate-400 mt-20">No messages yet. Say hello!</p>
                )}

                {messages.map((msg) => {
                    const isSender = msg.sender_id === parseInt(currentUserId);
                    return (
                        <div key={msg.message_id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[70%] px-4 py-2 rounded-lg whitespace-pre-wrap ${isSender ? "bg-green-600 text-white rounded-br-none" : "bg-slate-700 text-white rounded-bl-none"}`}>
                                {msg.content}
                                <div className="text-xs text-slate-300 mt-1 text-right">
                                    {new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="bg-slate-800 px-4 py-3 rounded-b-lg border-t border-slate-700 flex items-center space-x-2">
                <textarea
                    rows={1}
                    placeholder="Type your message..."
                    className="flex-grow resize-none rounded-md bg-slate-700 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md px-4 py-2 font-semibold transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatBox;
