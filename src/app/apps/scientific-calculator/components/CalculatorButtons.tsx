"use client";

import React from "react";

type Props = {
  append: (val: string) => void;
  clear: () => void;
  clearAll: () => void;
  calculate: () => void;
};

const buttons = [
  ["7","8","9","/","sin"],
  ["4","5","6","*","cos"],
  ["1","2","3","-","tan"],
  ["0",".","π","+","√"],
  ["("," )","ln","log","!"],
  ["sinh","cosh","tanh","^","mod"],
  ["C","×","=","e","i","abs"]
];

export default function CalculatorButtons({ append, clear, clearAll, calculate }: Props) {
  const handleClick = (val: string) => {
    if(val === "C") clear();
    else if(val === "×") clearAll();
    else if(val === "=") calculate();
    else if(["sin","cos","tan","sinh","cosh","tanh","log","ln","abs"].includes(val)) append(`${val}(`);
    else if(val === "√") append("sqrt(");
    else if(val === "!") append("factorial(");
    else if(val === "^") append("**");
    else append(val);
  };

  return (
    <div className="grid grid-cols-5 gap-2 w-full max-w-md">
      {buttons.flat().map(b => (
        <button
          key={b}
          onClick={() => handleClick(b)}
          className="bg-green-700 hover:bg-green-600 text-green-100 font-bold p-4 rounded-md text-lg"
        >
          {b}
        </button>
      ))}
    </div>
  );
}
