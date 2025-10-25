"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import FileUploader from "./components/FileUploader";
import ImageCard from "./components/ImageCard";
import { compressFileBatch, prettyBytes } from "./lib/compression";
import type { ImageItem } from "./lib/compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";
function uid() {
  return Math.random().toString(36).slice(2, 9);
}


export default function Page() {
  const [items, setItems] = useState<ImageItem[]>([]);
  const [quality, setQuality] = useState<number>(0.8);
  const [maxEdge, setMaxEdge] = useState<number | "auto">("auto");
  const [format, setFormat] = useState<"auto" | "jpeg" | "png" | "webp">("auto");
  const [concurrency, setConcurrency] = useState<number>(3);
  const inputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    return () => {
      items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    };
  }, [items]);

  const addFiles = (files: FileList | File[]) => {
    const arr = Array.from(files).map(
      (f) =>
        ({
          id: uid(),
          file: f,
          name: f.name,
          originalSize: f.size,
          previewUrl: URL.createObjectURL(f),
          compressedBlob: null,
          compressedSize: null,
          error: null,
          progress: 0,
          outputFormat: format,
        } as ImageItem)
    );
    setItems((prev) => [...prev, ...arr]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) URL.revokeObjectURL(found.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
    setItems([]);
  };

  const compressAll = async () => {
    if (items.length === 0) {
      alert("Please add images first.");
      return;
    }

    setItems((prev) => prev.map((p) => ({ ...p, outputFormat: format })));
    const updated = await compressFileBatch(
      items,
      { quality, maxEdge, format, concurrency },
      (id, patch) => {
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
      }
    );
    setItems(updated);
    alert("Compression complete!");
  };

  const downloadSingle = (it: ImageItem) => {
    if (!it.compressedBlob) {
      alert("Please compress first.");
      return;
    }
    const ext = it.compressedBlob.type.split("/")[1] || "jpg";
    saveAs(it.compressedBlob, `${it.name.replace(/\.[^/.]+$/, "")}-compressed.${ext}`);
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    const folder = zip.folder("compressed")!;
    let any = false;
    for (const it of items) {
      if (it.compressedBlob) {
        const ext = it.compressedBlob.type.split("/")[1] || "jpg";
        folder.file(`${it.name.replace(/\.[^/.]+$/, "")}-compressed.${ext}`, it.compressedBlob);
        any = true;
      }
    }
    if (!any) {
      alert("No compressed images found.");
      return;
    }
    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, "compressed_images.zip");
  };

  const totals = useMemo(() => {
    const orig = items.reduce((s, i) => s + i.originalSize, 0);
    const comp = items.reduce((s, i) => s + (i.compressedSize || 0), 0);
    const saved = orig - comp;
    const percent = orig ? Math.round((saved / orig) * 100) : 0;
    return { orig, comp, saved, percent };
  }, [items]);

  return (
    <main className="min-h-screen w-[96%] md:w-[80%] mx-auto rounded-md flex flex-col items-center justify-start p-6 bg-white text-black font-Noto">
      <div className="max-w-5xl w-full flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Professional Image Compressor
        </h1>

        {/* File Uploader */}
        <FileUploader onFiles={addFiles} inputRef={inputRef} />

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mt-4 justify-center text-sm">
          <label>
            Quality:{" "}
            <strong>{Math.round(quality * 100)}%</strong>
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.01}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="ml-2 align-middle"
            />
          </label>

          <label>
            Max Edge (px):
            <input
              type="number"
              min={0}
              placeholder="auto"
              value={maxEdge === "auto" ? "" : String(maxEdge)}
              onChange={(e) =>
                setMaxEdge(e.target.value ? Number(e.target.value) : "auto")
              }
              className="w-20 ml-1 border px-1 py-0.5"
            />
          </label>

          <label>
            Format:
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="border px-1 py-0.5 ml-1"
            >
              <option value="auto">Auto</option>
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </label>

          <label>
            Concurrency:
            <input
              type="number"
              min={1}
              max={6}
              value={concurrency}
              onChange={(e) => setConcurrency(Number(e.target.value))}
              className="w-16 ml-1 border px-1 py-0.5"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-5 justify-center">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={compressAll}
          >
            Compress All
          </button>
          <button
            className="px-4 py-2 border rounded hover:bg-gray-100"
            onClick={downloadZip}
          >
            Download ZIP
          </button>
          <button
            className="px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50"
            onClick={clearAll}
          >
            Clear All
          </button>
        </div>

        {/* Image Cards */}
        <div className="mt-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {items.map((it) => (
            <ImageCard
              key={it.id}
              item={it}
              onRemove={() => removeItem(it.id)}
              onDownload={() => downloadSingle(it)}
              onCompress={() =>
                compressFileBatch([it], { quality, maxEdge, format, concurrency }, (id, patch) =>
                  setItems((prev) =>
                    prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
                  )
                )
              }
            />
          ))}
        </div>

        {/* Summary */}
        {items.length > 0 && (
          <aside className="mt-8 p-4 border rounded w-full max-w-lg text-center">
            <h3 className="font-semibold mb-2">Summary</h3>
            <div>Original Size: <strong>{prettyBytes(totals.orig)}</strong></div>
            <div>Compressed Size: <strong>{prettyBytes(totals.comp)}</strong></div>
            <div>
              Saved:{" "}
              <strong className="text-green-600">
                {prettyBytes(totals.saved)} ({totals.percent}%)
              </strong>
            </div>
          </aside>
        )}
      </div>

   {/* ======= Compression Summary Footer ======= */}
      <footer
        className="text-center border-t border-gray-300 mt-10 pt-4 pb-4"
        style={{
          backgroundColor: "white",
          color: "black",
          position: "relative",
          width: "100%",
        }}
      >
        <h2 className="text-lg font-semibold mb-1"> Compression Summary</h2>
        <div className="text-sm">
          Total Images: <strong>{items.length}</strong> &nbsp; | &nbsp;
          Original Size: <strong>{prettyBytes(totals.orig)}</strong> &nbsp; | &nbsp;
          Compressed Size: <strong>{prettyBytes(totals.comp)}</strong> &nbsp; | &nbsp;
          Saved:{" "}
          <strong style={{ color: "green" }}>
            {prettyBytes(totals.saved)} ({totals.percent}%)
          </strong>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Tip 💡 — Use <strong>WebP</strong> format for best results. <br />
          Compression completed safely — your files stay local on your device.
        </p>
      </footer>

    </main>
  );
}
