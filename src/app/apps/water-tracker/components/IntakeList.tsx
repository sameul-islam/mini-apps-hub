"use client";

interface Intake {
  id: string;
  amount: number;
  timestamp: string;
}

export default function IntakeList({ items, onDelete }: { items: Intake[]; onDelete: (id: string) => void }) {
  if (items.length === 0) return <p className="text-slate-400">No intake yet.</p>;
  return (
    <ul className="flex flex-col gap-2 max-h-52 overflow-auto">
      {items.map((it) => (
        <li key={it.id} className="flex justify-between items-center bg-white/5 p-2 rounded-lg">
          <div>
            <div className="text-white font-semibold">{it.amount} ml</div>
            <div className="text-slate-300 text-sm">{new Date(it.timestamp).toLocaleTimeString()}</div>
          </div>
          <div className="flex gap-2 items-center">
            <button onClick={() => navigator.clipboard.writeText(`${it.amount} ml at ${new Date(it.timestamp).toLocaleTimeString()}`)} className="px-2 py-1 bg-white/5 rounded">Copy</button>
            <button onClick={() => onDelete(it.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
