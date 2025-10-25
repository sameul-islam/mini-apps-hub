"use client";

import React, { useState, useEffect } from "react";
import SearchInput from "./components/SearchInput";
import ResultDisplay from "./components/ResultDisplay";

type DictResult = {
  word: string;
  phonetics?: string[];
  meanings?: { partOfSpeech: string; definitions: { definition: string; example?: string }[] }[];
};

const BENGALI_MAP: Record<string, string> = {
  apple: "আপেল",
  cat: "বিড়াল",
  dog: "কুকুর",
  banana: "কলা",
  book: "বই",
  house: "বাড়ি",
  // এখানে আরও শব্দ যোগ করতে পারো
};

export default function DictionaryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [result, setResult] = useState<DictResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("dict_history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const handleSearch = async (term: string) => {
    if (!term.trim()) return;
    setSearchTerm(term);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${term}`);
      if (!res.ok) throw new Error("Word not found");

      const data = await res.json();
      const first: any = data[0];

      setResult({
        word: first.word,
        phonetics: first.phonetics?.map((p: any) => p.text) || [],
        meanings: first.meanings?.map((m: any) => ({
          partOfSpeech: m.partOfSpeech,
          definitions: m.definitions.map((d: any) => ({ definition: d.definition, example: d.example })),
        })),
      });

      // update history
      const newHistory = [term, ...history.filter((w) => w !== term)].slice(0, 20);
      setHistory(newHistory);
      localStorage.setItem("dict_history", JSON.stringify(newHistory));

    } catch (err: any) {
      setError(err.message || "Could not fetch definition");
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-green-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-green-300 mb-6">English ↔ Bengali Dictionary</h1>

        <SearchInput
          value={searchTerm}
          onChange={(v) => setSearchTerm(v)}
          onSearch={() => handleSearch(searchTerm)}
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {result && <ResultDisplay result={result} bengaliMap={BENGALI_MAP} />}

        {history.length > 0 && (
          <div className="mt-6">
            <h2 className="text-green-400 font-semibold mb-2">Recent Searches:</h2>
            <div className="flex flex-wrap gap-2">
              {history.map((w) => (
                <button
                  key={w}
                  onClick={() => handleSearch(w)}
                  className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded text-green-100"
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
