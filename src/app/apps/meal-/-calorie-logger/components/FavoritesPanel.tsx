"use client";
import { FoodItem } from "../page";

type Props = {
  favs: FoodItem[];
  onRemove: (id: string) => void;
  onInsert: (food: FoodItem) => void;
};

export default function FavoritesPanel({ favs, onRemove, onInsert }: Props) {
  if (!favs.length) return <div className="text-slate-400">No favorites yet</div>;

  return (
    <div className="bg-white/5 p-3 rounded-lg">
      <div className="text-slate-300 text-sm mb-2 font-semibold">Favorites</div>
      <div className="flex flex-col gap-2">
        {favs.map(f => (
          <div key={f.id} className="flex justify-between items-center p-2 bg-white/10 rounded">
            <div>
              <div className="text-white font-semibold">{f.name}</div>
              <div className="text-slate-300 text-sm">{f.calories} kcal</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onInsert(f)} className="px-2 py-1 bg-green-500 rounded text-black font-bold">Add</button>
              <button onClick={() => onRemove(f.id)} className="px-2 py-1 bg-red-600 rounded text-black font-bold">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
