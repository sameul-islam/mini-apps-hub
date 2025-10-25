
"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "./ChatProvider";
import { motion, AnimatePresence } from "framer-motion";

interface ChatBoxProps {
  onClose: () => void;
}

const ChatBox = ({ onClose }: ChatBoxProps) => {
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input, "user");
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-[90vw] sm:w-96 h-[60vh] bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col text-white"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold">Chat</span>
            <button onClick={onClose} className="text-white text-xl font-bold">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto mb-2 flex flex-col gap-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-gray-100 self-end text-black"
                    : "bg-gray-500 self-start text-white"
                }`}
              >
                <span className="text-xs text-gray-500 mr-1">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
                {msg.message}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-1 rounded bg-gray-800 focus:outline-none focus:ring focus:ring-white/50"
            />
            <button
              onClick={handleSend}
              className="bg-black border border-gray-300 px-3 py-1 rounded font-semibold"
            >
              Send
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBox;
