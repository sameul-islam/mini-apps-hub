"use client";

import { FC } from "react";
import { BudgetItem } from "../types";

interface Props {
  items: BudgetItem[];
  savingsGoal: number;
}

const BudgetSummary: FC<Props> = ({ items, savingsGoal }) => {
  const totalIncome = items.filter(i => i.type === "income").reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = items.filter(i => i.type === "expense").reduce((sum, i) => sum + i.amount, 0);
  const balance = totalIncome - totalExpense;

  const savingsWarning = balance < savingsGoal ? "⚠️ Below savings goal!" : "";

  return (
    <div className="flex flex-col gap-2 text-white font-semibold text-lg bg-white/10 p-3 rounded-xl">
      <div className="flex justify-around">
        <p>Income: ${totalIncome}</p>
        <p>Expense: ${totalExpense}</p>
        <p>Balance: ${balance}</p>
      </div>
      {savingsGoal > 0 && <p className="text-yellow-400 text-center">{savingsWarning}</p>}
    </div>
  );
};

export default BudgetSummary;
