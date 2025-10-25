"use client";
import { useState } from "react";

type Props = {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  macroGoals: { protein: number; carbs: number; fat: number };
  setMacroGoals: (goals: { protein: number; carbs: number; fat: number }) => void;
};

export default function SettingsPanel({ dailyGoal, setDailyGoal, macroGoals, setMacroGoals }: Props) {
  const [localGoal, setLocalGoal] = useState(dailyGoal);
  const [localMacro, setLocalMacro] = useState(macroGoals);

  const save = () => {
    setDailyGoal(Number(localGoal));
    setMacroGoals({
      protein: Number(localMacro.protein),
      carbs: Number(localMacro.carbs),
      fat: Number(localMacro.fat)
    });
    alert("Settings saved!");
  };

  return (
    <div className="bg-white/5 p-3 rounded-lg">
      <div className="text-slate-300 text-sm mb-2 font-semibold">Settings</div>
      <div className="flex flex-col gap-3">
        <div>
          <label className="text-slate-300 text-sm">Daily calories goal</label>
          <input type="number" value={localGoal} onChange={e => setLocalGoal(Number(e.target.value))} className="w-full px-2 py-1 rounded bg-white/10 text-white"/>
        </div>

        <div>
          <label className="text-slate-300 text-sm">Macro goals (grams)</label>
          <div className="flex flex-col gap-2 mt-1">
            <input type="number" value={localMacro.protein} onChange={e => setLocalMacro({...localMacro, protein: Number(e.target.value)})} className="px-2 py-1 rounded bg-white/10 text-white" placeholder="Protein"/>
            <input type="number" value={localMacro.carbs} onChange={e => setLocalMacro({...localMacro, carbs: Number(e.target.value)})} className="px-2 py-1 rounded bg-white/10 text-white" placeholder="Carbs"/>
            <input type="number" value={localMacro.fat} onChange={e => setLocalMacro({...localMacro, fat: Number(e.target.value)})} className="px-2 py-1 rounded bg-white/10 text-white" placeholder="Fat"/>
          </div>
        </div>

        <button onClick={save} className="px-3 py-2 bg-green-500 text-black rounded font-bold">Save Settings</button>
      </div>
    </div>
  );
}
