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
