"use client";

import React from "react";

interface Props {
  size?: number;
  stroke?: number;
  progress: number; // 0..1
  label?: string;
}

export default function ProgressRing({ size = 120, stroke = 10, progress, label }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - progress * circumference;

  return (
    <div style={{ width: size, height: size }} className="flex items-center justify-center">
      <svg width={size} height={size}>
        <defs>
          <linearGradient id="g1" x1="0%" x2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#06d6a0" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#g1)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-white text-lg font-bold">{label}</div>
        <div className="text-slate-300 text-xs">Goal</div>
      </div>
    </div>
  );
}
