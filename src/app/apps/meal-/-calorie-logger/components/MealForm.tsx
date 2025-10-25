"use client";

import { useState } from "react";
import { v4 as uuid } from "uuid";
import { FoodItem } from "../page";

type Props = {
  favorites: FoodItem[];
  addFavorite: (food: FoodItem) => void;
  onAddMeal: (name: string, foods: FoodItem[]) => void;
};

export default function MealForm({ favorites, addFavorite, onAddMeal }: Props) {
  const [mealName, setMealName] = useState("Breakfast");
  const [selectedFoods, setSelectedFoods] = useState<FoodItem[]>([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);

  // Local minimal DB
  const localDB: FoodItem[] = [
    { id: "f1", name: "Apple (100g)", calories: 52, protein: 0.3, carbs: 14, fat: 0.2, amount: 100, unit: "g" },
    { id: "f2", name: "Rice (100g cooked)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3, amount: 100, unit: "g" },
    { id: "f3", name: "Chicken breast (100g)", calories: 165, protein: 31, carbs: 0, fat: 3.6, amount: 100, unit: "g" }
  ];

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) return setSearchResults([]);
    const results = localDB.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
    setSearchResults(results);
  };

  const addFoodFromResult = (f: FoodItem) => {
    const clone = { ...f, id: uuid() };
    setSelectedFoods(prev => [clone, ...prev]);
    setQuery("");
    setSearchResults([]);
  };

  const addManualFood = () => {
    const name = prompt("Food name") || "Custom";
    const amount = Number(prompt("Amount") || "100");
    const unit = prompt("Unit (g/ml/serving)") || "g";
    const calories = Number(prompt("Calories") || "0");
    const protein = Number(prompt("Protein (g)") || "0");
    const carbs = Number(prompt("Carbs (g)") || "0");
    const fat = Number(prompt("Fat (g)") || "0");

    const item: FoodItem = { id: uuid(), name, amount, unit, calories, protein, carbs, fat };
    setSelectedFoods(prev => [item, ...prev]);
  };

  const removeFood = (id: string) => setSelectedFoods(prev => prev.filter(f => f.id !== id));

  const addToFavorites = (f: FoodItem) => {
    addFavorite({ ...f, id: uuid() });
    alert("Added to favorites!");
  };

  const saveMeal = () => {
    if (!selectedFoods.length) return alert("Add at least one food item");
    onAddMeal(mealName, selectedFoods);
    setSelectedFoods([]);
    alert("Meal saved successfully!");
  };

  return (
    <div className="bg-white/5 p-4 rounded-lg mb-6">
      {/* Meal type and search */}
      <div className="flex flex-col lg:flex-row gap-2 items-center mb-3">
        <select value={mealName} onChange={(e) => setMealName(e.target.value)} className="px-3 py-2 rounded bg-[#00d5be] text-black">
          <option>Breakfast</option>
          <option>Lunch</option>
          <option>Dinner</option>
          <option>Snack</option>
          <option>Custom</option>
        </select>

        <input
          placeholder="Search food (local DB)"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 px-3 py-2 rounded bg-white/10 text-white"
        />

        <button onClick={addManualFood} className="px-3 py-2 bg-green-500 rounded text-black font-bold">
          Add Manual
        </button>
      </div>

      {/* Search results */}
      {searchResults.length > 0 && (
        <div className="mb-3">
          <div className="text-sm text-slate-300 mb-1">Search Results</div>
          <div className="flex flex-col gap-2">
            {searchResults.map(f => (
              <div key={f.id} className="flex justify-between p-2 rounded bg-white/10">
                <div>
                  <div className="text-white font-semibold">{f.name}</div>
                  <div className="text-slate-300 text-sm">{f.calories} kcal per {f.amount}{f.unit}</div>
                </div>
                <button onClick={() => addFoodFromResult(f)} className="px-2 py-1 bg-blue-500 rounded text-black font-bold">
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected foods */}
      <div className="mb-3">
        <div className="text-sm text-slate-300 mb-1">Selected Foods</div>
        <div className="flex flex-col gap-2">
          {selectedFoods.length === 0 && <div className="text-slate-400 text-sm">No foods selected</div>}
          {selectedFoods.map(f => (
            <div key={f.id} className="flex justify-between items-center p-2 bg-white/10 rounded">
              <div>
                <div className="text-white font-semibold">{f.name}</div>
                <div className="text-slate-300 text-sm">
                  {f.amount}{f.unit} — {f.calories} kcal — P:{f.protein} C:{f.carbs} F:{f.fat}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addToFavorites(f)} className="px-2 py-1 bg-yellow-400 rounded text-black font-bold">Fav</button>
                <button onClick={() => removeFood(f.id)} className="px-2 py-1 bg-red-500 rounded text-black font-bold">Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={saveMeal} className="px-4 py-2 bg-green-500 rounded text-black font-bold w-full">Save Meal</button>
    </div>
  );
}
