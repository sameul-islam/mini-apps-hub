export type CompressOptions = {
  quality: number; // 0.1 - 1
  maxEdge: number | "auto";
  format: "auto" | "jpeg" | "png" | "webp";
  concurrency: number;
};

export interface ImageItem {
  id: string;
  file: File;
  compressedBlob?: Blob | null;
  compressedSize?: number | null;
  error?: string | null;
  progress?: number;
  // allow extra fields that callers may include (e.g., name, originalSize, etc.)
  [key: string]: any;
}

export type PatchFn = (id: string, patch: Partial<ImageItem>) => void;

// Helper: Convert bytes to readable format
export function prettyBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Compress a single image file
 */
export async function compressImage(
  file: File,
  options: CompressOptions
): Promise<Blob> {
  const { quality, maxEdge, format } = options;

  const bitmap = await createImageBitmap(file);
  let width = bitmap.width;
  let height = bitmap.height;

  // Resize according to maxEdge
  if (maxEdge !== "auto" && maxEdge > 0) {
    const ratio = width / height;
    if (width > height && width > maxEdge) {
      width = maxEdge;
      height = Math.round(maxEdge / ratio);
    } else if (height >= width && height > maxEdge) {
      height = maxEdge;
      width = Math.round(maxEdge * ratio);
    }
  }

  // Draw on canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(bitmap, 0, 0, width, height);

  // Determine output format
  let type = file.type;
  if (format !== "auto") {
    if (format === "jpeg") type = "image/jpeg";
    else if (format === "png") type = "image/png";
    else if (format === "webp") type = "image/webp";
  }

  // Convert canvas to blob
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error("Compression failed"));
      },
      type,
      quality
    );
  });

  return blob;
}

/**
 * Compress files in batch with concurrency control
 */
export async function compressFileBatch(
  items: ImageItem[],
  options: CompressOptions,
  onProgress: PatchFn
): Promise<ImageItem[]> {
  const queue = [...items];
  const result: ImageItem[] = [];
  let active = 0;

  return new Promise((resolve) => {
    const next = async () => {
      if (queue.length === 0 && active === 0) {
        resolve(result);
        return;
      }
      while (active < options.concurrency && queue.length > 0) {
        const item = queue.shift()!;
        active++;
        processItem(item).finally(() => {
          active--;
          next();
        });
      }
    };

    const processItem = async (item: ImageItem) => {
      try {
        onProgress(item.id, { progress: 20 });
        const blob = await compressImage(item.file, options);
        onProgress(item.id, { progress: 90 });
        const compressedSize = blob.size;
        result.push({
          ...item,
          compressedBlob: blob,
          compressedSize,
          error: null,
          progress: 100,
        });
        onProgress(item.id, {
          compressedBlob: blob,
          compressedSize,
          progress: 100,
        });
      } catch (err: any) {
        result.push({
          ...item,
          compressedBlob: null,
          compressedSize: null,
          error: err.message,
          progress: 0,
        });
        onProgress(item.id, { error: err.message, progress: 0 });
      }
    };

    next();
  });
}
