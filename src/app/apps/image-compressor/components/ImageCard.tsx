"use client";

import React from "react";
import { ImageItem } from "../lib/compression";
import { prettyBytes } from "../lib/compression";

type Props = {
  item: ImageItem;
  onRemove: () => void;
  onCompress: () => void;
  onDownload: () => void;
};

export default function ImageCard({ item, onRemove, onCompress, onDownload }: Props) {
  return (
    <div className="border border-gray-300 bg-white text-black rounded-xl shadow-sm hover:shadow-md transition p-3 flex flex-col items-center">
      <img
        src={item.previewUrl}
        alt={item.name}
        className="w-full h-48 object-contain rounded mb-3 bg-gray-50"
      />

      <div className="text-center text-sm mb-2 w-full wrap-break-word">
        <p className="font-semibold">{item.name}</p>
        <p className="text-xs text-gray-600">
          {prettyBytes(item.originalSize)}
          {item.compressedSize
            ? ` → ${prettyBytes(item.compressedSize)}`
            : ""}
        </p>
        {item.progress && item.progress < 100 && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={onCompress}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          Compress
        </button>

        {item.compressedBlob && (
          <button
            onClick={onDownload}
            className="px-3 py-1 border border-gray-700 rounded hover:bg-gray-100 text-sm"
          >
            Download
          </button>
        )}

        <button
          onClick={onRemove}
          className="px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-50 text-sm"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
