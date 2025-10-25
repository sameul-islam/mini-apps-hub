"use client";

import { FC } from "react";
import { BudgetItem } from "../types";

interface Props {
  items: BudgetItem[];
  deleteItem: (id: string) => void;
}

const BudgetList: FC<Props> = ({ items, deleteItem }) => {
  return (
    <div className="mt-4 flex flex-col gap-2 max-h-64 overflow-auto">
      {items.map(item => (
        <div key={item.id} className="flex justify-between p-3 bg-white/10 rounded-xl text-white">
          <div>
            <p>{item.description} - {item.category}</p>
            <p className={item.type === "income" ? "text-green-400" : "text-red-400"}>${item.amount}</p>
          </div>
          <button onClick={() => deleteItem(item.id)} className="text-red-500 font-bold">Delete</button>
        </div>
      ))}
    </div>
  );
};

export default BudgetList;
