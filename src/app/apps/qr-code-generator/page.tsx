"use client";

import { useState, useEffect } from "react";
import QRCode from "qrcode";

type QRType = "text" | "url" | "email" | "phone" | "sms" | "wifi";

type QRHistoryItem = {
  id: string;
  type: QRType;
  input: string;
  fgColor: string;
  bgColor: string;
  size: number;
  errorCorrection: "L" | "M" | "Q" | "H";
  margin: number;
  logo?: string;
  dataURL: string;
};

export default function UltimateQRCodeGenerator() {
  const [input, setInput] = useState("");
  const [qrType, setQRType] = useState<QRType>("text");
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [margin, setMargin] = useState(4);
  const [logo, setLogo] = useState<string | null>(null);
  const [qrDataURL, setQRDataURL] = useState("");
  const [history, setHistory] = useState<QRHistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("ultimate_qr_history_v1");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("ultimate_qr_history_v1", JSON.stringify(history));
  }, [history]);

  // Generate QR Code
  useEffect(() => {
    if (!input) return setQRDataURL("");

    let value = input;
    switch (qrType) {
      case "url":
        if (!/^https?:\/\//.test(input)) value = "https://" + input;
        break;
      case "email":
        value = `mailto:${input}`;
        break;
      case "phone":
        value = `tel:${input}`;
        break;
      case "sms":
        value = `sms:${input}`;
        break;
      case "wifi":
        const parts = input.split("|");
        if (parts.length === 3) {
          const [ssid, pass, encryption] = parts;
          value = `WIFI:T:${encryption};S:${ssid};P:${pass};;`;
        }
        break;
    }

    QRCode.toDataURL(value, {
      width: size,
      margin,
      color: { dark: fgColor, light: bgColor },
      errorCorrectionLevel: errorCorrection
    }).then(url => setQRDataURL(url));
  }, [input, qrType, fgColor, bgColor, size, errorCorrection, margin]);

  const saveToHistory = () => {
    if (!qrDataURL) return;
    const newItem: QRHistoryItem = {
      id: crypto.randomUUID(),
      type: qrType,
      input,
      fgColor,
      bgColor,
      size,
      errorCorrection,
      margin,
      logo: logo || undefined,
      dataURL: qrDataURL
    };
    setHistory([newItem, ...history]);
    alert("Saved to history!");
  };

  const downloadQR = (item: QRHistoryItem, format: "png" | "svg") => {
    const link = document.createElement("a");
    link.href = item.dataURL;
    link.download = `qr_${item.id}.${format}`;
    link.click();
  };

  const removeHistoryItem = (id: string) => {
    setHistory(h => h.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6 bg-black/80 font-Noto text-white">
      <h1 className="text-3xl font-bold mb-6">QR Code Generator</h1>

      <div className="w-full max-w-3xl bg-[#1e293b] p-6 rounded-xl shadow-lg flex flex-col gap-4">
        {/* QR Type */}
        <div className="flex gap-2 flex-wrap">
          {["text","url","email","phone","sms","wifi"].map(type => (
            <button
              key={type}
              onClick={()=>setQRType(type as QRType)}
              className={`px-3 py-2 rounded ${qrType===type ? "bg-green-500 text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Input */}
        <input
          type="text"
          value={input}
          onChange={e=>setInput(e.target.value)}
          placeholder={qrType==="wifi"?"SSID|Password|WPA":qrType==="sms"?"Phone number":qrType==="phone"?"Phone number":qrType==="email"?"Email":"Enter text/URL"}
          className="w-full px-4 py-2 rounded bg-white/10 text-white focus:outline-none focus:ring focus:ring-green-500"
        />

        {/* Customization */}
        <div className="flex flex-wrap gap-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Foreground</label>
            <input type="color" value={fgColor} onChange={e=>setFgColor(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Background</label>
            <input type="color" value={bgColor} onChange={e=>setBgColor(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Size (px)</label>
            <input type="number" value={size} onChange={e=>setSize(Number(e.target.value))} className="w-20 px-2 py-1 rounded bg-white/10 text-white" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Margin</label>
            <input type="number" value={margin} onChange={e=>setMargin(Number(e.target.value))} className="w-20 px-2 py-1 rounded bg-white/10 text-white"/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Error Correction</label>
            <select value={errorCorrection} onChange={e=>setErrorCorrection(e.target.value as any)} className="px-2 py-1 rounded bg-[#c4b4ff] text-black">
              <option value="L">L</option>
              <option value="M">M</option>
              <option value="Q">Q</option>
              <option value="H">H</option>
            </select>
          </div>
        </div>

        {/* Logo */}
        <div>
          <label className="text-sm text-slate-300 mb-1">Logo (optional)</label>
          <input type="file" accept="image/*" onChange={e=>{
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => setLogo(reader.result as string);
              reader.readAsDataURL(file);
            }
          }} className="text-sm text-white"/>
        </div>

        {/* QR Preview */}
        {qrDataURL && (
          <div className="flex flex-col items-center gap-2 mt-4">
            <img src={qrDataURL} alt="QR Code" className="border border-white/20 rounded" />
            <div className="flex gap-2 mt-2">
              <button onClick={()=>saveToHistory()} className="px-4 py-2 bg-green-500 text-black rounded">Save to History</button>
            </div>
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="w-full max-w-3xl mt-6 flex flex-col gap-3">
          <h2 className="text-xl font-semibold mb-2">History</h2>
          {history.map(item => (
            <div key={item.id} className="bg-[#1e293b] p-3 rounded flex justify-between items-center">
              <div className="flex-1">
                <div className="text-white font-semibold">{item.input}</div>
                <div className="text-sm text-slate-300">Type: {item.type.toUpperCase()}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={()=>downloadQR(item,"png")} className="px-2 py-1 bg-blue-500 rounded text-black">PNG</button>
                <button onClick={()=>downloadQR(item,"svg")} className="px-2 py-1 bg-purple-500 rounded text-black">SVG</button>
                <button onClick={()=>removeHistoryItem(item.id)} className="px-2 py-1 bg-red-600 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
