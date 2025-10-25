"use client";

import { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { startOfDay, formatISO } from "date-fns";

import MealForm from "./components/MealForm";
import MealList from "./components/MealList";
import SummaryPanel from "./components/SummaryPanel";
import NutritionChart from "./components/NutritionChart";
import SettingsPanel from "./components/SettingsPanel";
import FavoritesPanel from "./components/FavoritesPanel";

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amount: number;
  unit: string;
  image?: string;
};

export type Meal = {
  id: string;
  name: string;
  date: string;
  foods: FoodItem[];
};

type Macro = { calories: number; protein: number; carbs: number; fat: number };

const STORAGE_KEY = "ml_meals_v1";
const FAVOR_KEY = "ml_favs_v1";
const SETTINGS_KEY = "ml_settings_v1";

export default function MealLoggerPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [favorites, setFavorites] = useState<FoodItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(formatISO(startOfDay(new Date())));
  const [dailyGoal, setDailyGoal] = useState<number>(2000);
  const [macroGoals, setMacroGoals] = useState<Macro>({ calories: 2000, protein: 50, carbs: 275, fat: 70 });

  // Load from localStorage (offline fallback)
  useEffect(() => {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) setMeals(JSON.parse(s));
    const f = localStorage.getItem(FAVOR_KEY);
    if (f) setFavorites(JSON.parse(f));
    const setts = localStorage.getItem(SETTINGS_KEY);
    if (setts) {
      const p = JSON.parse(setts);
      if (p.dailyGoal) setDailyGoal(p.dailyGoal);
      if (p.macroGoals) setMacroGoals(p.macroGoals);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(meals)), [meals]);
  useEffect(() => localStorage.setItem(FAVOR_KEY, JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem(SETTINGS_KEY, JSON.stringify({ dailyGoal, macroGoals })), [dailyGoal, macroGoals]);

  // Meals for selected date
  const todaysMeals = useMemo(() => meals.filter(m => m.date === selectedDate), [meals, selectedDate]);

  // Totals for today
  const totals = useMemo(() => {
    const t = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    for (const m of todaysMeals) {
      for (const f of m.foods) {
        t.calories += f.calories;
        t.protein += f.protein;
        t.carbs += f.carbs;
        t.fat += f.fat;
      }
    }
    return t;
  }, [todaysMeals]);

  // Add Meal
  const addMeal = (name: string, foods: FoodItem[]) => {
    const meal: Meal = { id: uuid(), name, date: selectedDate, foods };
    setMeals(prev => [meal, ...prev]);
  };

  // Update Meal
  const updateMeal = (id: string, partial: Partial<Meal>) => {
    setMeals(prev => prev.map(m => (m.id === id ? { ...m, ...partial } : m)));
  };

  // Delete Meal
  const deleteMeal = (id: string) => setMeals(prev => prev.filter(m => m.id !== id));

  // Favorites
  const addFavorite = (food: FoodItem) => setFavorites(prev => [food, ...prev]);
  const removeFavorite = (id: string) => setFavorites(prev => prev.filter(f => f.id !== id));

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-black/60 font-sans flex justify-center">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#12202a] p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Meal & Calorie Logger</h1>
            <input type="date" value={selectedDate.slice(0,10)} onChange={e => setSelectedDate(formatISO(new Date(e.target.value)))} className="px-3 py-2 rounded bg-white/10 text-white"/>
          </div>

          <MealForm favorites={favorites} addFavorite={addFavorite} onAddMeal={addMeal} />
          <div className="mt-6">
            <MealList meals={todaysMeals} onUpdate={updateMeal} onDelete={deleteMeal} onAddFavorite={addFavorite} />
          </div>
        </div>

        <aside className="bg-[#071623] p-6 rounded-2xl flex flex-col gap-4">
          <SummaryPanel totals={totals} goals={{ dailyGoal, macroGoals }} setGoals={(g)=> { setDailyGoal(g.dailyGoal); setMacroGoals(g.macroGoals); }}/>
          <NutritionChart meals={todaysMeals}/>
          <FavoritesPanel favs={favorites} onRemove={removeFavorite} onInsert={(food)=> addMeal("Custom", [food])}/>
          <SettingsPanel dailyGoal={dailyGoal} setDailyGoal={setDailyGoal} macroGoals={macroGoals} setMacroGoals={(g) => setMacroGoals(prev => ({ ...prev, protein: g.protein, carbs: g.carbs, fat: g.fat }))}/>
        </aside>
      </div>
    </main>
  );
}
