"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import type { Note } from "./NoteCard";

interface Props {
  note: Note | null;
  open: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
}

const spring = { type: "spring", stiffness: 300, damping: 28 } as const;

const NoteModal: React.FC<Props> = ({ note, open, onClose, onSave }) => {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const [localNote, setLocalNote] = useState<Note | null>(note);

  useEffect(() => {
    if (open) {
      setLocalNote(note); 
      setTimeout(() => titleRef.current?.focus(), 60);
    }
  }, [open, note]);

  if (!open || !localNote) return null;

  const handleSave = () => {
    onSave({ ...localNote, updatedAt: Date.now() });
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={spring}
        className="relative z-10 w-[95%] max-w-2xl bg-white/6 backdrop-blur-lg rounded-2xl p-6 shadow-2xl"
        onKeyDown={handleKeyDown}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <input
              ref={titleRef}
              value={localNote.title}
              onChange={(e) =>
                setLocalNote({ ...localNote, title: e.target.value })
              }
              placeholder="Title"
              className="w-full bg-transparent text-white text-lg font-semibold placeholder-gray-300 focus:outline-none"
            />

            <textarea
              value={localNote.content}
              onChange={(e) =>
                setLocalNote({ ...localNote, content: e.target.value })
              }
              placeholder="Write your note..."
              rows={8}
              className="mt-3 w-full bg-transparent text-gray-100 placeholder-gray-400 resize-none focus:outline-none"
            />

            <p className="text-xs text-gray-400 mt-2">
               Tip: Press{" "}
              <kbd className="px-1 py-0.5 rounded bg-white/5">Ctrl</kbd> +{" "}
              <kbd className="px-1 py-0.5 rounded bg-white/5">Enter</kbd> to save.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-white/10 text-gray-200"
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NoteModal;
