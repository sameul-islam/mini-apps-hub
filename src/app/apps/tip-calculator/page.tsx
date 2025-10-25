"use client";

import { useState, useEffect } from "react";

const currencies = ["$", "€", "£", "৳", "₹"];

export default function page() {
  const [bill, setBill] = useState<number>(0);
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [people, setPeople] = useState<number>(1);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [totalPerPerson, setTotalPerPerson] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("$");

  useEffect(() => {
    if (people <= 0) setPeople(1);
    const tip = (bill * tipPercent) / 100;
    const total = bill + tip;
    setTipAmount(tip);
    setTotalPerPerson(total / people);
  }, [bill, tipPercent, people]);

  const handleReset = () => {
    setBill(0);
    setTipPercent(15);
    setPeople(1);
    setTipAmount(0);
    setTotalPerPerson(0);
  };

  const presetTips = [5, 10, 15, 20, 25];

  const copyResult = () => {
    navigator.clipboard.writeText(
      `Tip Amount: ${currency}${tipAmount.toFixed(2)}\nTotal Per Person: ${currency}${totalPerPerson.toFixed(2)}`
    );
    alert("Results copied to clipboard!");
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-Noto ">
      <div className="w-full md:w-[400px] bg-[#57534d] rounded-2xl p-6 flex flex-col gap-4 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center">Tip Calculator</h1>

        {/* Currency Selector */}
        <div className="flex gap-2">
          <label className="text-white font-semibold">Currency:</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="px-3 py-1 rounded-xl bg-[#B2BABB] text-black focus:outline-none focus:ring focus:ring-gray-800"
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Bill Amount */}
        <div className="flex flex-col gap-2">
          <label className="text-white font-semibold">Bill Amount</label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={bill === 0 ? "" : bill}
            onChange={(e) => setBill(Number(e.target.value))}
            className="px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring focus:ring-gray-800"
          />
        </div>

        {/* Tip Percentage */}
        <div className="flex flex-col gap-2">
          <label className="text-white font-semibold">Tip %</label>
          <div className="flex gap-2 flex-wrap">
            {presetTips.map((tip) => (
              <button
                key={tip}
                onClick={() => setTipPercent(tip)}
                className={`px-3 py-1 rounded-xl font-semibold ${
                  tipPercent === tip ? "bg-green-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
                } transition`}
              >
                {tip}%
              </button>
            ))}
            <input
              type="number"
              min="0"
              max="100"
              value={tipPercent}
              onChange={(e) => setTipPercent(Number(e.target.value))}
              placeholder="Custom"
              className="px-3 py-1 rounded-xl bg-white/10 text-white focus:outline-none focus:ring focus:ring-gray-800 w-[80px]"
            />
          </div>
        </div>

        {/* Number of People */}
        <div className="flex flex-col gap-2">
          <label className="text-white font-semibold">Number of People</label>
          <input
            type="number"
            min="1"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring focus:ring-gray-800"
          />
        </div>

        {/* Results */}
        <div className="bg-white/10 p-4 rounded-xl flex flex-col gap-2">
          <p className="text-white font-semibold">Tip Amount: {currency}{tipAmount.toFixed(2)}</p>
          <p className="text-white font-semibold">Total Per Person: {currency}{totalPerPerson.toFixed(2)}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleReset}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition"
          >
            Reset
          </button>
          <button
            onClick={copyResult}
            className="flex-1 px-4 py-2 bg-green-500 text-black rounded-xl font-bold hover:bg-green-600 transition"
          >
            Copy Result
          </button>
        </div>
      </div>
    </main>
  );
}
