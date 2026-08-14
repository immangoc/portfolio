import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const easings = {
  easeExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  easeCirc: [0, 0.55, 0.45, 1] as [number, number, number, number],
  easeBack: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
  easeIn: [0.7, 0, 0.84, 0] as [number, number, number, number],
};

export async function compressImage(file: File): Promise<File> {
  const imageTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!imageTypes.includes(file.type)) {
    return file;
  }

  // Giới hạn 10MB bằng bytes
  const LIMIT_10MB = 10 * 1024 * 1024;

  // 1. Giữ nguyên 100% ảnh gốc nếu dung lượng dưới 10MB
  if (file.size <= LIMIT_10MB) {
    return file;
  }

  // 2. Chỉ nén tối thiểu đối với ảnh > 10MB (chất lượng cao 90%, độ phân giải max 3840px - 4K)
  const maxWidth = 3840;
  const maxQuality = 0.90;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let exportType = file.type;
        if (exportType === "image/png") {
          exportType = "image/jpeg";
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }
            const extension = exportType === "image/jpeg" ? ".jpg" : exportType === "image/webp" ? ".webp" : ".png";
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^.]+$/, "") + extension,
              {
                type: exportType,
                lastModified: Date.now(),
              }
            );

            if (compressedFile.size >= file.size) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          exportType,
          maxQuality
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
