// "use client";

// import React, { ChangeEvent, RefObject } from "react";

// type Props = {
//   onFiles: (files: FileList | File[]) => void;
//   inputRef?: React.RefObject<HTMLInputElement>;
// };

// export default function FileUploader({ onFiles, inputRef }: Props) {
//   const handleFiles = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) onFiles(e.target.files);
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     if (e.dataTransfer.files) onFiles(e.dataTransfer.files);
//   };

//   return (
//     <div
//       className="border-dashed border-2 border-gray-400 p-6 rounded cursor-pointer hover:border-gray-600 transition-colors"
//       onDragOver={handleDragOver}
//       onDrop={handleDrop}
//       onClick={() => inputRef?.current?.click()}
//     >
//       <input
//         type="file"
//         multiple
//         onChange={(e) => e.target.files && onFiles(e.target.files)}
//         ref={inputRef}
//         className="hidden"
//       />
//       <p>Drag & drop files here or click to select</p>
//     </div>
//   );
// }
