"use client";

import React from "react";
import { FaTrash, FaEdit, FaThumbtack } from "react-icons/fa";

export interface Note {
  id: string;
  title: string;
  content: string;
  pinned?: boolean;
  color?: string;
  updatedAt?: number;
}

interface Props {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const NoteCard: React.FC<Props> = ({ note, onEdit, onDelete, onTogglePin }) => {
  return (
    <article
      className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[140px] "
      style={{ borderLeft: note.pinned ? "4px solid rgba(255,255,255,0.12)" : undefined }}
      aria-label={`Note ${note.title}`}
    >
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-white font-semibold text-2xl">
            {note.title || "Untitled"}
          </h3>
          <div className="flex items-center gap-2 text-gray-300">
            <button
              onClick={() => onTogglePin(note.id)}
              title={note.pinned ? "Unpin note" : "Pin note"}
              className="p-1 hover:text-yellow-300"
              aria-label="Pin note"
            >
              <FaThumbtack />
            </button>
            <button
              onClick={() => onEdit(note)}
              title="Edit note"
              className="p-1 hover:text-sky-300"
              aria-label="Edit note"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              title="Delete note"
              className="p-1 hover:text-red-400"
              aria-label="Delete note"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <p className="text-gray-300 text-xl mt-3 whitespace-pre-wrap  line-clamp-5">
          {note.content || <span className="text-gray-500 italic">No content</span>}
        </p>
      </div>

      <div className="mt-3 text-xs text-gray-400 flex justify-between items-center">
        <span>{note.updatedAt ? new Date(note.updatedAt).toLocaleString() : ""}</span>
        {note.pinned ? <span className="text-yellow-300 text-xs">Pinned</span> : null}
      </div>
    </article>
  );
};

export default NoteCard;
