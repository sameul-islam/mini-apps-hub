"use client";

import { useState, useEffect } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";

type UnitCategory = "Length" | "Weight" | "Temperature" | "Volume" | "Speed";

const units: Record<UnitCategory, string[]> = {
  Length: ["Meter", "Kilometer", "Mile", "Foot", "Inch"],
  Weight: ["Kilogram", "Gram", "Pound", "Ounce"],
  Temperature: ["Celsius", "Fahrenheit", "Kelvin"],
  Volume: ["Liter", "Milliliter", "Gallon", "Cup"],
  Speed: ["m/s", "km/h", "mph"]
};

interface HistoryItem {
  input: number;
  fromUnit: string;
  toUnit: string;
  result: number;
}

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>("Length");
  const [fromUnit, setFromUnit] = useState<string>(units["Length"][0]);
  const [toUnit, setToUnit] = useState<string>(units["Length"][1]);
  const [inputValue, setInputValue] = useState<number>(0);
  const [result, setResult] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setFromUnit(units[category][0]);
    setToUnit(units[category][1] || units[category][0]);
  }, [category]);

  useEffect(() => {
    calculateConversion();
  }, [inputValue, fromUnit, toUnit, category]);

  const calculateConversion = () => {
    let output = inputValue;
    switch (category) {
      case "Length":
        output = lengthConverter(inputValue, fromUnit, toUnit);
        break;
      case "Weight":
        output = weightConverter(inputValue, fromUnit, toUnit);
        break;
      case "Temperature":
        output = temperatureConverter(inputValue, fromUnit, toUnit);
        break;
      case "Volume":
        output = volumeConverter(inputValue, fromUnit, toUnit);
        break;
      case "Speed":
        output = speedConverter(inputValue, fromUnit, toUnit);
        break;
    }
    const rounded = Number(output.toFixed(4));
    setResult(rounded);

    if (inputValue !== 0) {
      setHistory((prev) => [
        { input: inputValue, fromUnit, toUnit, result: rounded },
        ...prev
      ]);
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const copyResult = () => {
    navigator.clipboard.writeText(`${result} ${toUnit}`);
    alert(`Copied: ${result} ${toUnit}`);
  };

  // --- Conversion Functions ---
  const lengthConverter = (val: number, from: string, to: string) => {
    const map: Record<string, number> = {
      Meter: 1,
      Kilometer: 1000,
      Mile: 1609.34,
      Foot: 0.3048,
      Inch: 0.0254
    };
    return (val * map[from]) / map[to];
  };

  const weightConverter = (val: number, from: string, to: string) => {
    const map: Record<string, number> = {
      Kilogram: 1,
      Gram: 0.001,
      Pound: 0.453592,
      Ounce: 0.0283495
    };
    return (val * map[from]) / map[to];
  };

  const temperatureConverter = (val: number, from: string, to: string) => {
    let tempInC = val;
    if (from === "Fahrenheit") tempInC = (val - 32) * (5 / 9);
    if (from === "Kelvin") tempInC = val - 273.15;

    if (to === "Celsius") return tempInC;
    if (to === "Fahrenheit") return tempInC * (9 / 5) + 32;
    if (to === "Kelvin") return tempInC + 273.15;
    return tempInC;
  };

  const volumeConverter = (val: number, from: string, to: string) => {
    const map: Record<string, number> = {
      Liter: 1,
      Milliliter: 0.001,
      Gallon: 3.78541,
      Cup: 0.24
    };
    return (val * map[from]) / map[to];
  };

  const speedConverter = (val: number, from: string, to: string) => {
    const map: Record<string, number> = {
      "m/s": 1,
      "km/h": 0.277778,
      mph: 0.44704
    };
    return (val * map[from]) / map[to];
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-Noto bg-black/20">
      <div className="w-full md:w-[500px] bg-[#57534d] p-6 rounded-2xl flex flex-col gap-4 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">Unit Converter</h1>

        {/* Category Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-white font-semibold">Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as UnitCategory)}
            className="px-4 py-2 rounded-xl bg-[#e2e8f0] text-black focus:outline-none focus:ring focus:ring-gray-800"
          >
            {Object.keys(units).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* From & To Units */}
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <label className="text-white font-semibold">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#e2e8f0] text-black focus:outline-none focus:ring focus:ring-gray-800"
            >
              {units[category].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <button
            onClick={swapUnits}
            className="px-3 py-2 rounded-xl bg-green-500 text-black font-bold self-end hover:bg-green-600 transition"
          >
            <CgArrowsExchangeV />
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <label className="text-white font-semibold">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="px-4 py-2 rounded-xl bg-[#e2e8f0] text-black focus:outline-none focus:ring focus:ring-gray-800"
            >
              {units[category].map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Input Value */}
        <div className="flex flex-col gap-2">
          <label className="text-white font-semibold">Value:</label>
          <input
            type="number"
            min="0"
            value={inputValue}
            onChange={(e) => setInputValue(Number(e.target.value))}
            placeholder="0"
            className="px-4 py-2 rounded-xl bg-white/10 text-white focus:outline-none focus:ring focus:ring-gray-800"
          />
        </div>

        {/* Result */}
        <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl text-white font-semibold text-lg">
          <span>Result: {result} {toUnit}</span>
          <button
            onClick={copyResult}
            className="px-3 py-1 bg-green-500 text-black font-bold rounded-xl hover:bg-green-600 transition"
          >
            Copy
          </button>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white/10 p-4 rounded-xl text-white text-sm max-h-40 overflow-auto">
            <h2 className="font-semibold mb-2">History</h2>
            <ul className="flex flex-col gap-1">
              {history.map((h, idx) => (
                <li key={idx}>
                  {h.input} {h.fromUnit} → {h.result} {h.toUnit}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
