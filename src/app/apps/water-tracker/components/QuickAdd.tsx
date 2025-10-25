"use client";

import { useState } from "react";

interface Props {
  sizes: number[]; // ml
  onAdd: (ml: number) => void;
  onCustom?: (ml: number) => void;
}

export default function QuickAdd({ sizes, onAdd, onCustom }: Props) {
  const [custom, setCustom] = useState<number | "">("");

  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {sizes.map((s, idx) => (
          <button key={idx} onClick={() => onAdd(s)} className="px-3 py-2 bg-white/5 rounded-lg text-white">
            +{s} ml
          </button>
        ))}
        <button onClick={() => onAdd(50)} className="px-3 py-2 bg-white/5 rounded-lg text-white">+50 ml</button>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="number"
          placeholder="Custom ml"
          value={custom === "" ? "" : custom}
          onChange={(e) => {
            const v = e.target.value;
            setCustom(v === "" ? "" : Math.max(0, Number(v)));
          }}
          className="px-3 py-2 rounded-lg bg-white/10 text-white w-32"
        />
        <button
          onClick={() => {
            if (custom === "" || custom <= 0) return;
            if (onCustom) onCustom(custom as number);
            setCustom("");
          }}
          className="px-3 py-2 rounded-lg bg-green-500 text-black"
        >
          Add
        </button>
      </div>
    </div>
  );
}
