"use client";

import { useLenis } from "@/hooks/useLenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  useLenis();
  return <>{children}</>;
}
