"use client";

import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
};

export default function SearchInput({ value, onChange, onSearch }: Props) {
  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        placeholder="Enter English word"
        className="flex-1 p-2 rounded-md bg-neutral-800 border border-green-700 text-green-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
      />
      <button
        onClick={onSearch}
        className="bg-green-600 px-4 py-2 rounded-md font-semibold hover:bg-green-500"
      >
        Search
      </button>
    </div>
  );
}
