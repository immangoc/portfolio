"use client";

import { usePathname } from "next/navigation";
import { useLenis } from "@/hooks/useLenis";

interface SmoothScrollProps {
  children: React.ReactNode;
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const pathname = usePathname();
  useLenis(pathname.startsWith("/admin"));
  return <>{children}</>;
}
