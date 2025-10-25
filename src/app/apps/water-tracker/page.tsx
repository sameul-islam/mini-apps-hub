"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import ProgressRing from "./components/ProgressRing";
import QuickAdd from "./components/QuickAdd";
import IntakeList from "./components/IntakeList";
import SettingsPanel from "./components/SettingsPanel";
import HydrationChart from "./components/HydrationChart";
import { format, startOfDay, isSameDay, addDays, parseISO } from "date-fns";

type Intake = {
  id: string;
  amount: number; // ml
  timestamp: string; // ISO
};

const STORAGE_KEY = "wt_intakes_v1";
const SETTINGS_KEY = "wt_settings_v1";

export default function WaterTrackerPage() {
  // state
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [dailyGoalMl, setDailyGoalMl] = useState<number>(2000); // default 2000 ml
  const [cupSizes, setCupSizes] = useState<number[]>([250, 300, 500]); // quick add buttons (ml)
  const [reminderEnabled, setReminderEnabled] = useState<boolean>(false);
  const [reminderIntervalMin, setReminderIntervalMin] = useState<number>(60);
  const reminderTimerRef = useRef<number | null>(null);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Intake[] = JSON.parse(stored).map((it: any) => ({
          ...it,
          timestamp: it.timestamp,
        }));
        setIntakes(parsed);
      }
      const s = localStorage.getItem(SETTINGS_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        if (parsed.dailyGoalMl) setDailyGoalMl(parsed.dailyGoalMl);
        if (parsed.cupSizes) setCupSizes(parsed.cupSizes);
        if (typeof parsed.reminderEnabled === "boolean") setReminderEnabled(parsed.reminderEnabled);
        if (parsed.reminderIntervalMin) setReminderIntervalMin(parsed.reminderIntervalMin);
      }
    } catch (e) {
      console.error("Failed to load water tracker state", e);
    }
  }, []);

  // persist settings & intakes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(intakes));
  }, [intakes]);

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify({ dailyGoalMl, cupSizes, reminderEnabled, reminderIntervalMin })
    );
  }, [dailyGoalMl, cupSizes, reminderEnabled, reminderIntervalMin]);

  // daily reset logic: keep history but compute by day
  const todayIntakes = useMemo(() => {
    const start = startOfDay(new Date());
    return intakes.filter((it) => isSameDay(start, parseISO(it.timestamp)));
  }, [intakes]);

  const totalToday = useMemo(() => todayIntakes.reduce((s, i) => s + i.amount, 0), [todayIntakes]);

  const progress = Math.min(1, totalToday / dailyGoalMl);

  // streaks: compute consecutive days with at least goal reached
  const streak = useMemo(() => {
    // build a map of dateStr -> total
    const map = new Map<string, number>();
    for (const it of intakes) {
      const d = format(parseISO(it.timestamp), "yyyy-MM-dd");
      map.set(d, (map.get(d) || 0) + it.amount);
    }
    // check back from today
    let c = 0;
    let day = new Date();
    while (true) {
      const key = format(day, "yyyy-MM-dd");
      if ((map.get(key) || 0) >= dailyGoalMl) {
        c++;
        day = addDays(day, -1);
      } else break;
    }
    return c;
  }, [intakes, dailyGoalMl]);

  // reminders: only while app open — request permission and use vibration + notification when triggered
  useEffect(() => {
    // clear previous
    if (reminderTimerRef.current) {
      window.clearInterval(reminderTimerRef.current);
      reminderTimerRef.current = null;
    }

    if (reminderEnabled) {
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().catch(() => {});
      }

      reminderTimerRef.current = window.setInterval(() => {
        // show notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("Hydration Reminder", {
            body: `Time to drink water — every ${reminderIntervalMin} min`,
          });
        }
        if (navigator.vibrate) navigator.vibrate(300);
      }, reminderIntervalMin * 60 * 1000);
    }

    return () => {
      if (reminderTimerRef.current) {
        window.clearInterval(reminderTimerRef.current);
        reminderTimerRef.current = null;
      }
    };
  }, [reminderEnabled, reminderIntervalMin]);

  // helper: add intake
  const addIntake = (amountMl: number) => {
    if (!amountMl || amountMl <= 0) return;
    const item: Intake = { id: crypto.randomUUID(), amount: Math.round(amountMl), timestamp: new Date().toISOString() };
    setIntakes((prev) => [item, ...prev]);
  };

  // helper: remove
  const deleteIntake = (id: string) => setIntakes((prev) => prev.filter((p) => p.id !== id));

  // quick export CSV
  const exportCSV = () => {
    const headers = ["timestamp", "amount_ml"];
    const rows = intakes.map((it) => [it.timestamp, it.amount]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `water_intake_${format(new Date(), "yyyyMMdd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // share summary
  const shareSummary = async () => {
    const text = `Today: ${totalToday} ml / ${dailyGoalMl} ml (${Math.round(progress * 100)}%). Streak: ${streak} days.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Hydration Summary", text });
      } catch (e) {
        // ignore
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Summary copied to clipboard.");
    }
  };

  // update cup sizes
  const updateCupSizes = (sizes: number[]) => {
    setCupSizes(sizes.slice(0, 5).map((s) => Math.max(10, Math.round(s))));
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 font-Noto bg-black/50 flex items-center justify-center">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: main card */}
        <div className="md:col-span-2 bg-[#102028] rounded-2xl p-6 shadow-lg flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Hydration — Water Tracker</h1>
              <p className="text-sm text-slate-300">Track daily water, set reminders & view history</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportCSV} className="px-3 py-2 bg-white/5 text-white rounded-lg">Export CSV</button>
              <button onClick={shareSummary} className="px-3 py-2 bg-white/5 text-white rounded-lg">Share</button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6">
            <ProgressRing size={160} stroke={12} progress={progress} label={`${Math.round(progress * 100)}%`} />
            <div className="flex-1">
              <div className="flex items-baseline gap-4">
                <h2 className="text-xl text-white font-semibold">{totalToday} ml</h2>
                <p className="text-sm text-slate-300">of {dailyGoalMl} ml</p>
                <p className="ml-auto text-sm text-slate-300">Streak: <span className="font-bold text-white">{streak}d</span></p>
              </div>

              <div className="mt-4">
                <QuickAdd sizes={cupSizes} onAdd={addIntake} onCustom={(v) => addIntake(v)} />
              </div>

              <div className="mt-4">
                <div className="text-sm text-slate-300 mb-2">Quick Controls</div>
                <div className="flex gap-2">
                  <button onClick={() => addIntake(100)} className="px-3 py-2 rounded-lg bg-white/5 text-white">+100 ml</button>
                  <button onClick={() => addIntake(250)} className="px-3 py-2 rounded-lg bg-white/5 text-white">+250 ml</button>
                  <button onClick={() => addIntake(500)} className="px-3 py-2 rounded-lg bg-white/5 text-white">+500 ml</button>
                  <button onClick={() => setIntakes([])} className="ml-auto px-3 py-2 rounded-lg bg-red-600 text-black">Clear All</button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Today&apos;s Intake</h3>
            <IntakeList items={todayIntakes} onDelete={deleteIntake} />
          </div>
        </div>

        {/* Right: sidebar: settings & chart */}
        <div className="bg-[#0f1720] rounded-2xl p-6 shadow-lg flex flex-col gap-6">
          <SettingsPanel
            dailyGoalMl={dailyGoalMl}
            setDailyGoalMl={setDailyGoalMl}
            cupSizes={cupSizes}
            setCupSizes={updateCupSizes}
            reminderEnabled={reminderEnabled}
            setReminderEnabled={setReminderEnabled}
            reminderIntervalMin={reminderIntervalMin}
            setReminderIntervalMin={setReminderIntervalMin}
          />

          <div>
            <h4 className="text-white font-semibold mb-2">Weekly Overview</h4>
            <HydrationChart intakes={intakes} goalMl={dailyGoalMl} />
          </div>
        </div>
      </div>
    </main>
  );
}
