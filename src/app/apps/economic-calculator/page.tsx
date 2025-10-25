"use client";

import React, { useState } from "react";
import Calculator from "./components/Calculator";
import ButtonPanel from "./components/ButtonPanel";

export default function page() {
  const [display, setDisplay] = useState<string>("");
  const [result, setResult] = useState<string>("");

  function handleInput(value: string) {
    if (value === "C") {
      setDisplay("");
      setResult("");
      return;
    }
    if (value === "=") {
      try {
        const evalResult = Function(`"use strict";return (${display})`)();
        setResult(String(evalResult));
      } catch (err) {
        setResult("Error");
      }
      return;
    }
    setDisplay(prev => prev + value);
  }

  return (
    <main className="h-fit w-fit  md:w-2xl m-auto flex items-center justify-center bg-[#004f3b] p-10 mt-16 rounded-2xl">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-4 bg-gray-900 rounded-t-xl text-right text-white font-mono text-2xl ">
          {display || "0"}
        </div>
        <div className="p-2 bg-gray-900 text-right text-gray-300 font-mono text-xl ">
          {result && `= ${result}`}
        </div>
        <ButtonPanel onClick={handleInput} />
      </div>
    </main>
  );
}
