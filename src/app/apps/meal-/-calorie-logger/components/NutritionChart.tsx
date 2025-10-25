"use client";
import { Meal } from "../page";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type Props = {
  meals: Meal[];
};

export default function NutritionChart({ meals }: Props) {
  // total macros
  const totals = meals.reduce((acc, m) => {
    for (const f of m.foods) {
      acc.calories += f.calories || 0;
      acc.protein += f.protein || 0;
      acc.carbs += f.carbs || 0;
      acc.fat += f.fat || 0;
    }
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const pieData = [
    { name: "Protein", value: totals.protein },
    { name: "Carbs", value: totals.carbs },
    { name: "Fat", value: totals.fat }
  ];

  const COLORS = ["#10b981","#38bdf8","#f59e0b"];

  return (
    <div className="bg-white/5 p-3 rounded-lg">
      <div className="text-slate-300 text-sm mb-2 font-semibold">Macro Distribution</div>
      <div style={{ height: 220 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
              {pieData.map((d, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 text-slate-300 text-sm">Total calories: {totals.calories} kcal</div>
    </div>
  );
}
