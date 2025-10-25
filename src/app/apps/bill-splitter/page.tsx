"use client";

import { useState, useEffect } from "react";
import { Participant, Expense, Settings } from "./types";
import ParticipantForm from "./components/ParticipantForm";
import ParticipantList from "./components/ParticipantList";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import BillSummary from "./components/BillSummary";

export default function page() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settings, setSettings] = useState<Settings>({ tip: 0, tax: 0, currency: "$" });

  useEffect(() => {
    const storedParticipants = localStorage.getItem("participants");
    const storedExpenses = localStorage.getItem("expenses");
    const storedSettings = localStorage.getItem("settings");

    if (storedParticipants) setParticipants(JSON.parse(storedParticipants));
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  useEffect(() => {
    localStorage.setItem("participants", JSON.stringify(participants));
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [participants, expenses, settings]);

  const addParticipant = (p: Participant) => setParticipants([p, ...participants]);
  const deleteParticipant = (id: string) => setParticipants(participants.filter(p => p.id !== id));
  const addExpense = (e: Expense) => setExpenses([e, ...expenses]);
  const deleteExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));

  return (
    <main className="min-h-screen flex flex-col items-center p-4 sm:p-6 font-Noto">
      <div className="w-full md:w-[60%] bg-[#292524] rounded-xl p-4 sm:p-6 flex flex-col gap-4">
        <h1 className="text-3xl sm:text-4xl text-white font-bold text-center"> Bill Splitter</h1>

        <div className="mt-4">
          <h2 className="text-white font-semibold">Participants</h2>
          <ParticipantForm addParticipant={addParticipant} />
          <ParticipantList participants={participants} deleteParticipant={deleteParticipant} />
        </div>

        <div className="mt-4">
          <h2 className="text-white font-semibold">Expenses</h2>
          {participants.length > 0 && <ExpenseForm participants={participants} addExpense={addExpense} />}
          <ExpenseList expenses={expenses} participants={participants} deleteExpense={deleteExpense} />
        </div>

        <BillSummary expenses={expenses} participants={participants} settings={settings} />
      </div>
    </main>
  );
}
