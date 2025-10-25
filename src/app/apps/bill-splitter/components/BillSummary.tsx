"use client";

import { FC } from "react";
import { Expense, Participant, Settings } from "../types";

interface Props {
  expenses: Expense[];
  participants: Participant[];
  settings: Settings;
}

const BillSummary: FC<Props> = ({ expenses, participants, settings }) => {
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalWithTaxTip = totalExpense + (totalExpense * settings.tax / 100) + (totalExpense * settings.tip / 100);
  const perPerson = participants.length > 0 ? totalWithTaxTip / participants.length : 0;

  return (
    <div className="bg-white/10 p-4 rounded-xl mt-4 text-white font-semibold">
      <p>Total Expense: ${totalExpense.toFixed(2)}</p>
      <p>Tax: {settings.tax}% | Tip: {settings.tip}%</p>
      <p>Total with Tax & Tip: ${totalWithTaxTip.toFixed(2)}</p>
      <p>Per Person: ${perPerson.toFixed(2)}</p>
    </div>
  );
};

export default BillSummary;
