"use client";

import { useState, FC } from "react";

interface Item {
  id: string;
  name: string;
  quantity: string;
  bought: boolean;
  category: string;
}

interface Props {
  item: Item;
  toggleBought: (id: string) => void;
  deleteItem: (id: string) => void;
  editItem: (id: string, name: string, qty: string, category: string) => void;
}

const categories = ["Vegetables", "Fruits", "Dairy", "Snacks", "Other"];

const GroceryItem: FC<Props> = ({ item, toggleBought, deleteItem, editItem }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(item.quantity);
  const [category, setCategory] = useState(item.category);

  const saveEdit = () => {
    editItem(item.id, name, qty, category);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-md rounded-xl shadow-sm mb-2 transition-all hover:bg-white/10">
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={item.bought}
          onChange={() => toggleBought(item.id)}
          className="w-5 h-5 accent-gray-800"
        />

        {isEditing ? (
          <div className="flex gap-2 flex-1 flex-wrap">
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="flex-1 px-2 py-1 rounded bg-white/10 text-white focus:outline-none min-w-[100px]"
            />
            <input
              type="text"
              value={qty}
              onChange={e => setQty(e.target.value)}
              className="w-16 px-2 py-1 rounded bg-white/10 text-white"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-2 py-1 rounded bg-white/10 text-white"
            >
              {categories.map(cat => <option key={cat}>{cat}</option>)}
            </select>
            <button
              onClick={saveEdit}
              className="px-2 py-1 bg-green-500 rounded text-black"
            >
              Save
            </button>
          </div>
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`text-white text-sm sm:text-base cursor-pointer ${item.bought ? "line-through text-green-500" : ""}`}
          >
            {item.name} ({item.quantity}) [{item.category}]
          </span>
        )}
      </div>

      <button
        onClick={() => deleteItem(item.id)}
        className="text-red-500 rounded-sm bg-gray-400 py-1 px-2 font-bold text-sm sm:text-base"
      >
        Delete
      </button>
    </div>
  );
};

export default GroceryItem;
