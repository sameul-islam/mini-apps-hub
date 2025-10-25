
"use client";

import { useState, useEffect } from "react";

type Color = { hex: string; r: number; g: number; b: number };

function generateColors(count: number): Color[] {
  const colors: Color[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
      .toString(16)
      .slice(1)}`;
    colors.push({ hex, r, g, b });
  }
  return colors;
}

export default function ColorPickerPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);

  useEffect(() => {
    setColors(generateColors(220));
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <main className="min-h-screen  flex flex-col bg-black/70 items-center p-4">
      <h1 className="text-2xl md:text-3xl border-b-2 font-bold mb-4 text-white">Advanced Color Picker</h1>

      <div className="grid w-full max-w-6xl gap-2 grid-cols-2 sm:grid-cols-4 md:grid-cols-8 lg:grid-cols-10">
        {colors.map((c, i) => (
          <div
            key={i}
            style={{ backgroundColor: c.hex }}
            className="aspect-square rounded cursor-pointer border border-gray-300 shadow-sm relative"
            title={`HEX: ${c.hex} | RGB(${c.r},${c.g},${c.b})`}
            onClick={() => setSelectedColor(c)}
          >
            <span className="absolute bottom-1 left-1 text-[10px] text-black/80 font-mono">
              {c.hex}
            </span>
          </div>
        ))}
      </div>

      {/* Color Preview Modal */}
      {selectedColor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-sm flex flex-col items-center gap-4">
            <div
              className="w-full h-40 rounded"
              style={{ backgroundColor: selectedColor.hex }}
            ></div>
            <p className="text-black font-mono">
              HEX: {selectedColor.hex}
            </p>
            <p className="text-black font-mono">
              RGB: ({selectedColor.r}, {selectedColor.g}, {selectedColor.b})
            </p>
            <div className="flex gap-2 w-full">
              <button
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                onClick={() => copyToClipboard(selectedColor.hex)}
              >
                Copy HEX
              </button>
              <button
                className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
                onClick={() =>
                  copyToClipboard(
                    `RGB(${selectedColor.r}, ${selectedColor.g}, ${selectedColor.b})`
                  )
                }
              >
                Copy RGB
              </button>
            </div>
            <button
              className="mt-2 text-black underline"
              onClick={() => setSelectedColor(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
