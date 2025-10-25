
"use client";
import React, { useState } from "react";

interface Props {
  onCalculate: (value: string) => void;
}

const Calculator: React.FC<Props> = ({ onCalculate }) => {
  const [input, setInput] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleSubmit() {
    onCalculate(input);
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg mt-4">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Enter formula or value"
        className="w-full p-2 rounded mb-2 text-black"
      />
      <button
        onClick={handleSubmit}
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Calculate
      </button>
    </div>
  );
};

export default Calculator;
