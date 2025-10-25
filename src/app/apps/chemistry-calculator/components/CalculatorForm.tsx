// app/chemistry-calculator/components/CalculatorForm.tsx
"use client";

import React, { useState } from "react";

/**
 * CalculatorForm
 * - provides tabs / mode selector for many chemistry ops
 * - emits CalcRequest to parent (page.tsx) via onRequest
 */

export type CalcRequest =
  | { mode: "molar-mass"; formula: string }
  | { mode: "grams-to-moles"; formula: string; grams: number }
  | { mode: "moles-to-grams"; formula: string; moles: number }
  | { mode: "molarity"; formula: string; grams: number; volumeL: number }
  | { mode: "dilution"; M1?: number; V1?: number; M2?: number; V2?: number }
  | { mode: "balance"; lhs: string[]; rhs: string[] }
  | { mode: "stoich"; coefA: number; coefP: number; formulaA: string; formulaP: string; massA: number }
  | { mode: "limiting"; coefA: number; coefB: number; formulaA: string; formulaB: string; massA: number; massB: number; coefP: number; formulaP: string };

interface Props {
  onRequest: (req: CalcRequest) => void;
}

const inputClass = "w-full p-2 bg-neutral-900 border border-green-800 rounded text-green-100";

export default function CalculatorForm({ onRequest }: Props) {
  const [mode, setMode] = useState<CalcRequest["mode"]>("molar-mass");

  // common states
  const [formula, setFormula] = useState("H2O");
  const [grams, setGrams] = useState("18");
  const [moles, setMoles] = useState("1");
  const [volume, setVolume] = useState("1");

  // balance fields
  const [lhsRaw, setLhsRaw] = useState("H2 + O2");
  const [rhsRaw, setRhsRaw] = useState("H2O");

  // stoich & limiting
  const [coefA, setCoefA] = useState("1");
  const [coefP, setCoefP] = useState("1");
  const [formulaA, setFormulaA] = useState("H2");
  const [formulaP, setFormulaP] = useState("H2O");
  const [massA, setMassA] = useState("10");

  const [coefB, setCoefB] = useState("1");
  const [formulaB, setFormulaB] = useState("O2");
  const [massB, setMassB] = useState("10");

  function submit() {
    if (mode === "molar-mass") {
      onRequest({ mode: "molar-mass", formula });
      return;
    }
    if (mode === "grams-to-moles") {
      onRequest({ mode: "grams-to-moles", formula, grams: parseFloat(grams || "0") });
      return;
    }
    if (mode === "moles-to-grams") {
      onRequest({ mode: "moles-to-grams", formula, moles: parseFloat(moles || "0") });
      return;
    }
    if (mode === "molarity") {
      onRequest({ mode: "molarity", formula, grams: parseFloat(grams || "0"), volumeL: parseFloat(volume || "0") });
      return;
    }
    if (mode === "dilution") {
      onRequest({ mode: "dilution", M1: parseMaybe("M1"), V1: parseMaybe("V1"), M2: parseMaybe("M2"), V2: parseMaybe("V2") });
      function parseMaybe(key: string) {
        // quick small helper using fields stored in form (we don't have separate fields for dilution UI here so simple approach)
        return undefined;
      }
    }
    if (mode === "balance") {
      const lhs = lhsRaw.split("+").map(s => s.trim()).filter(Boolean);
      const rhs = rhsRaw.split("+").map(s => s.trim()).filter(Boolean);
      onRequest({ mode: "balance", lhs, rhs });
      return;
    }
    if (mode === "stoich") {
      onRequest({
        mode: "stoich",
        coefA: Number(coefA || "1"),
        coefP: Number(coefP || "1"),
        formulaA,
        formulaP,
        massA: Number(massA || "0"),
      });
      return;
    }
    if (mode === "limiting") {
      onRequest({
        mode: "limiting",
        coefA: Number(coefA || "1"),
        coefB: Number(coefB || "1"),
        formulaA,
        formulaB,
        massA: Number(massA || "0"),
        massB: Number(massB || "0"),
        coefP: Number(coefP || "1"),
        formulaP,
      });
      return;
    }
  }

  return (
    <div className="bg-neutral-900/60 border border-green-800 rounded p-4">
      <div className="flex gap-2 mb-4">
        <select value={mode} onChange={(e) => setMode(e.target.value as any)} className={inputClass}>
          <option value="molar-mass">Molar Mass</option>
          <option value="grams-to-moles">Grams → Moles</option>
          <option value="moles-to-grams">Moles → Grams</option>
          <option value="molarity">Molarity (from mass)</option>
          <option value="balance">Balance equation</option>
          <option value="stoich">Stoichiometry (mass → product)</option>
          <option value="limiting">Limiting reagent</option>
        </select>
        <button onClick={() => { setFormula("C6H12O6"); setGrams("180"); }} className="px-3 py-2 rounded bg-green-700 hover:bg-green-600 text-black">Example</button>
      </div>

      {/* conditional fields */}
      <div className="space-y-3">
        {(mode === "molar-mass" || mode === "grams-to-moles" || mode === "moles-to-grams" || mode === "molarity") && (
          <>
            <label className="text-xs text-green-200">Formula</label>
            <input className={inputClass} value={formula} onChange={(e) => setFormula(e.target.value)} />
          </>
        )}

        {mode === "grams-to-moles" && (
          <>
            <label className="text-xs text-green-200">Mass (g)</label>
            <input className={inputClass} value={grams} onChange={(e) => setGrams(e.target.value)} />
          </>
        )}

        {mode === "moles-to-grams" && (
          <>
            <label className="text-xs text-green-200">Moles (mol)</label>
            <input className={inputClass} value={moles} onChange={(e) => setMoles(e.target.value)} />
          </>
        )}

        {mode === "molarity" && (
          <>
            <label className="text-xs text-green-200">Mass (g)</label>
            <input className={inputClass} value={grams} onChange={(e) => setGrams(e.target.value)} />
            <label className="text-xs text-green-200">Volume (L)</label>
            <input className={inputClass} value={volume} onChange={(e) => setVolume(e.target.value)} />
          </>
        )}

        {mode === "balance" && (
          <>
            <label className="text-xs text-green-200">Left side (A + B + ...)</label>
            <input className={inputClass} value={lhsRaw} onChange={(e) => setLhsRaw(e.target.value)} />
            <label className="text-xs text-green-200">Right side (C + D + ...)</label>
            <input className={inputClass} value={rhsRaw} onChange={(e) => setRhsRaw(e.target.value)} />
            <p className="text-xs text-green-300/70">Examples: "Fe + O2" and "Fe2O3"</p>
          </>
        )}

        {(mode === "stoich" || mode === "limiting") && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-green-200">Coef A</label>
                <input className={inputClass} value={coefA} onChange={(e) => setCoefA(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-green-200">Formula A</label>
                <input className={inputClass} value={formulaA} onChange={(e) => setFormulaA(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-green-200">Mass A (g)</label>
                <input className={inputClass} value={massA} onChange={(e) => setMassA(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-green-200">Coef Product</label>
                <input className={inputClass} value={coefP} onChange={(e) => setCoefP(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-green-200">Formula Product</label>
                <input className={inputClass} value={formulaP} onChange={(e) => setFormulaP(e.target.value)} />
              </div>
              {mode === "limiting" && (
                <>
                  <div>
                    <label className="text-xs text-green-200">Coef B</label>
                    <input className={inputClass} value={coefB} onChange={(e) => setCoefB(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-green-200">Formula B</label>
                    <input className={inputClass} value={formulaB} onChange={(e) => setFormulaB(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-green-200">Mass B (g)</label>
                    <input className={inputClass} value={massB} onChange={(e) => setMassB(e.target.value)} />
                  </div>
                </>
              )}
            </div>
          </>
        )}

        <div className="flex gap-2 mt-3">
          <button className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-black font-semibold" onClick={submit}>Compute</button>
          <button className="px-4 py-2 rounded bg-neutral-800 border border-green-800 text-green-200" onClick={() => window.location.reload()}>Reset</button>
        </div>
      </div>
    </div>
  );
}
