
import React, { useState, useEffect } from "react";
import { FaTrash, FaStar } from "react-icons/fa";

export interface Event {
  id: string;
  title: string;
  date: string; 
  pinned?: boolean;
}

interface EventModalProps {
  event: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
  onDelete: (id: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose, onSave, onDelete }) => {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [pinned, setPinned] = useState<boolean>(!!event.pinned);

  useEffect(() => {
    setTitle(event.title);
    setDate(event.date);
    setPinned(!!event.pinned);
  }, [event]);

  const handleSave = () => {
    const trimmed = title.trim();

    if (!trimmed) return;
    onSave({ ...event, title: trimmed, date, pinned });
    onClose();
  };

  const handleDelete = () => {
    if (event.id === "info") {
      onClose();
      return;
    }
    onDelete(event.id);
    onClose();
  };


  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleSave();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [title, date, pinned]);

  return (
    <div className="fixed font-Noto inset-0 bg-black/60 flex items-center justify-center z-50">
      <div
        className="bg-white text-gray-900 p-6 rounded-xl w-full max-w-md transform scale-95 opacity-0 animate-[scaleIn_0.22s_ease-out_forwards]"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Event</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPinned(p => !p)}
              className={`p-2 rounded ${pinned ? "bg-yellow-100 text-yellow-600" : "bg-gray-100 text-gray-600"}`}
              title={pinned ? "Unpin" : "Pin"}
            >
              <FaStar />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded bg-red-50 text-red-600"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded focus:outline-none"
          placeholder="Event title"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Save
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default EventModal;
