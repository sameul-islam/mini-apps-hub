"use client";

import React from "react";

interface Props {
  onClick: (value: string) => void;
}

const buttons: string[][] = [
  ["C", "(", ")", "/"],
  ["7", "8", "9", "*"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "=", "%"]
];

const ButtonPanel: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-gray-800 rounded-b-xl">
      {buttons.flat().map(btn => (
        <button
          key={btn}
          onClick={() => onClick(btn)}
          className={`p-4 text-white text-xl rounded-lg font-bold 
            ${btn === "C" ? "bg-red-500 hover:bg-red-600" :
            btn === "=" ? "bg-green-500 hover:bg-green-600" :
            "bg-gray-700 hover:bg-gray-600"}`}
        >
          {btn}
        </button>
      ))}
    </div>
  );
};

export default ButtonPanel;
