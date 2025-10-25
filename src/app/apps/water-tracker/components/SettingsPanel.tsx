"use client";

import { useState } from "react";

interface Props {
  dailyGoalMl: number;
  setDailyGoalMl: (n: number) => void;
  cupSizes: number[];
  setCupSizes: (arr: number[]) => void;
  reminderEnabled: boolean;
  setReminderEnabled: (b: boolean) => void;
  reminderIntervalMin: number;
  setReminderIntervalMin: (m: number) => void;
}

export default function SettingsPanel({
  dailyGoalMl,
  setDailyGoalMl,
  cupSizes,
  setCupSizes,
  reminderEnabled,
  setReminderEnabled,
  reminderIntervalMin,
  setReminderIntervalMin,
}: Props) {
  const [localGoal, setLocalGoal] = useState<number>(dailyGoalMl);
  const [localSizes, setLocalSizes] = useState<string>(cupSizes.join(","));

  return (
    <div className="flex flex-col gap-3">
      <div>
        <label className="text-slate-300 text-sm">Daily Goal (ml)</label>
        <div className="flex gap-2 mt-1">
          <input value={localGoal} onChange={(e) => setLocalGoal(Number(e.target.value))} type="number" className="px-3 py-2 rounded bg-white/10 text-white flex-1" />
          <button onClick={() => setDailyGoalMl(Math.max(100, Math.round(localGoal)))} className="px-3 py-2 bg-green-500 rounded text-black">Set</button>
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm">Quick cup sizes (comma separated ml)</label>
        <div className="flex gap-2 mt-1">
          <input value={localSizes} onChange={(e) => setLocalSizes(e.target.value)} className="px-3 py-2 rounded bg-white/10 text-white flex-1" />
          <button onClick={() => setCupSizes(localSizes.split(",").map(s => Number(s.trim())).filter(Boolean))} className="px-3 py-2 bg-green-500 rounded text-black">Save</button>
        </div>
      </div>

      <div>
        <label className="text-slate-300 text-sm">Reminders</label>
        <div className="flex gap-2 mt-1 items-center">
          <input type="checkbox" checked={reminderEnabled} onChange={(e) => setReminderEnabled(e.target.checked)} />
          <span className="text-slate-300">Enable reminders</span>
        </div>
        <div className="flex gap-2 mt-2">
          <input type="number" min={5} value={reminderIntervalMin} onChange={(e) => setReminderIntervalMin(Math.max(5, Number(e.target.value)))} className="px-3 py-2 rounded bg-white/10 text-white flex-1" />
          <span className="text-slate-300 px-2 py-2">minutes</span>
        </div>
      </div>
    </div>
  );
}
