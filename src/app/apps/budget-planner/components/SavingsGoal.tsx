"use client";

import { FC, useState } from "react";

interface Props {
  savingsGoal: number;
  setSavingsGoal: (amount: number) => void;
}

const SavingsGoal: FC<Props> = ({ savingsGoal, setSavingsGoal }) => {
  const [input, setInput] = useState(savingsGoal);

  const handleSet = () => setSavingsGoal(Number(input));

  return (
    <div className="flex gap-2 items-center mt-2">
      <input
        type="number"
        placeholder="Savings Goal"
        value={input}
        onChange={(e) => setInput(Number(e.target.value))}
        className="px-3 py-2 rounded-lg bg-white/5 text-white"
      />
      <button onClick={handleSet} className="bg-yellow-400 text-black px-3 py-2 rounded-lg font-bold hover:bg-yellow-500 transition">
        Set Goal
      </button>
    </div>
  );
};

export default SavingsGoal;
