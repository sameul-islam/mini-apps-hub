"use client";

import { Meal } from "../page";

export default function ExportPanel({ meals, selectedDate }: { meals: Meal[]; selectedDate: string }) {
  const exportCSV = () => {
    const rows = [["date","meal","food","amount","unit","calories","protein","carbs","fat"]];
    meals
      .filter(m => m.date === selectedDate)
      .forEach(m => {
        m.foods.forEach(f => rows.push([m.date, m.name, f.name, String(f.amount), f.unit, String(f.calories), String(f.protein), String(f.carbs), String(f.fat)]));
      });

    const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `meals_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    alert("CSV exported!");
  };

  return (
    <div className="bg-white/5 p-3 rounded">
      <div className="text-slate-300 text-sm mb-2">Export</div>
      <button onClick={exportCSV} className="px-3 py-2 bg-green-500 text-black rounded w-full">Export CSV for this day</button>
    </div>
  );
}
