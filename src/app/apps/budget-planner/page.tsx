"use client";

import { useState, useEffect } from "react";
import { BudgetItem } from "./types";
import BudgetForm from "./components/BudgetForm";
import BudgetList from "./components/BudgetList";
import BudgetSummary from "./components/BudgetSummary";
import BudgetChart from "./components/BudgetChart";
import SavingsGoal from "./components/SavingsGoal";

export default function page() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<number>(0);

  useEffect(() => {
    const storedItems = localStorage.getItem("budgetItems");
    if (storedItems) setItems(JSON.parse(storedItems));
    const storedGoal = localStorage.getItem("savingsGoal");
    if (storedGoal) setSavingsGoal(Number(storedGoal));
  }, []);

  useEffect(() => {
    localStorage.setItem("budgetItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("savingsGoal", savingsGoal.toString());
  }, [savingsGoal]);

  const addItem = (item: BudgetItem) => setItems([item, ...items]);
  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 font-Noto">
      <div className="w-full md:w-[60%] bg-[#292524] rounded-xl p-4 sm:p-6 flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl text-white font-bold text-center">Ultimate Budget Planner</h1>

        <SavingsGoal savingsGoal={savingsGoal} setSavingsGoal={setSavingsGoal} />
        <BudgetSummary items={items} savingsGoal={savingsGoal} />
        <BudgetForm addItem={addItem} />
        <BudgetList items={items} deleteItem={deleteItem} />
        <BudgetChart items={items} />
      </div>
    </main>
  );
}
