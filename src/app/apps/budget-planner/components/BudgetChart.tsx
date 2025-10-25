"use client";

import { FC } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { BudgetItem } from "../types";

interface Props {
  items: BudgetItem[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#FF5733", "#33FFBD"];

const BudgetChart: FC<Props> = ({ items }) => {
  const expenseData = items
    .filter(i => i.type === "expense")
    .reduce((acc: {name: string, value: number}[], curr) => {
      const exist = acc.find(a => a.name === curr.category);
      if (exist) exist.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []);

  const monthlyData = [
    { name: "Income", value: items.filter(i => i.type === "income").reduce((sum, i) => sum + i.amount, 0) },
    { name: "Expense", value: items.filter(i => i.type === "expense").reduce((sum, i) => sum + i.amount, 0) },
  ];

  return (
    <>
      <h3 className="text-white mt-4 mb-2 font-bold">Expense by Category</h3>
      {expenseData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={expenseData} dataKey="value" nameKey="name" outerRadius={80} label>
              {expenseData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-white text-center">No expenses to show.</p>
      )}

      <h3 className="text-white mt-4 mb-2 font-bold">Monthly Overview</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={monthlyData}>
          <XAxis dataKey="name" stroke="#fff"/>
          <YAxis stroke="#fff"/>
          <Tooltip />
          <Bar dataKey="value" fill="#00C49F"/>
        </BarChart>
      </ResponsiveContainer>
    </>
  );
};

export default BudgetChart;
