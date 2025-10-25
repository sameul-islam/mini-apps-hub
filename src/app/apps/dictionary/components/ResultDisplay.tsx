"use client";

import React from "react";

type DictResult = {
  word: string;
  phonetics?: string[];
  meanings?: { partOfSpeech: string; definitions: { definition: string; example?: string }[] }[];
};

type Props = {
  result: DictResult;
  bengaliMap: Record<string, string>;
};

export default function ResultDisplay({ result, bengaliMap }: Props) {
  return (
    <div className="bg-neutral-900 p-4 rounded-md shadow-lg mt-4">
      <h2 className="text-2xl font-bold text-green-200">{result.word}</h2>
      {bengaliMap[result.word.toLowerCase()] && (
        <p className="text-green-300 mb-2">Bangla: {bengaliMap[result.word.toLowerCase()]}</p>
      )}
      {result.phonetics && <p className="text-green-400 italic mb-2">Phonetics: {result.phonetics.join(", ")}</p>}

      {result.meanings?.map((m, idx) => (
        <div key={idx} className="mb-3">
          <p className="text-green-500 font-semibold">{m.partOfSpeech}</p>
          <ul className="list-disc ml-5">
            {m.definitions.map((d, i) => (
              <li key={i}>
                {d.definition} {d.example && <span className="text-green-400 italic">({d.example})</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
