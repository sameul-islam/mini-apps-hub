"use client";

import { Meal, FoodItem } from "../page";

type Props = {
  meals: Meal[];
  onUpdate: (id: string, partial: Partial<Meal>) => void;
  onDelete: (id: string) => void;
  onAddFavorite: (food: FoodItem) => void;
};

export default function MealList({ meals, onUpdate, onDelete, onAddFavorite }: Props) {
  if (!meals.length) return <div className="text-slate-400">No meals for this date.</div>;

  return (
    <div className="flex flex-col gap-4">
      {meals.map(m => (
        <div key={m.id} className="bg-white/5 p-3 rounded-lg">
          {/* Meal header */}
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="text-white font-semibold text-lg">{m.name}</div>
              <div className="text-slate-300 text-sm">{m.foods.length} items</div>
            </div>
            <button onClick={() => onDelete(m.id)} className="px-3 py-1 bg-red-600 rounded text-black font-bold">Delete</button>
          </div>

          {/* Foods */}
          <div className="flex flex-col gap-2">
            {m.foods.map(f => (
              <div key={f.id} className="flex justify-between items-center p-2 bg-white/10 rounded">
                <div>
                  <div className="text-white font-semibold">{f.name}</div>
                  <div className="text-slate-300 text-sm">
                    {f.amount}{f.unit} — {f.calories} kcal — P:{f.protein} C:{f.carbs} F:{f.fat}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onAddFavorite(f)} className="px-2 py-1 bg-yellow-400 rounded text-black font-bold">Fav</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
