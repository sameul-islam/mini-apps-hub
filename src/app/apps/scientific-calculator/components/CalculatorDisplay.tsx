"use client";

import React from "react";

type Props = {
  expression: string;
  result: string;
};

export default function CalculatorDisplay({ expression, result }: Props) {
  return (
    <div className="w-full max-w-md bg-green-900 rounded-md p-4 mb-4">
      <div className="text-green-200 text-lg break-words min-h-[40px]">{expression || "0"}</div>
      <div className="text-green-100 text-2xl font-bold mt-2 break-words">{result}</div>
    </div>
  );
}
