
"use client";

import React, { useEffect, useMemo, useState } from "react";
import NoteCard, { Note } from "./components/NoteCard";
import NoteModal from "./components/NoteModal";
import { v4 as uuidv4 } from "uuid";
import { FaPlus, FaSearch, FaInfoCircle } from "react-icons/fa";

const STORAGE_KEY = "apphub_notes_v1";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [query, setQuery] = useState("");
  const [openNote, setOpenNote] = useState<Note | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Load notes
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setNotes(JSON.parse(raw));
      } catch {
        setNotes([]);
      }
    }
  }, []);

  // Save notes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // Create new note
  const createNote = (title = "", content = "") => {
    const n: Note = {
      id: uuidv4(),
      title,
      content,
      pinned: false,
      updatedAt: Date.now(),
    };
    setNotes(prev => [n, ...prev]);
    setOpenNote(n);
    setModalOpen(true);
  };

  // Update note
  const updateNote = (n: Note) => {
    setNotes(prev =>
      prev.map(x => (x.id === n.id ? { ...n, updatedAt: Date.now() } : x))
    );
  };

  // Delete note
  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Toggle pin
  const togglePin = (id: string) => {
    setNotes(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n));
      updated.sort((a, b) =>
        b.pinned === a.pinned
          ? (b.updatedAt || 0) - (a.updatedAt || 0)
          : Number(b.pinned) - Number(a.pinned)
      );
      return updated;
    });
  };

  // Filtered notes
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(n => (n.title + " " + n.content).toLowerCase().includes(q));
  }, [notes, query]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "Enter") {
        e.preventDefault();
        createNote();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <main className="h-screen font-Noto w-[95%] lg:w-[85%] mx-auto bg-[#171717] p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full md:w-[90%] max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl whitespace-nowrap font-extrabold text-white flex items-center gap-2 border-b-2">
            Daily Notes..
          </h1>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[420px]">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/6 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-gray-700"
              />
            </div>

            <button
              onClick={() => createNote()}
              className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              aria-label="Create new note"
            >
              <FaPlus /> New
            </button>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-gray-400 text-center py-8">
              No notes yet — create one with <kbd className="px-2 py-1 rounded bg-white/5">New</kbd> or press <kbd className="px-2 py-1 rounded bg-white/5"> Alt + Enter</kbd>.
            </div>
          ) : (
            filtered.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={n => {
                  setOpenNote(n);
                  setModalOpen(true);
                }}
                onDelete={deleteNote}
                onTogglePin={togglePin}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      <NoteModal
        note={openNote}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={updateNote}
      />
    </main>
  );
}
