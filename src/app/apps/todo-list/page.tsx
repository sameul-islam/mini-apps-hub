"use client";

import { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import { v4 as uuidv4 } from "uuid";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [showHelp, setShowHelp] = useState(false); 

 
  useEffect(() => {
    const stored = localStorage.getItem("todos");
    if (stored) setTodos(JSON.parse(stored));
  }, []);


  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    setTodos([...todos, { id: uuidv4(), text: input, completed: false }]);
    setInput("");
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTodo();
    if (e.key === "Escape") setInput("");
  };


  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };


  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };


  const saveEdit = (id: string) => {
    if (!editText.trim()) return;
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText("");
  };


  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(search.toLowerCase())
  );

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <main className="relative min-h-screen w-full flex items-start justify-center pt-16 md:pt-24">
    <div className="w-[95%] md:w-[60%] font-Noto bg-[#57534d] p-4 sm:p-6 rounded-xl flex flex-col items-center relative max-h-[80vh] overflow-y-auto">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 flex items-center justify-between w-full max-w-xl">
        Advanced ToDo List
        {/* Help Button  */}
        <button
          onClick={() => setShowHelp(true)}
          className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-lg backdrop-blur-md transition"
        >
          Details
        </button>
      </h1>

      {/* Search Bar */}
      <div className="w-full max-w-xl flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring focus:ring-gray-800"
        />
      </div>

      {/* Input Section */}
      <div className="w-full max-w-xl flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} 
          className="flex-1 px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring focus:ring-gray-800"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 rounded-xl bg-gray-800 text-white font-semibold"
        >
          Add
        </button>
      </div>

      {/* Task Counter */}
      <div className="text-gray-200 mb-4 text-sm">
        Total: {todos.length} | Completed: {completedCount} | Remaining: {todos.length - completedCount}
      </div>

      {/* Todo List */}
      <div className="w-full max-w-xl flex flex-col">
        {filteredTodos.length === 0 && (
          <p className="text-gray-400 text-center mt-6">No tasks found.</p>
        )}
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            completed={todo.completed}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={startEditing}
            isEditing={editingId === todo.id}
            editText={editText}
            setEditText={setEditText}
            saveEdit={saveEdit}
          />
        ))}
      </div>

      {/*  Popup Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 m-auto p-5 flex items-center justify-center z-50">
          <div className="bg-white backdrop-blur-lg rounded-2xl p-6 max-w-md text-gray-900 shadow-2xl animate-in fade-in zoom-in">
            <h2 className="text-2xl font-bold mb-3">How to Use the ToDo List</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-800">
              <li>Type your task and press <b>Enter</b> or click <b>Add</b> to save.</li>
              <li>Click the checkbox to mark as <b>Completed</b>.</li>
              <li>Double-click a task to <b>Edit</b> it.</li>
              <li>Press <b>Delete</b> to remove a task.</li>
              <li>Use the <b>Search bar</b> to filter your tasks instantly.</li>
            </ul>
            <div className="text-right mt-5">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 text-white py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </main>
  );
}












