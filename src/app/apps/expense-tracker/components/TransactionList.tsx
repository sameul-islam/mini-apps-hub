"use client";

import { FC } from "react";
import { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
  deleteTransaction: (id: string) => void;
}

const TransactionList: FC<Props> = ({ transactions, deleteTransaction }) => {
  return (
    <div className="mt-4 flex flex-col gap-2 max-h-64 overflow-auto">
      {transactions.map((t) => (
        <div key={t.id} className="flex justify-between items-center p-3 bg-white/10 rounded-xl text-white">
          <div>
            <p>{t.description} - {t.category}</p>
            <p className={t.type === "income" ? "text-green-400" : "text-red-400"}>${t.amount}</p>
          </div>
          <button
            onClick={() => deleteTransaction(t.id)}
            className="text-red-500 font-bold"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
