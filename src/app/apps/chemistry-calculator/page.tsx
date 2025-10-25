// app/chemistry-calculator/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import CalculatorForm, { CalcRequest } from "./components/CalculatorForm";
import ResultDisplay from "./components/ResultDisplay";


const ATOMIC_WEIGHTS: Record<string, number> = {
  H: 1.00794,
  He: 4.002602,
  Li: 6.941,
  Be: 9.012182,
  B: 10.811,
  C: 12.0107,
  N: 14.0067,
  O: 15.9994,
  F: 18.9984032,
  Ne: 20.1797,
  Na: 22.98976928,
  Mg: 24.3050,
  Al: 26.9815386,
  Si: 28.0855,
  P: 30.973762,
  S: 32.065,
  Cl: 35.453,
  K: 39.0983,
  Ca: 40.078,
  Fe: 55.845,
  Cu: 63.546,
  Zn: 65.38,
  Ag: 107.8682,
  Au: 196.966569,
  Pb: 207.2,
  // extend more if needed
};

/* --------------------------
   Formula parser (supports parentheses () and nested groups)
   returns map element -> count
   -------------------------- */
function tokenizeFormula(formula: string) {
  const re = /([A-Z][a-z]?|[0-9]+|\(|\))/g;
  const tokens: string[] = [];
  let m;
  while ((m = re.exec(formula)) !== null) tokens.push(m[1]);
  return tokens;
}

function parseFormulaToCounts(formula: string): Record<string, number> {
  const tokens = tokenizeFormula(formula);
  let i = 0;

  function parseGroup(): Record<string, number> {
    const counts: Record<string, number> = {};
    while (i < tokens.length) {
      const t = tokens[i++];
      if (t === "(") {
        const inner = parseGroup();
        // multiplier?
        const nxt = tokens[i];
        let mul = 1;
        if (nxt && /^\d+$/.test(nxt)) {
          mul = parseInt(tokens[i], 10);
          i++;
        }
        for (const k of Object.keys(inner)) {
          counts[k] = (counts[k] || 0) + inner[k] * mul;
        }
      } else if (t === ")") {
        break;
      } else if (/^[A-Z][a-z]?$/.test(t)) {
        const el = t;
        let num = 1;
        if (tokens[i] && /^\d+$/.test(tokens[i])) {
          num = parseInt(tokens[i], 10);
          i++;
        }
        counts[el] = (counts[el] || 0) + num;
      } else {
        // stray number -- ignore
      }
    }
    return counts;
  }

  i = 0;
  return parseGroup();
}

/* --------------------------
   Compute molar mass and composition
   -------------------------- */
function computeMolarMassAndBreakdown(formula: string) {
  try {
    const counts = parseFormulaToCounts(formula);
    let total = 0;
    const breakdown: { el: string; count: number; aw: number; mass: number }[] = [];
    for (const el of Object.keys(counts)) {
      const cnt = counts[el];
      const aw = ATOMIC_WEIGHTS[el];
      if (aw === undefined) {
        return { error: `Unknown element: ${el}`, molarMass: null, breakdown: [] as any };
      }
      const mass = aw * cnt;
      breakdown.push({ el, count: cnt, aw, mass });
      total += mass;
    }
    return { molarMass: Number(total.toFixed(6)), breakdown };
  } catch (err) {
    return { error: "Parse error", molarMass: null, breakdown: [] as any };
  }
}

/* --------------------------
   Helpers: grams <-> moles, molarity, dilution, unit conversions
   -------------------------- */
function gramsToMoles(grams: number, formula: string) {
  const r = computeMolarMassAndBreakdown(formula);
  if ((r as any).error) return { error: (r as any).error };
  const mm = (r as any).molarMass as number;
  return { moles: Number((grams / mm).toPrecision(6)), molarMass: mm };
}
function molesToGrams(moles: number, formula: string) {
  const r = computeMolarMassAndBreakdown(formula);
  if ((r as any).error) return { error: (r as any).error };
  const mm = (r as any).molarMass as number;
  return { grams: Number((moles * mm).toFixed(6)), molarMass: mm };
}
function molarityFromMass(grams: number, formula: string, volumeL: number) {
  if (volumeL <= 0) return { error: "Volume must be > 0 L" };
  const gm = gramsToMoles(grams, formula);
  if ((gm as any).error) return gm;
  return { M: Number((gm.moles / volumeL).toPrecision(6)) };
}
function dilutionSolve({ M1, V1, M2, V2 }: { M1?: number; V1?: number; M2?: number; V2?: number }) {
  // Solve single missing variable among M1,V1,M2,V2 using M1*V1 = M2*V2
  // Provide three of them.
  const provided = { M1, V1, M2, V2 };
  const keys = Object.entries(provided).filter(([k, v]) => v === undefined).map(([k]) => k);
  if (keys.length !== 1) return { error: "Provide exactly three values (one missing)" };
  const missing = keys[0];
  try {
    if (missing === "M1") return { M1: (M2! * V2!) / V1! };
    if (missing === "V1") return { V1: (M2! * V2!) / M1! };
    if (missing === "M2") return { M2: (M1! * V1!) / V2! };
    if (missing === "V2") return { V2: (M1! * V1!) / M2! };
    return { error: "Invalid" };
  } catch {
    return { error: "Invalid numeric values" };
  }
}

/* --------------------------
   Equation balancer
   Approach:
    - Parse each molecule to element counts
    - Build stoichiometric matrix (rows: elements, cols: molecules)
    - Solve integer nullspace (basic gaussian elimination + rational scaling)
   This is a lightweight solver sufficient for most simple equations.
   -------------------------- */
type Matrix = number[][];
function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}
function lcm(a: number, b: number) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a / gcd(a, b)) * b);
}
function rationalize(vec: number[]) {
  // convert array of rationals (floating) to integers by scaling with LCM denominators
  // We'll treat floats with tolerance.
  const tol = 1e-9;
  const maxDen = 1000000;
  const fracs = vec.map((v) => {
    // find rational approx by continued fraction? simpler: approximate denominator up to limit
    let denom = 1;
    let numer = v;
    while (Math.abs(Math.round(numer) - numer) > tol && denom < maxDen) {
      denom++;
      numer = v * denom;
    }
    const num = Math.round(numer);
    return { num, den: denom };
  });
  let scale = 1;
  for (const f of fracs) scale = lcm(scale, f.den);
  const ints = fracs.map((f) => Math.round((f.num * (scale / f.den))));
  // remove common gcd
  let g = 0;
  for (const n of ints) g = gcd(g, n);
  if (g === 0) g = 1;
  return ints.map((n) => n / g);
}
function balanceEquation(lhs: string[], rhs: string[]) {
  // molecules list: lhs + rhs
  const all = [...lhs, ...rhs];
  // collect elements
  const elemsSet = new Set<string>();
  const parsedList = all.map((mol) => {
    const counts = parseFormulaToCounts(mol);
    Object.keys(counts).forEach((e) => elemsSet.add(e));
    return counts;
  });
  const elems = Array.from(elemsSet);
  // matrix rows = elements, cols = molecules
  const m: Matrix = elems.map((el) => {
    return parsedList.map((counts, idx) => {
      const val = counts[el] || 0;
      // LHS positive, RHS negative (so solution vector is nullspace)
      return idx < lhs.length ? val : -val;
    });
  });
  // Solve nullspace via SVD would be ideal, but we implement simple integer nullspace search:
  // We'll solve homogeneous system m * x = 0 for integer x > 0.
  // For small molecules, we can find a basis via gaussian elimination and set free vars = 1.
  const rows = m.length;
  const cols = m[0]?.length || 0;
  // Convert to fraction matrix (use floats)
  const A = m.map((r) => r.map((v) => v * 1));
  // Gaussian elimination to row echelon
  let row = 0;
  for (let col = 0; col < cols && row < rows; col++) {
    // find pivot
    let sel = -1;
    for (let r = row; r < rows; r++) if (Math.abs(A[r][col]) > 1e-9) { sel = r; break; }
    if (sel === -1) continue;
    // swap
    [A[sel], A[row]] = [A[row], A[sel]];
    // normalize row
    const pivot = A[row][col];
    for (let c = col; c < cols; c++) A[row][c] /= pivot;
    // eliminate below
    for (let r = 0; r < rows; r++) {
      if (r === row) continue;
      const factor = A[r][col];
      if (Math.abs(factor) > 1e-9) {
        for (let c = col; c < cols; c++) A[r][c] -= factor * A[row][c];
      }
    }
    row++;
  }
  // Now find nullspace by setting last variable = 1, solve others using back substitution
  // This is heuristic but works for many simple cases.
  const x = new Array(cols).fill(0);
  // Try set last var = 1 and solve via least squares for integer solution
  // We will find integer solution by scanning small integers for free vars (basic search)
  const limit = 12; // try scale up to 12
  for (let scale = 1; scale <= limit; scale++) {
    // set last variable = scale
    x.fill(0);
    x[cols - 1] = scale;
    // attempt to solve upper rows via linear system (using original matrix)
    // we want m * x = 0 => for each row sum_j m[row][j] * x[j] = 0
    // unknowns: x[0..cols-2]
    // This is linear diophantine — we'll attempt integer solution using rational solve
    // Build linear system for unknowns (cols-1 variables)
    const vars = cols - 1;
    const B: number[][] = [];
    const Y: number[] = [];
    for (let r = 0; r < rows; r++) {
      const rowCoeffs = [];
      for (let j = 0; j < vars; j++) rowCoeffs.push(m[r][j]);
      // move known term to RHS
      const rhs = -m[r][cols - 1] * x[cols - 1];
      B.push(rowCoeffs);
      Y.push(rhs);
    }
    // Solve least squares (B may be rank-deficient) using normal equations: (B^T B) v = B^T Y
    // Build BTB and BTY
    const BTB: number[][] = Array(vars).fill(0).map(() => Array(vars).fill(0));
    const BTY: number[] = Array(vars).fill(0);
    for (let i = 0; i < vars; i++) {
      for (let j = 0; j < vars; j++) {
        let s = 0;
        for (let r = 0; r < rows; r++) s += B[r][i] * B[r][j];
        BTB[i][j] = s;
      }
      let sy = 0;
      for (let r = 0; r < rows; r++) sy += B[r][i] * Y[r];
      BTY[i] = sy;
    }
    // Solve BTB * v = BTY via Gaussian elimination
    // Guard singularity
    const mat: number[][] = BTB.map((row) => [...row]);
    const vec: number[] = [...BTY];
    // gaussian
    let rptr = 0;
    for (let c = 0; c < vars && rptr < vars; c++) {
      let sel = -1;
      for (let rr = rptr; rr < vars; rr++) if (Math.abs(mat[rr][c]) > 1e-9) { sel = rr; break; }
      if (sel === -1) continue;
      [mat[sel], mat[rptr]] = [mat[rptr], mat[sel]];
      [vec[sel], vec[rptr]] = [vec[rptr], vec[sel]];
      const piv = mat[rptr][c];
      for (let cc = c; cc < vars; cc++) mat[rptr][cc] /= piv;
      vec[rptr] /= piv;
      for (let rr = 0; rr < vars; rr++) {
        if (rr === rptr) continue;
        const f = mat[rr][c];
        if (Math.abs(f) > 1e-9) {
          for (let cc = c; cc < vars; cc++) mat[rr][cc] -= f * mat[rptr][cc];
          vec[rr] -= f * vec[rptr];
        }
      }
      rptr++;
    }
    // solution vector v:
    const v: number[] = Array(vars).fill(0);
    for (let i = 0; i < vars; i++) {
      // try to pick diagonal if mat[i][i] ~=1
      if (Math.abs(mat[i][i]) > 1e-6) v[i] = vec[i] / mat[i][i];
      else v[i] = 0;
    }
    const candidate = [...v, x[cols - 1]];
    // rationalize to integers
    const ints = rationalize(candidate);
    // check validity: m * ints == 0
    let ok = true;
    for (let rr = 0; rr < rows; rr++) {
      let s = 0;
      for (let j = 0; j < cols; j++) s += m[rr][j] * ints[j];
      if (Math.abs(s) > 1e-6) { ok = false; break; }
    }
    if (ok && ints.every((n) => n >= 0) && ints.some((n) => n > 0)) {
      // scale to smallest integers
      const minPos = ints.reduce((a, b) => (b > 0 && (a === 0 || b < a) ? b : a), 0) || 1;
      const scaled = ints.map((n) => Math.round(n));
      // normalize gcd
      let g = Math.abs(scaled[0]);
      for (const val of scaled) g = gcd(g, Math.abs(val));
      const final = scaled.map((n) => Math.round(n / (g || 1)));
      return { success: true, coeffs: final.slice(0, lhs.length).map((v) => v), coeffsRHS: final.slice(lhs.length) };
    }
  }
  return { success: false, error: "Could not balance equation (try different formatting or simpler equation)" };
}

/* --------------------------
  Dispatcher: performs requested calculation
  -------------------------- */
export type CalcResult = {
  title: string;
  summary: string;
  details?: string;
  table?: { label: string; value: string }[];
};

function performCalculation(req: CalcRequest): CalcResult {
  // req contains .mode and relevant fields
  try {
    if (req.mode === "molar-mass") {
      const formula = req.formula.trim();
      const r = computeMolarMassAndBreakdown(formula);
      if ((r as any).error) return { title: "Molar mass", summary: "Error", details: r.error };
      const mm = (r as any).molarMass;
      const breakdown = (r as any).breakdown as any[];
      return {
        title: "Molar mass",
        summary: `${formula} → ${mm} g·mol⁻¹`,
        details: breakdown.map((b) => `${b.el} × ${b.count} × ${b.aw} = ${b.mass.toFixed(4)} g`).join("\n"),
        table: breakdown.map((b) => ({ label: `${b.el} (${b.count})`, value: `${b.mass.toFixed(4)} g` })),
      };
    }

    if (req.mode === "grams-to-moles") {
      const r = gramsToMoles(req.grams!, req.formula!);
      if ((r as any).error) return { title: "Grams → Moles", summary: "Error", details: (r as any).error };
      return { title: "Grams → Moles", summary: `${req.grams} g of ${req.formula} = ${r.moles} mol`, details: `Molar mass: ${r.molarMass} g·mol⁻¹` };
    }

    if (req.mode === "moles-to-grams") {
      const r = molesToGrams(req.moles!, req.formula!);
      if ((r as any).error) return { title: "Moles → Grams", summary: "Error", details: (r as any).error };
      return { title: "Moles → Grams", summary: `${req.moles} mol of ${req.formula} = ${r.grams} g`, details: `Molar mass: ${r.molarMass} g·mol⁻¹` };
    }

    if (req.mode === "molarity") {
      const r = molarityFromMass(req.grams!, req.formula!, req.volumeL!);
      if ((r as any).error) return { title: "Molarity", summary: "Error", details: (r as any).error };
      return { title: "Molarity", summary: `${r.M} M`, details: `${req.grams} g in ${req.volumeL} L` };
    }

    if (req.mode === "dilution") {
      const out = dilutionSolve({ M1: req.M1, V1: req.V1, M2: req.M2, V2: req.V2 });
      if ((out as any).error) return { title: "Dilution (M1V1=M2V2)", summary: "Error", details: (out as any).error };
      return { title: "Dilution", summary: JSON.stringify(out) };
    }

    if (req.mode === "balance") {
      // user provides lhs & rhs as arrays of molecules
      const lhs = req.lhs ?? [];
      const rhs = req.rhs ?? [];
      const out = balanceEquation(lhs, rhs);
      if ((out as any).success) {
        const lcoeffs = (out as any).coeffs as number[];
        const rcoeffs = (out as any).coeffsRHS as number[];
        const lhsStr = lhs.map((mol, i) => `${lcoeffs[i]} ${mol}`).join(" + ");
        const rhsStr = rhs.map((mol, i) => `${rcoeffs[i]} ${rhs[i]}`).join(" + ");
        return { title: "Balanced equation", summary: `${lhsStr} → ${rhsStr}` };
      } else return { title: "Balance equation", summary: "Error", details: (out as any).error };
    }

    if (req.mode === "stoich") {
      // basic stoichiometry with coefficients
      // req provides coefA, coefP, massA, formulaA, formulaP
      const coefA = req.coefA ?? 1;
      const coefP = req.coefP ?? 1;
      const conv = gramsToMoles(req.massA!, req.formulaA!);
      if ((conv as any).error) return { title: "Stoichiometry", summary: "Error", details: (conv as any).error };
      const molesA = conv.moles;
      const molesP = molesA * (coefP / coefA);
      const gramsP = molesToGrams(molesP, req.formulaP!);
      if ((gramsP as any).error) return { title: "Stoichiometry", summary: "Error", details: (gramsP as any).error };
      return {
        title: "Stoichiometry",
        summary: `From ${req.massA} g ${req.formulaA} → ${molesP} mol ${req.formulaP} = ${gramsP.grams} g`,
      };
    }

    if (req.mode === "limiting") {
      // req: { coefA, coefB, formulaA, formulaB, massA, massB, coefP, formulaP }
      const out = (function () {
        const convA = gramsToMoles(req.massA!, req.formulaA!);
        const convB = gramsToMoles(req.massB!, req.formulaB!);
        if ((convA as any).error) return { error: convA.error };
        if ((convB as any).error) return { error: convB.error };
        const mA = convA.moles;
        const mB = convB.moles;
        const pFromA = mA * ((req.coefP ?? 1) / (req.coefA ?? 1));
        const pFromB = mB * ((req.coefP ?? 1) / (req.coefB ?? 1));
        const molesP = Math.min(pFromA, pFromB);
        const gramsP = molesToGrams(molesP, req.formulaP!);
        return { limiting: pFromA < pFromB ? "A" : "B", molesP: Number(molesP.toPrecision(6)), gramsP: (gramsP as any).grams };
      })();
      if ((out as any).error) return { title: "Limiting reagent", summary: "Error", details: (out as any).error };
      return { title: "Limiting reagent", summary: `Limiting: ${(out as any).limiting}`, details: `Product: ${(out as any).molesP} mol = ${(out as any).gramsP} g` };
    }

    return { title: "Unknown", summary: "Unsupported operation" };
  } catch (err: any) {
    return { title: "Error", summary: "Computation failed", details: String(err) };
  }
}

/* --------------------------
   Page component
   -------------------------- */
export default function ChemistryAdvancedPage() {
  const [result, setResult] = useState<CalcResult | null>(null);

  function handleRequest(req: CalcRequest) {
    const res = performCalculation(req);
    setResult(res);
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-green-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-green-300">Advanced Chemistry Calculator</h1>
          <div className="text-sm text-green-200/70">All-in-one: molar mass, stoichiometry, balancing, limiting reagent</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalculatorForm onRequest={handleRequest} />
          </div>

          <div>
            <ResultDisplay result={result} />
          </div>
        </div>
      </div>
    </main>
  );
}
