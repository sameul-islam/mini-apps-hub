"use client";

import { FC, useState } from "react";
import { Transaction } from "../types";
import { v4 as uuidv4 } from "uuid";

interface Props {
  addTransaction: (transaction: Transaction) => void;
}

const categories = ["Food", "Transport", "Bills", "Entertainment", "Other"];

const TransactionForm: FC<Props> = ({ addTransaction }) => {
  const [type, setType] = useState<"income" | "expense">("income");
  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    addTransaction({
      id: uuidv4(),
      type,
      category,
      amount: Number(amount),
      description,
    });
    setAmount("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 bg-white/10 rounded-xl backdrop-blur-md">
      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "income" | "expense")}
          className="flex-1 px-3 py-2 rounded-lg bg-[#99A3A4] text-black"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg bg-[#99A3A4] text-black"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white/5 text-white"
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white/5 text-white"
      />

      <button type="submit" className="bg-green-500 text-black py-2 rounded-lg font-bold hover:bg-green-600 transition">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
