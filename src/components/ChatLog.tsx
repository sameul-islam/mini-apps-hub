


"use client";

import { useChat } from "./ChatProvider";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useLayoutEffect } from "react";

interface ChatLogProps {
  onClose: () => void;
}

const ChatLog = ({ onClose }: ChatLogProps) => {
  const { messages } = useChat();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

 
  useLayoutEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          className="w-[90vw] sm:w-96 h-[70vh] bg-gray-900 rounded-xl shadow-lg flex flex-col text-white"
        >
          {/* Header sticky */}
          <div className="flex justify-between items-center p-4 bg-gray-800 rounded-t-xl sticky top-0 z-10">
            <span className="text-lg font-semibold">Chat History</span>
            <button
              onClick={onClose}
              className="text-white text-xl font-bold hover:text-red-400"
            >
              &times;
            </button>
          </div>

          {/* Messages scrollable */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.map((msg) => (
              <div key={msg.id} className="p-2 rounded bg-gray-700">
                <span className="text-green-500 text-xs font-semibold mr-1">
                  {msg.timestamp instanceof Date
                    ? msg.timestamp.toLocaleString()
                    : new Date(msg.timestamp).toLocaleString()}
                  :
                </span>
                <span>{msg.message}</span>
              </div>
            ))}
            {/* Scroll bottom reference */}
            <div ref={messagesEndRef}></div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatLog;
