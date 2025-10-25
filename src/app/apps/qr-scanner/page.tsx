
"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ScanResult = {
  id: string;
  data: string;
  type: "url" | "phone" | "text" | "email" | "unknown";
  date: string;
};

export default function QRScanner() {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const scannerRef = useRef<HTMLDivElement>(null);
  const [scanning, setScanning] = useState(false);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);

  // Load history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("qr_scans_v2");
    if (saved) setScans(JSON.parse(saved));
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem("qr_scans_v2", JSON.stringify(scans));
  }, [scans]);

  const detectType = (text: string): ScanResult["type"] => {
    if (/^https?:\/\//.test(text)) return "url";
    if (/^\+?\d{7,15}$/.test(text)) return "phone";
    if (/^\S+@\S+\.\S+$/.test(text)) return "email";
    if (text.trim().length > 0) return "text";
    return "unknown";
  };

  const handleAction = (scan: ScanResult) => {
    switch (scan.type) {
      case "url":
        window.open(scan.data, "_blank");
        break;
      case "phone":
        window.open(`tel:${scan.data}`);
        break;
      case "email":
        window.open(`mailto:${scan.data}`);
        break;
      case "text":
        navigator.clipboard.writeText(scan.data);
        alert("Text copied to clipboard");
        break;
      default:
        alert(scan.data);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const deleteScan = (id: string) => setScans((prev) => prev.filter(s => s.id !== id));
  const clearAll = () => setScans([]);

  const startScanner = () => {
    if (!scannerRef.current) return;
    if (scanning) return; // Already scanning

    const qrCodeScanner = new Html5Qrcode(scannerRef.current.id);
    html5QrcodeRef.current = qrCodeScanner;

    qrCodeScanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        const type = detectType(decodedText);
        const newScan: ScanResult = {
          id: crypto.randomUUID(),
          data: decodedText,
          type,
          date: new Date().toISOString(),
        };
        setScans((prev) => [newScan, ...prev]);
        alert(`QR Scanned: ${decodedText}`);
        qrCodeScanner.stop();
        setScanning(false);
      },
      (errorMessage) => {}
    ).then(() => setScanning(true))
     .catch(err => alert("Camera not accessible: " + err));
  };

  const stopScanner = () => {
    if (html5QrcodeRef.current && scanning) {
      html5QrcodeRef.current.stop().then(() => {
        setScanning(false);
      });
    }
  };

  return (
    <main className="w-screen h-screen flex items-center justify-center bg-black/80 font-Noto">
      <div className="w-[96%] max-w-xl h-[80vh] p-6 bg-white border rounded-xl shadow-lg flex flex-col gap-4 overflow-hidden">
        <h1 className="text-2xl font-bold text-black text-center">QR Scanner</h1>
        <p className="text-black text-sm text-center">
          কোনো QR কোড স্ক্যান করতে নিচের <strong>Scan QR</strong> বাটন ক্লিক করুন।
        </p>

        {/* Scan Button */}
        <div className="flex justify-center">
          {!scanning ? (
            <button
              onClick={startScanner}
              className="px-4 py-2 bg-gray-200 text-black border border-black rounded hover:bg-gray-300 transition relative"
              title="Scan QR কোড শুরু করতে ক্লিক করুন"
            >
              Scan QR
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="px-4 py-2 bg-gray-200 text-black border border-black rounded hover:bg-gray-300 transition relative"
              title="QR স্ক্যান বন্ধ করতে ক্লিক করুন"
            >
              Stop Scanning
            </button>
          )}
        </div>

        {/* Scanner Container */}
        <div
          ref={scannerRef}
          id="qr-scanner"
          className="w-full flex-1 rounded border border-black mt-2"
        ></div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap justify-center">
          <button
            onClick={clearAll}
            className="px-3 py-2 bg-gray-200 text-black border border-black rounded hover:bg-gray-300 transition relative"
            title="Scan History সব মুছে ফেলতে ক্লিক করুন"
          >
            Clear History
          </button>
        </div>

        {/* Scan History */}
        <div className="flex-1 overflow-auto bg-white p-4 rounded-lg border border-black">
          <h2 className="text-xl font-semibold mb-2 text-black">Scan History</h2>
          {scans.length === 0 && <div className="text-black/60">No scans yet.</div>}
          {scans.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-1 bg-gray-100 p-2 rounded mb-2 border border-black"
            >
              <div className="break-all text-black">{s.data}</div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleAction(s)}
                  className="px-2 py-1 bg-gray-300 text-black border border-black rounded hover:bg-gray-400 transition relative"
                  title={`Action: ${s.type}`}
                >
                  {s.type === "url" ? "Open URL" :
                   s.type === "phone" ? "Call" :
                   s.type === "email" ? "Email" :
                   s.type === "text" ? "Copy Text" : "Show"}
                </button>
                <button
                  onClick={() => copyToClipboard(s.data)}
                  className="px-2 py-1 bg-gray-300 text-black border border-black rounded hover:bg-gray-400 transition"
                  title="Text Copy to Clipboard"
                >
                  Copy
                </button>
                <button
                  onClick={() => deleteScan(s.id)}
                  className="px-2 py-1 bg-gray-300 text-black border border-black rounded hover:bg-gray-400 transition"
                  title="Scan Delete করুন"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
