
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AIPanelProps {
  onClose: () => void;
}

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const AIPanel = ({ onClose }: AIPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;


    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = input.trim();
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
      });

      const data = await res.json();


      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.reply || "AI service is temporarily unavailable.",
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      const aiMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: `AI service is temporarily unavailable. You wrote: "${messageToSend}"`,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setLoading(false);
    }
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
        className="fixed inset-0 z-50 flex items-center font-Noto justify-center bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-[90vw] sm:w-[420px] h-[65vh] bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col text-white"
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-lg font-semibold">AI Assistant</span>
            <button
              onClick={onClose}
              className="text-white text-2xl font-bold hover:text-red-400 transition"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mb-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-xl max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-teal-600 self-end ml-auto text-right"
                    : "bg-gray-700 self-start"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="text-sm text-gray-400 italic">Thinking...</div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 rounded-lg bg-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIPanel;
