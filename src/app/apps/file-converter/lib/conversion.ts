// import { PDFDocument, rgb } from "pdf-lib";
// import mammoth from "mammoth";

// export type FileItem = {
//   id: string;
//   file: File;
//   name: string;
//   size: number;
//   previewUrl?: string;
//   convertedBlob?: Blob;
//   convertedName?: string;
//   progress?: number;
//   error?: string;
//   outputFormat?: string;
// };

// // Image conversion
// export const convertImage = async (
//   file: File,
//   format: "jpeg" | "png" | "webp" = "jpeg",
//   quality = 0.8,
//   maxEdge: number | "auto" = "auto"
// ): Promise<Blob> => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     const url = URL.createObjectURL(file);
//     img.onload = () => {
//       let width = img.width;
//       let height = img.height;
//       if (maxEdge !== "auto") {
//         const ratio = width > height ? maxEdge / width : maxEdge / height;
//         width = Math.round(width * ratio);
//         height = Math.round(height * ratio);
//       }
//       const canvas = document.createElement("canvas");
//       canvas.width = width;
//       canvas.height = height;
//       const ctx = canvas.getContext("2d")!;
//       ctx.drawImage(img, 0, 0, width, height);
//       canvas.toBlob(
//         (blob) => {
//           if (blob) resolve(blob);
//           else reject(new Error("Image conversion failed"));
//         },
//         `image/${format}`,
//         quality
//       );
//     };
//     img.onerror = (e) => reject(e);
//     img.src = url;
//   });
// };

// // Text to PDF
// export const textToPDF = async (file: File): Promise<Blob> => {
//   const text = await file.text();
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();
//   page.drawText(text, { x: 20, y: page.getHeight() - 40, size: 12, color: rgb(0, 0, 0) });
//   const pdfBytes = await pdfDoc.save();
//   return new Blob([pdfBytes], { type: "application/pdf" });
// };

// // DOCX to PDF
// export const docxToPDF = async (file: File): Promise<Blob> => {
//   const arrayBuffer = await file.arrayBuffer();
//   const result = await mammoth.extractRawText({ arrayBuffer });
//   const pdfDoc = await PDFDocument.create();
//   const page = pdfDoc.addPage();
//   page.drawText(result.value, { x: 20, y: page.getHeight() - 40, size: 12, color: rgb(0, 0, 0) });
//   const pdfBytes = await pdfDoc.save();
//   return new Blob([pdfBytes], { type: "application/pdf" });
// };

// // Batch conversion
// export const convertFileBatch = async (
//   items: FileItem[],
//   options: { format?: string; quality?: number; maxEdge?: number | "auto"; concurrency?: number } = {},
//   onProgress?: (id: string, patch: Partial<FileItem>) => void
// ): Promise<FileItem[]> => {
//   const results: FileItem[] = [];
//   const concurrency = options.concurrency || 3;
//   const queue = [...items];

//   const worker = async () => {
//     while (queue.length) {
//       const it = queue.shift()!;
//       try {
//         let blob: Blob | null = null;
//         const fmt = it.outputFormat || options.format || "jpeg";

//         if (it.file.type.startsWith("image/")) {
//           blob = await convertImage(it.file, fmt as any, options.quality || 0.8, options.maxEdge || "auto");
//         } else if (it.file.type === "text/plain") {
//           blob = await textToPDF(it.file);
//         } else if (it.file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
//           blob = await docxToPDF(it.file);
//         } else {
//           it.error = "Unsupported format";
//         }

//         if (blob) {
//           it.convertedBlob = blob;
//           it.convertedName = `${it.name.replace(/\.[^/.]+$/, "")}.${fmt === "jpeg" ? "jpg" : fmt}`;
//           onProgress?.(it.id, { convertedBlob: it.convertedBlob, convertedName: it.convertedName, progress: 100 });
//         }
//       } catch (e: any) {
//         it.error = e.message;
//         onProgress?.(it.id, { error: it.error });
//       }
//       results.push(it);
//     }
//   };

//   await Promise.all(Array(concurrency).fill(null).map(() => worker()));
//   return results;
// };
