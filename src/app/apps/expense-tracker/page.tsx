"use client";

import { useState, useEffect } from "react";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import ExpenseChart from "./components/ExpenseChart";
import { Transaction } from "./types";

export default function page() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([transaction, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 font-Noto">
      <div className="w-full md:w-[60%] bg-[#292524] rounded-xl p-4 sm:p-6 flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl text-white font-bold text-center">Expense Tracker</h1>
        
        <div className="flex justify-around text-white font-semibold text-lg">
          <p>Income: ${totalIncome}</p>
          <p>Expense: ${totalExpense}</p>
          <p>Balance: ${totalIncome - totalExpense}</p>
        </div>

        <TransactionForm addTransaction={addTransaction} />
        <TransactionList transactions={transactions} deleteTransaction={deleteTransaction} />
        <ExpenseChart transactions={transactions} />
      </div>
    </main>
  );
}
