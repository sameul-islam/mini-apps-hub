"use client";

import { FC } from "react";
import { Expense, Participant } from "../types";

interface Props {
  expenses: Expense[];
  participants: Participant[];
  deleteExpense: (id: string) => void;
}

const ExpenseList: FC<Props> = ({ expenses, participants, deleteExpense }) => {
  const getParticipantName = (id: string) => participants.find(p => p.id === id)?.name || "";

  return (
    <div className="flex flex-col gap-2 max-h-64 overflow-auto mt-2">
      {expenses.map(e => (
        <div key={e.id} className="flex justify-between items-center p-2 bg-white/10 rounded-xl text-white">
          <div>
            <p>{e.description}</p>
            <p className="text-gray-300">{getParticipantName(e.participantId)}: ${e.amount}</p>
          </div>
          <button onClick={() => deleteExpense(e.id)} className="text-red-500 font-bold">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
