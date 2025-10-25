"use client";

import { Meal } from "../page";
import { format, addDays, subDays } from "date-fns";

export default function HistoryPanel({ meals, selectedDate, setSelectedDate }: { meals: Meal[]; selectedDate: string; setSelectedDate: (d: string) => void }) {
  const dayMeals = meals.filter(m => m.date === selectedDate);

  const prevDay = () => setSelectedDate(format(subDays(new Date(selectedDate), 1), "yyyy-MM-dd"));
  const nextDay = () => setSelectedDate(format(addDays(new Date(selectedDate), 1), "yyyy-MM-dd"));

  return (
    <div className="bg-white/5 p-3 rounded">
      <div className="flex justify-between items-center mb-2">
        <button onClick={prevDay} className="px-2 py-1 bg-blue-500 rounded text-black">Prev</button>
        <div className="text-white font-semibold">{format(new Date(selectedDate), "MMM dd, yyyy")}</div>
        <button onClick={nextDay} className="px-2 py-1 bg-blue-500 rounded text-black">Next</button>
      </div>

      {dayMeals.length === 0 && <div className="text-slate-400 text-sm">No meals logged for this day.</div>}

      {dayMeals.map(m => (
        <div key={m.id} className="bg-white/10 p-2 rounded mb-2">
          <div className="text-white font-semibold">{m.name}</div>
          <div className="text-slate-300 text-sm">{m.foods.length} items</div>
          <ul className="text-slate-300 text-xs mt-1">
            {m.foods.map(f => (
              <li key={f.id}>
                {f.name} — {f.amount}{f.unit} — {f.calories} kcal — P:{f.protein} C:{f.carbs} F:{f.fat}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
