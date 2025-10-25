"use client";

import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface HistoryItem {
  weight: number;
  height: number;
  bmi: number;
  category: string;
  unit: "metric" | "imperial";
}

export default function BMICalculatorAdvanced() {
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(170);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [bmi, setBMI] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => calculateBMI(), [weight, height, unit]);

  const calculateBMI = () => {
    let bmiValue = 0;
    if (unit === "metric") {
      const h = height / 100;
      bmiValue = weight / (h * h);
    } else {
      bmiValue = (weight / (height * height)) * 703;
    }
    const rounded = Number(bmiValue.toFixed(2));
    setBMI(rounded);
    setCategory(getBMICategory(rounded));
  };

  const getBMICategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Underweight";
    else if (bmiValue < 25) return "Normal";
    else if (bmiValue < 30) return "Overweight";
    else return "Obese";
  };

  const addToHistory = () => {
    setHistory([{ weight, height, bmi, category, unit }, ...history]);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(`BMI: ${bmi} (${category})`);
    alert(`Copied: BMI: ${bmi} (${category})`);
  };

  const resetHistory = () => setHistory([]);

  const categoryCounts = history.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const pieData = {
    labels: ["Underweight", "Normal", "Overweight", "Obese"],
    datasets: [
      {
        data: [
          categoryCounts["Underweight"] || 0,
          categoryCounts["Normal"] || 0,
          categoryCounts["Overweight"] || 0,
          categoryCounts["Obese"] || 0,
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 font-Noto bg-black/40">
      <div className="w-full md:w-[550px] bg-[#57534d] p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">BMI Calculator</h1>

        {/* Unit Selector */}
        <div className="flex gap-2 justify-center mb-2">
          <button
            onClick={() => setUnit("metric")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              unit === "metric" ? "bg-green-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
            } transition`}
          >
            Metric (kg/cm)
          </button>
          <button
            onClick={() => setUnit("imperial")}
            className={`px-4 py-2 rounded-xl font-semibold ${
              unit === "imperial" ? "bg-green-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
            } transition`}
          >
            Imperial (lb/in)
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-white font-semibold">Weight ({unit === "metric" ? "kg" : "lb"})</label>
            <input
              type="number"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring focus:ring-gray-800"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white font-semibold">Height ({unit === "metric" ? "cm" : "in"})</label>
            <input
              type="number"
              value={height || ""}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring focus:ring-gray-800"
            />
          </div>
        </div>

        {/* Result & Actions */}
        <div className="flex flex-col gap-2 bg-white/10 p-4 rounded-xl text-white text-center font-semibold text-lg">
          <span>BMI: {bmi}</span>
          <span>Category: {category}</span>
          <div className="flex gap-2 justify-center mt-2 flex-wrap">
            <button
              onClick={copyResult}
              className="px-3 py-1 bg-green-500 text-black font-bold rounded-xl hover:bg-green-600 transition"
            >
              Copy Result
            </button>
            <button
              onClick={addToHistory}
              className="px-3 py-1 bg-blue-500 text-black font-bold rounded-xl hover:bg-blue-600 transition"
            >
              Save History
            </button>
            <button
              onClick={resetHistory}
              className="px-3 py-1 bg-red-500 text-black font-bold rounded-xl hover:bg-red-600 transition"
            >
              Reset History
            </button>
          </div>
        </div>

        {/* BMI Bar */}
        <div className="w-full h-6 rounded-xl overflow-hidden mt-2 bg-white/10">
          <div
            className={`h-full ${
              category === "Underweight"
                ? "bg-blue-500"
                : category === "Normal"
                ? "bg-green-500"
                : category === "Overweight"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${Math.min(bmi, 40) * 2.5}%` }}
          ></div>
        </div>

        {/* History & Pie Chart */}
        {history.length > 0 && (
          <div className="flex flex-col gap-4 mt-2">
            <div className="bg-white/10 p-4 rounded-xl text-white text-sm max-h-48 overflow-auto">
              <h2 className="font-semibold mb-2">History</h2>
              <ul className="flex flex-col gap-1">
                {history.map((h, idx) => (
                  <li key={idx}>
                    {h.weight} {h.unit === "metric" ? "kg" : "lb"} / {h.height} {h.unit === "metric" ? "cm" : "in"} → BMI: {h.bmi} ({h.category})
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 p-4 rounded-xl text-white">
              <h2 className="font-semibold mb-2 text-center">BMI Category Distribution</h2>
              <Pie data={pieData} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
