// "use client";

// import React, { useState, useRef, useEffect, useMemo } from "react";
// import FileUploader from "./components/FileUploader";
// import FileCard from "./components/FileCard";
// import { convertFileBatch, FileItem } from "./lib/conversion";
// import { saveAs } from "file-saver";
// import JSZip from "jszip";

// export default function FileConverterPage() {
//   const [files, setFiles] = useState<FileItem[]>([]);
//   const [targetFormat, setTargetFormat] = useState<string>("pdf");
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     return () => {
//       files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
//     };
//   }, [files]);

//   const addFiles = (newFiles: FileList | File[]) => {
//     const added = Array.from(newFiles).map((f) => ({
//       id: Math.random().toString(36).slice(2, 9),
//       file: f,
//       name: f.name,
//       size: f.size,
//       previewUrl: URL.createObjectURL(f),
//       convertedBlob: undefined,
//       convertedName: undefined,
//       error: undefined,
//       progress: 0,
//       outputFormat: targetFormat,
//     }));
//     setFiles((prev) => [...prev, ...added]);
//   };

//   const removeFile = (id: string) => {
//     setFiles((prev) => prev.filter((f) => f.id !== id));
//   };

//   const clearAll = () => {
//     files.forEach((f) => f.previewUrl && URL.revokeObjectURL(f.previewUrl));
//     setFiles([]);
//   };

//   const convertAll = async () => {
//     if (files.length === 0) return alert("Please add files first.");
//     const updated = await convertFileBatch(files, { format: targetFormat }, (id, patch) =>
//       setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
//     );
//     setFiles(updated);
//     alert("Conversion complete!");
//   };

//   const downloadAllZip = async () => {
//     const zip = new JSZip();
//     const folder = zip.folder("converted")!;
//     let any = false;
//     for (const f of files) {
//       if (f.convertedBlob) {
//         folder.file(f.convertedName || f.name, f.convertedBlob);
//         any = true;
//       }
//     }
//     if (!any) return alert("No converted files to download.");
//     const blob = await zip.generateAsync({ type: "blob" });
//     saveAs(blob, "converted_files.zip");
//   };

//   const totalSize = useMemo(() => files.reduce((sum, f) => sum + f.size, 0), [files]);

//   return (
//     <main className="flex flex-col items-center justify-start min-h-screen bg-white text-black p-6">
//       <div className="w-full max-w-3xl mx-auto text-center">
//         <h1 className="text-2xl font-bold mb-4">Universal File Converter</h1>
//         <FileUploader onFiles={addFiles} inputRef={inputRef} />
//         <div className="mt-4 flex flex-wrap justify-center items-center gap-3">
//           <label>
//             Convert to:
//             <select
//               value={targetFormat}
//               onChange={(e) => setTargetFormat(e.target.value)}
//               className="ml-2 border px-2 py-1 rounded"
//             >
//               <option value="pdf">PDF</option>
//               <option value="txt">TXT</option>
//               <option value="jpg">JPG</option>
//               <option value="png">PNG</option>
//               <option value="webp">WEBP</option>
//               <option value="docx">DOCX</option>
//             </select>
//           </label>
//           <button onClick={convertAll} className="px-4 py-2 bg-green-600 text-white rounded">
//             Convert All
//           </button>
//           <button onClick={downloadAllZip} className="px-4 py-2 border rounded">
//             Download ZIP
//           </button>
//           <button onClick={clearAll} className="px-4 py-2 border rounded text-red-600">
//             Clear All
//           </button>
//         </div>

//         <div className="mt-6 flex flex-wrap justify-center gap-4">
//           {files.map((f) => (
//             <FileCard
//               key={f.id}
//               item={f}
//               onRemove={() => removeFile(f.id)}
//               onDownload={() =>
//                 f.convertedBlob ? saveAs(f.convertedBlob, f.convertedName || f.name) : alert("Not converted yet.")
//               }
//             />
//           ))}
//         </div>

//         {files.length > 0 && (
//           <div className="mt-6 border-t pt-4 text-sm">
//             <div>Total Files: {files.length}</div>
//             <div>Total Size: {totalSize} bytes</div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
