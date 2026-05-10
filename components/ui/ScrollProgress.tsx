"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { motion } from "framer-motion";

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: progress, width: "100%" }}
    />
  );
}
