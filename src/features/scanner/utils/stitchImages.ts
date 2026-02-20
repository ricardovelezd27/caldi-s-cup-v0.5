/**
 * Client-side canvas stitching utility.
 * Composites 1-4 base64 images into a single JPEG for the AI call,
 * keeping credit consumption at exactly 1 call per scan.
 */

const MAX_CELL_SIZE = 960;
const TARGET_MAX_SIZE = 1.5 * 1024 * 1024; // 1.5MB

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image for stitching"));
    img.src = src;
  });
}

function fitDimensions(
  imgW: number,
  imgH: number,
  cellW: number,
  cellH: number
): { dx: number; dy: number; dw: number; dh: number } {
  const scale = Math.min(cellW / imgW, cellH / imgH);
  const dw = Math.round(imgW * scale);
  const dh = Math.round(imgH * scale);
  const dx = Math.round((cellW - dw) / 2);
  const dy = Math.round((cellH - dh) / 2);
  return { dx, dy, dw, dh };
}

/**
 * Stitch 1-4 base64 images into a single composite JPEG.
 * - 1 image: pass-through (no stitching overhead)
 * - 2 images: 2×1 horizontal grid
 * - 3-4 images: 2×2 grid (blank cell if 3)
 */
export async function stitchImages(images: string[]): Promise<string> {
  if (images.length === 0) throw new Error("No images to stitch");
  if (images.length === 1) return images[0];

  const loaded = await Promise.all(images.map(loadImage));

  const cols = 2;
  const rows = images.length <= 2 ? 1 : 2;
  const cellW = MAX_CELL_SIZE;
  const cellH = MAX_CELL_SIZE;

  const canvas = document.createElement("canvas");
  canvas.width = cols * cellW;
  canvas.height = rows * cellH;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get canvas context");

  // Fill background with white
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  loaded.forEach((img, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const offsetX = col * cellW;
    const offsetY = row * cellH;
    const { dx, dy, dw, dh } = fitDimensions(img.width, img.height, cellW, cellH);
    ctx.drawImage(img, offsetX + dx, offsetY + dy, dw, dh);
  });

  // Compress to JPEG, iterating quality down if needed
  let quality = 0.85;
  let result = canvas.toDataURL("image/jpeg", quality);
  while (result.length > TARGET_MAX_SIZE && quality > 0.2) {
    quality -= 0.1;
    result = canvas.toDataURL("image/jpeg", quality);
  }

  return result;
}
