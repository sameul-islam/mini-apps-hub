
"use client";

import React from "react";

type TableItem = { label: string; value: string };
type CalcResult = {
  title: string;
  summary: string;
  details?: string;
  table?: TableItem[];
};

export default function ResultDisplay({ result }: { result: CalcResult | null }) {
  if (!result) {
    return (
      <div className="bg-neutral-900/40 border border-green-800 rounded p-4 text-green-200">
        <div className="text-sm">Results will appear here. Use the left panel to compute molar mass, stoichiometry, balancing, and more.</div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/60 border border-green-800 rounded p-4 text-green-100">
      <h3 className="text-lg font-semibold text-green-300 mb-2">{result.title}</h3>
      <div className="mb-3 text-white font-medium">{result.summary}</div>
      {result.table && (
        <div className="space-y-1 mb-3">
          {result.table.map((r, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div className="text-green-200/80">{r.label}</div>
              <div className="text-green-100 font-semibold">{r.value}</div>
            </div>
          ))}
        </div>
      )}
      {result.details && (
        <pre className="text-xs text-green-200/80 bg-neutral-900/20 p-2 rounded overflow-auto whitespace-pre-wrap">{result.details}</pre>
      )}
    </div>
  );
}
