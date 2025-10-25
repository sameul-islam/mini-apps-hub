"use client";

import React, { useEffect, useMemo, useState } from "react";

/**
 * Password Generator - Ultra professional, secure, user-friendly
 * - TypeScript + React (client component)
 * - Uses crypto.getRandomValues for secure randomness
 * - Ensures at least one char from each selected category (if possible)
 * - Shows entropy bits and a strength bar
 * - Keeps history in localStorage (save / reuse / delete / export)
 *
 * Place this file at: app/apps/password-generator/page.tsx
 * Requires TailwindCSS (used classes) and Next.js app router.
 */

type HistoryItem = {
  id: string;
  password: string;
  timestamp: string; // ISO
  length: number;
  sets: string[];
};

const LS_KEY = "pwgen_history_v1";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SPECIAL = "!@#$%^&*()-_=+[]{}|;:,.<>/?";
const AMBIGUOUS = "il1Lo0O";

function secureRandomInt(max: number) {
  // returns integer in [0, max)
  if (max <= 0) return 0;
  const u32 = new Uint32Array(1);
  window.crypto.getRandomValues(u32);
  // using modulo is OK here; for extra fairness could reject above range, but for practical lengths this is fine
  return u32[0] % max;
}

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function estimateEntropyBits(charsetSize: number, length: number) {
  if (charsetSize <= 1 || length <= 0) return 0;
  return +(Math.log2(charsetSize) * length).toFixed(2);
}

function strengthLabelFromBits(bits: number) {
  if (bits < 28) return { label: "Very Weak", color: "bg-red-500" };
  if (bits < 50) return { label: "Weak", color: "bg-orange-400" };
  if (bits < 70) return { label: "Moderate", color: "bg-yellow-400" };
  if (bits < 100) return { label: "Strong", color: "bg-green-400" };
  return { label: "Very Strong", color: "bg-green-600" };
}

export default function PasswordGeneratorPage() {
  // options
  const [length, setLength] = useState<number>(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSpecial, setUseSpecial] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(true);
  const [allowRepeats, setAllowRepeats] = useState(true);

  // UI state
  const [password, setPassword] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // load history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch (e) {
      console.error("History load failed", e);
    }
  }, []);

  // persist history on changes
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(history));
  }, [history]);

  const charset = useMemo(() => {
    let s = "";
    if (useLower) s += LOWER;
    if (useUpper) s += UPPER;
    if (useDigits) s += DIGITS;
    if (useSpecial) s += SPECIAL;
    if (excludeAmbiguous) {
      s = s.split("").filter((c) => !AMBIGUOUS.includes(c)).join("");
    }
    // if repeats not allowed, charset must be >= length to fully satisfy; we will handle that constraint in generate
    return s;
  }, [useLower, useUpper, useDigits, useSpecial, excludeAmbiguous]);

  const charsetSize = charset.length;
  const entropyBits = useMemo(() => estimateEntropyBits(charsetSize, length), [charsetSize, length]);
  const strength = strengthLabelFromBits(entropyBits);

  // Ensure at least one set present
  const activeSets = useMemo(() => {
    const sets: { name: string; chars: string }[] = [];
    if (useLower) sets.push({ name: "lower", chars: excludeAmbiguous ? LOWER.split("").filter(c => !AMBIGUOUS.includes(c)).join("") : LOWER });
    if (useUpper) sets.push({ name: "upper", chars: excludeAmbiguous ? UPPER.split("").filter(c => !AMBIGUOUS.includes(c)).join("") : UPPER });
    if (useDigits) sets.push({ name: "digits", chars: excludeAmbiguous ? DIGITS.split("").filter(c => !AMBIGUOUS.includes(c)).join("") : DIGITS });
    if (useSpecial) sets.push({ name: "special", chars: excludeAmbiguous ? SPECIAL.split("").filter(c => !AMBIGUOUS.includes(c)).join("") : SPECIAL });
    return sets;
  }, [useLower, useUpper, useDigits, useSpecial, excludeAmbiguous]);

  const generate = (opts?: { saveToHistory?: boolean }) => {
    if (charsetSize === 0) {
      setPassword("");
      return;
    }
    // if repeats not allowed and charsetSize < length -> cannot generate unique; fallback to allow repeats with a warning
    if (!allowRepeats && charsetSize < length) {
      // fallback: temporarily allow repeats (but notify)
      // We'll still generate but inform user
      console.warn("Charset smaller than length with repeats disallowed. Generating with repeats.");
    }

    // Strategy:
    // 1) If activeSets non-empty: pick at least 1 char from each active set to guarantee presence (up to length)
    // 2) Fill rest randomly from full charset
    // 3) Shuffle result

    const parts: string[] = [];

    // ensure each selected set contributes at least one char if length allows
    for (const s of activeSets) {
      if (parts.length < length) {
        const idx = secureRandomInt(s.chars.length);
        parts.push(s.chars[idx]);
      }
    }

    // remaining length
    const remaining = length - parts.length;
    for (let i = 0; i < remaining; i++) {
      if (!allowRepeats) {
        // choose char not already used if possible
        const available = charset.split("").filter(c => !parts.includes(c));
        const pickPool = available.length > 0 ? available : charset.split("");
        const idx = secureRandomInt(pickPool.length);
        parts.push(pickPool[idx]);
      } else {
        const idx = secureRandomInt(charset.length);
        parts.push(charset[idx]);
      }
    }

    // shuffle
    shuffleInPlace(parts);
    const pwd = parts.join("");
    setPassword(pwd);

    if (opts?.saveToHistory) {
      const newItem: HistoryItem = {
        id: cryptoRandomId(),
        password: pwd,
        timestamp: new Date().toISOString(),
        length,
        sets: activeSets.map(s => s.name),
      };
      setHistory(h => [newItem, ...h].slice(0, 100)); // keep last 100
    }
  };

  const cryptoRandomId = () => {
    const a = new Uint32Array(3);
    window.crypto.getRandomValues(a);
    return Array.from(a).map(n => n.toString(16)).join("-");
  };

  const copyToClipboard = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    // small friendly toast substitute (alert is blocking). We'll show small ephemeral UI instead of alert.
    showTempMessage("Copied to clipboard");
  };

  // transient small message
  const [msg, setMsg] = useState<string | null>(null);
  function showTempMessage(t: string, ms = 1400) {
    setMsg(t);
    setTimeout(() => setMsg(null), ms);
  }

  const saveCurrent = () => {
    if (!password) return showTempMessage("No password to save");
    const item: HistoryItem = {
      id: cryptoRandomId(),
      password,
      timestamp: new Date().toISOString(),
      length,
      sets: activeSets.map(s => s.name),
    };
    setHistory(h => [item, ...h]);
    showTempMessage("Saved to history");
  };

  const deleteFromHistory = (id: string) => {
    setHistory(h => h.filter(x => x.id !== id));
  };

  const reuseFromHistory = (p: string) => {
    setPassword(p);
    showTempMessage("Reused password");
  };

  const exportHistory = () => {
    if (!history.length) return showTempMessage("No history");
    const txt = history.map(h => `${h.timestamp}\t${h.password}\tlen:${h.length}\tsets:${h.sets.join(",")}`).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pw-history-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showTempMessage("History exported");
  };

  const clearHistory = () => {
    if (!confirm("Clear password history? This cannot be undone.")) return;
    setHistory([]);
    showTempMessage("History cleared");
  };

  // generate once on mount
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-black/80 flex items-start justify-center p-4 sm:p-6 font-Noto">
      <div className="w-full max-w-3xl">
        <div className="bg-[#12202a] rounded-2xl p-6 shadow-lg">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">Password Generator</h1>
          <p className="text-slate-300 text-sm mb-4">
            Create a secure password — choose length & character sets, then <strong>Generate</strong>. Use <em>Save</em> to keep in local history.
          </p>

            {/* Password display & actions */}
          <div className="mb-4">
            <div className="bg-white/6 rounded p-3 flex items-center gap-3">
              <div className="flex-1">
                <div className="text-white font-mono text-lg wrap-break-word select-all">{password || "— nothing generated —"}</div>
                <div className="text-slate-400 text-xs mt-1">Entropy: {entropyBits} bits — <span className={`${strength.color} px-2 py-0.5 rounded text-black text-xs`}>{strength.label}</span></div>
                <div className="w-full bg-white/10 h-2 rounded mt-2 overflow-hidden">
                  <div style={{ width: `${Math.min(100, (entropyBits / 100) * 100)}%` }} className={`${strength.color} h-full`} />
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button onClick={() => { generate({ saveToHistory: false }); showTempMessage("Regenerated"); }} className="px-3 py-2 bg-blue-500 rounded text-black font-semibold">Regenerate</button>
                <button onClick={copyToClipboard} className="px-3 py-2 bg-green-500 rounded text-black font-semibold">Copy</button>
                <button onClick={saveCurrent} className="px-3 py-2 bg-yellow-400 rounded text-black font-semibold">Save</button>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-white/5 p-4 rounded mb-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-300 text-sm block mb-1">Length: <span className="text-white font-bold">{length}</span></label>
                <input
                  aria-label="password length"
                  type="range"
                  min={4}
                  max={64}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-slate-300 text-sm block mb-1">Charset size: <span className="text-white font-bold">{charsetSize}</span></label>
                <div className="text-xs text-slate-400">Selected sets: {activeSets.map(s => s.name).join(", ") || "none"}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} /> lower (a-z)
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} /> upper (A-Z)
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" checked={useDigits} onChange={(e) => setUseDigits(e.target.checked)} /> digits (0-9)
              </label>
              <label className="flex items-center gap-2 text-white">
                <input type="checkbox" checked={useSpecial} onChange={(e) => setUseSpecial(e.target.checked)} /> special (!@#...)
              </label>
            </div>

            <div className="mt-3 flex gap-3 items-center">
              <label className="flex items-center gap-2 text-white text-sm">
                <input type="checkbox" checked={excludeAmbiguous} onChange={(e) => setExcludeAmbiguous(e.target.checked)} /> exclude ambiguous (i, l, 1, L, 0, O)
              </label>
              <label className="flex items-center gap-2 text-white text-sm">
                <input type="checkbox" checked={allowRepeats} onChange={(e) => setAllowRepeats(e.target.checked)} /> allow repeated characters
              </label>

              <div className="ml-auto flex gap-2">
                <button onClick={() => { setUseLower(true); setUseUpper(true); setUseDigits(true); setUseSpecial(true); setExcludeAmbiguous(true); setAllowRepeats(true); setLength(16); showTempMessage("Reset to recommended"); }} className="px-3 py-1 bg-white/10 rounded text-white">Reset</button>
                <button onClick={() => { generate({ saveToHistory: false }); showTempMessage("Generated"); }} className="px-3 py-1 bg-blue-600 rounded text-black font-semibold">Generate</button>
              </div>
            </div>
          </div>

          {/* History and controls */}
          <div className="bg-white/5 p-4 rounded">
            <div className="flex items-center justify-between mb-3">
              <div className="text-slate-300 text-sm font-semibold">History</div>
              <div className="flex gap-2">
                <button onClick={exportHistory} className="px-2 py-1 bg-green-500 rounded text-black text-sm">Export</button>
                <button onClick={clearHistory} className="px-2 py-1 bg-red-600 rounded text-black text-sm">Clear</button>
              </div>
            </div>

            {history.length === 0 && <div className="text-slate-400 text-sm">No saved passwords yet (save to keep them in local history).</div>}

            <div className="space-y-2 max-h-48 overflow-auto">
              {history.map(h => (
                <div key={h.id} className="flex items-center justify-between bg-white/10 p-2 rounded">
                  <div className="flex-1">
                    <div className="text-white font-mono text-sm wrap-break-word">{h.password}</div>
                    <div className="text-slate-400 text-xs">{new Date(h.timestamp).toLocaleString()} • {h.length} chars • sets: {h.sets.join(", ")}</div>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button onClick={() => { navigator.clipboard.writeText(h.password); showTempMessage("Copied"); }} className="px-2 py-1 bg-blue-500 rounded text-black text-sm">Copy</button>
                    <button onClick={() => reuseFromHistory(h.password)} className="px-2 py-1 bg-yellow-400 rounded text-black text-sm">Use</button>
                    <button onClick={() => deleteFromHistory(h.id)} className="px-2 py-1 bg-red-600 rounded text-black text-sm">Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* small ephemeral message */}
          {msg && <div className="fixed left-1/2 -translate-x-1/2 bottom-8 bg-black/80 text-white px-4 py-2 rounded shadow">{msg}</div>}
        </div>
      </div>
    </main>
  );
}
