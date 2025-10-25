"use client";

import { FC } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Transaction } from "../types";

interface Props {
  transactions: Transaction[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

const ExpenseChart: FC<Props> = ({ transactions }) => {
  const expenseData = transactions
    .filter(t => t.type === "expense")
    .reduce((acc: {name: string, value: number}[], curr) => {
      const existing = acc.find(a => a.name === curr.category);
      if (existing) existing.value += curr.amount;
      else acc.push({name: curr.category, value: curr.amount});
      return acc;
    }, []);

  if (expenseData.length === 0) return <p className="text-white text-center mt-4">No expenses to display.</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={80} fill="#8884d8" label>
          {expenseData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpenseChart;
