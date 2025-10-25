

"use client";

import { FC } from "react";
import { RxCross2 } from "react-icons/rx";

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  isEditing: boolean;
  editText: string;
  setEditText: (text: string) => void;
  saveEdit: (id: string) => void;
}

const TodoItem: FC<TodoItemProps> = ({
  id,
  text,
  completed,
  onToggle,
  onDelete,
  onEdit,
  isEditing,
  editText,
  setEditText,
  saveEdit,
}) => {
  return (
    <div className="flex items-start justify-start p-3 bg-white/5 backdrop-blur-md rounded-xl shadow-sm mb-2 transition-all hover:bg-white/10">
      
      {/* Checkbox + Delete buttons container */}
      <div className="flex flex-col items-start justify-start mr-3">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          className="w-5 h-5  accent-gray-800 mb-1"
        />
        <button
          onClick={() => onDelete(id)}
          className="text-red-500  rounded-sm bg-gray-400 py-1 px-2 font-bold text-sm sm:text-base"
        >
          <RxCross2 />
        </button>
      </div>

      {/* Text / Editable input */}
      <div className="flex-1">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={() => saveEdit(id)}
            onKeyDown={(e) => e.key === "Enter" && saveEdit(id)}
            className="w-full px-2 py-1 rounded bg-white/10 text-white focus:outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => onEdit(id, text)}
            className={`text-white text-sm sm:text-base cursor-pointer ${
              completed ? "line-through text-green-500" : ""
            }`}
          >
            {text}
          </span>
        )}
      </div>
    </div>
  );
};

export default TodoItem;
