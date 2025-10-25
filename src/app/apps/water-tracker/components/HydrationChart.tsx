"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { startOfDay, addDays, format, parseISO } from "date-fns";

type Intake = { id: string; amount: number; timestamp: string };

export default function HydrationChart({ intakes, goalMl }: { intakes: Intake[]; goalMl: number }) {
  // build last 7 days totals
  const data = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const day = addDays(startOfDay(new Date()), -i);
      const key = format(day, "yyyy-MM-dd");
      const total = intakes
        .filter((it) => format(parseISO(it.timestamp), "yyyy-MM-dd") === key)
        .reduce((s, it) => s + it.amount, 0);
      days.push({ name: format(day, "EEE"), total, goal: goalMl });
    }
    return days;
  }, [intakes, goalMl]);

  return (
    <div style={{ height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip />
          <Bar dataKey="total" fill="#06b6d4" />
          <Bar dataKey="goal" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
