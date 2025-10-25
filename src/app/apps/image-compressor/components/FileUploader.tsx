"use client";

import React, { RefObject } from "react";

type Props = {
  onFiles: (files: FileList | File[]) => void;
  inputRef: RefObject<HTMLInputElement>;
};

export default function FileUploader({ onFiles, inputRef }: Props) {
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFiles(files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFiles(files);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      className="w-full max-w-lg p-6 border-2 border-dashed border-gray-400 text-center rounded-xl bg-white text-black transition hover:border-black"
    >
      <p className="mb-2 text-lg font-semibold">Drag & Drop Images Here</p>
      <p className="text-sm mb-3">or</p>
      <button
        onClick={() => inputRef.current?.click()}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Select Images
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
