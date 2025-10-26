// "use client";

// import React from "react";
// import { FileItem } from "../lib/conversion";
// import { saveAs } from "file-saver";

// type Props = {
//   item: FileItem;
//   onRemove: () => void;
//   onDownload: () => void;
// };

// export default function FileCard({ item, onRemove, onDownload }: Props) {
//   return (
//     <div className="border rounded p-3 w-60 flex flex-col items-center">
//       {item.previewUrl && item.file.type.startsWith("image/") && (
//         <img src={item.previewUrl} alt={item.name} className="w-full h-32 object-contain mb-2" />
//       )}
//       <div className="text-sm font-medium mb-1 truncate">{item.name}</div>
//       <div className="text-xs mb-1">
//         Size: {item.size} bytes
//         {item.convertedBlob && <span className="text-green-600 ml-1">Converted</span>}
//         {item.error && <span className="text-red-600 ml-1">{item.error}</span>}
//       </div>
//       <div className="flex gap-2 mt-2">
//         <button
//           onClick={onDownload}
//           className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
//         >
//           Download
//         </button>
//         <button
//           onClick={onRemove}
//           className="px-2 py-1 bg-red-600 text-white rounded text-xs"
//         >
//           Remove
//         </button>
//       </div>
//       {item.progress !== undefined && (
//         <div className="w-full h-2 bg-gray-300 mt-2 rounded">
//           <div
//             className="h-2 bg-green-600 rounded"
//             style={{ width: `${item.progress}%` }}
//           ></div>
//         </div>
//       )}
//     </div>
//   );
// }
