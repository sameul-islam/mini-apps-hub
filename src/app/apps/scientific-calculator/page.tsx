"use client";

import React, { useState } from "react";
import CalculatorDisplay from "./components/CalculatorDisplay";
import CalculatorButtons from "./components/CalculatorButtons";
import { evaluateExpression } from "./utils/calculatorUtils";

export default function ScientificCalculatorPage() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string>("");

  const append = (val: string) => setExpression(prev => prev + val);
  const clear = () => setExpression(prev => prev.slice(0, -1));
  const clearAll = () => { setExpression(""); setResult(""); };

  const calculate = () => {
    try {
      const res = evaluateExpression(expression);
      setResult(res);
    } catch (err) {
      setResult("Error");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-green-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-green-300 mb-6">Ultimate Scientific Calculator</h1>

      <CalculatorDisplay expression={expression} result={result} />

      <CalculatorButtons append={append} clear={clear} clearAll={clearAll} calculate={calculate} />
    </main>
  );
}
