
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatBox from "./ChatBox";
import ChatLog from "./ChatLog";
import AIPanel from "./AIPanel";

const FAB = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [activeModal, setActiveModal] = useState<"chat" | "history" | "ai" | null>(null);

  const toggleMenu = () => setOpenMenu(!openMenu);
  const openModal = (type: "chat" | "history" | "ai") => {
    setActiveModal(type);
    setOpenMenu(false);
  };
  const closeModal = () => setActiveModal(null);

  const radius = 80;

  const positions = [
    { x: 0, y: -radius },                 
    { x: -radius * 0.7, y: -radius * 0.7 }, 
    { x: -radius, y: 0 },                
  ];

  const buttons = [
    { img: "/images/chat-icon.png", type: "chat" },      
    { img: "/images/history-icon.png", type: "history" }, 
    { img: "/images/ai-icon.png", type: "ai" },         
  ];

  return (
    <>
      <div className="fixed bottom-5 font-Noto right-5 z-50">
        <AnimatePresence>
          {openMenu &&
            buttons.map((btn, index) => {
              const pos = positions[index];
              return (
                <motion.button
                  key={btn.type}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center p-2"
                  onClick={() => openModal(btn.type as any)}
                >
                  <img
                    src={btn.img}
                    alt={btn.type}
                    className="w-full h-full object-contain"
                  />
                </motion.button>
              );
            })}
        </AnimatePresence>

        {/* Main FAB */}
        <button
          onClick={toggleMenu}
          className="w-14 h-14 rounded-full bg-[#009689] text-white font-bold text-3xl shadow-lg"
        >
          +
        </button>
      </div>

      {/* Modals */}
      {activeModal === "chat" && <ChatBox onClose={closeModal} />}
      {activeModal === "history" && <ChatLog onClose={closeModal} />}
      {activeModal === "ai" && <AIPanel onClose={closeModal} />}
    </>
  );
};

export default FAB;



