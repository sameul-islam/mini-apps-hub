"use client";

import { useMemo } from "react";

type MacroTotals = { calories: number; protein: number; carbs: number; fat: number };
type MacroGoals = { calories: number; protein: number; carbs: number; fat: number };

type Props = {
  totals: MacroTotals;
  goals: { dailyGoal: number; macroGoals: MacroGoals };
  setGoals: (g: { dailyGoal: number; macroGoals: MacroGoals }) => void;
};

export default function SummaryPanel({ totals, goals }: Props) {
  const percent = Math.min(100, Math.round((totals.calories / goals.dailyGoal) * 100));

  const macroPercent = useMemo(() => ({
    protein: goals.macroGoals.protein ? Math.round((totals.protein / goals.macroGoals.protein) * 100) : 0,
    carbs: goals.macroGoals.carbs ? Math.round((totals.carbs / goals.macroGoals.carbs) * 100) : 0,
    fat: goals.macroGoals.fat ? Math.round((totals.fat / goals.macroGoals.fat) * 100) : 0,
  }), [totals, goals]);

  return (
    <div className="bg-white/5 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-slate-300 text-sm">Calories</div>
          <div className="text-2xl font-bold text-white">{totals.calories} kcal</div>
          <div className="text-slate-400 text-sm">Goal: {goals.dailyGoal} kcal</div>
        </div>
        <div className="text-right">
          <div className="text-slate-300 text-sm">Progress</div>
          <div className="text-xl font-bold text-white">{percent}%</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-slate-300 text-sm mb-1">Macros</div>
        <div className="flex gap-2">
          <div className="flex-1 bg-white/6 p-2 rounded">
            <div className="text-slate-300 text-sm">Protein</div>
            <div className="font-bold text-white">{totals.protein} g</div>
            <div className="text-slate-400 text-xs">{macroPercent.protein}% of goal</div>
          </div>
          <div className="flex-1 bg-white/6 p-2 rounded">
            <div className="text-slate-300 text-sm">Carbs</div>
            <div className="font-bold text-white">{totals.carbs} g</div>
            <div className="text-slate-400 text-xs">{macroPercent.carbs}% of goal</div>
          </div>
          <div className="flex-1 bg-white/6 p-2 rounded">
            <div className="text-slate-300 text-sm">Fat</div>
            <div className="font-bold text-white">{totals.fat} g</div>
            <div className="text-slate-400 text-xs">{macroPercent.fat}% of goal</div>
          </div>
        </div>
      </div>

      {/* Quick tips */}
      <div className="bg-white/10 mt-3 p-3 rounded text-sm text-slate-300">
        {totals.calories > goals.dailyGoal && <div className="text-yellow-400">You are over your calorie goal — consider lighter meals.</div>}
        {totals.calories < goals.dailyGoal && <div className="text-green-400">You are under your calorie goal — add nutrient dense foods to meet target.</div>}
        {totals.calories === goals.dailyGoal && <div className="text-blue-400">You met your calorie goal perfectly!</div>}
      </div>
    </div>
  );
}
