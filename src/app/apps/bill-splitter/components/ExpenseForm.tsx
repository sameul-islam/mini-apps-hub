"use client";

import { FC, useState } from "react";
import { Expense, Participant } from "../types";
import { v4 as uuidv4 } from "uuid";

interface Props {
  participants: Participant[];
  addExpense: (e: Expense) => void;
}

const ExpenseForm: FC<Props> = ({ participants, addExpense }) => {
  const [participantId, setParticipantId] = useState(participants[0]?.id || "");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantId || !description || !amount) return;
    addExpense({ id: uuidv4(), participantId, description, amount: Number(amount) });
    setDescription("");
    setAmount("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-4">
      <select
        value={participantId}
        onChange={(e) => setParticipantId(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white text-black"
      >
        {participants.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>
      <input
        type="text"
        placeholder="Expense Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white/10 text-white"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="px-3 py-2 rounded-lg bg-white/10 text-white"
      />
      <button type="submit" className="bg-green-500 text-black py-2 rounded-lg font-bold hover:bg-green-600 transition">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
