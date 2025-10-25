"use client";

import { useState, useEffect } from "react";
import GroceryItem from "./components/GroceryItem";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

interface Item {
  id: string;
  name: string;
  quantity: string;
  bought: boolean;
  category: string;
}

const categories = ["Vegetables", "Fruits", "Dairy", "Snacks", "Other"];

export default function GroceryListPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [inputName, setInputName] = useState("");
  const [inputQty, setInputQty] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  useEffect(() => {
    const stored = localStorage.getItem("groceryItems");
    if (stored) setItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("groceryItems", JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (!inputName.trim()) return;
    setItems([
      ...items,
      { id: uuidv4(), name: inputName.trim(), quantity: inputQty.trim() || "1", bought: false, category }
    ]);
    setInputName("");
    setInputQty("");
  };

  const toggleBought = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, bought: !i.bought } : i));
  };

  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const editItem = (id: string, name: string, qty: string, cat: string) => {
    setItems(items.map(i => i.id === id ? { ...i, name, quantity: qty, category: cat } : i));
  };

  const clearAll = () => setItems([]);

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) &&
    (filterCategory === "All" || i.category === filterCategory)
  );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(items);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setItems(reordered);
  };

  return (
    <main className="min-h-screen flex items-start justify-center pt-20 font-Noto">
      <div className="w-[95%] md:w-[60%] bg-[#57534d] p-6 rounded-2xl shadow-2xl flex flex-col items-center max-h-[90vh] overflow-y-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">Grocery List</h1>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4 w-full flex-wrap justify-center">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none flex-1 min-w-[150px]"
          />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-300 text-black"
          >
            <option>All</option>
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Add Item */}
        <div className="w-full flex gap-2 mb-4 flex-wrap justify-center">
          <input
            type="text"
            placeholder="Item Name"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            className="px-4 py-2 rounded-xl bg-white/10 text-white flex-1 min-w-[150px]"
          />
          <input
            type="text"
            placeholder="Qty"
            value={inputQty}
            onChange={e => setInputQty(e.target.value)}
            className="w-24 px-4 py-2 rounded-xl bg-white/10 text-white"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="px-4 py-2 rounded-xl bg-gray-400 text-black"
          >
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <button
            onClick={addItem}
            className="px-4 py-2 bg-green-500 text-black rounded-xl font-semibold"
          >
            Add
          </button>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearAll}
            className="mb-4 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold"
          >
            Clear All
          </button>
        )}

        {/* Drag and Drop List */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="groceryList">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="w-full flex flex-col gap-2">
                {filteredItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <GroceryItem
                          item={item}
                          toggleBought={toggleBought}
                          deleteItem={deleteItem}
                          editItem={editItem}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </main>
  );
}
