"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  text: string;
  className?: string;
  speed?: number;
  reverse?: boolean;
}

const REPEAT = 6;

export function Marquee({ text, className, speed = 30, reverse = false }: MarqueeProps) {
  const content = Array(REPEAT).fill(`${text} • `).join("");

  return (
    <div className={cn("marquee-container overflow-hidden select-none", className)}>
      <motion.div
        className="whitespace-nowrap"
        animate={{ x: reverse ? ["0%", "50%"] : ["0%", "-50%"] }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <span className="inline-block pr-4">{content}</span>
        <span className="inline-block pr-4">{content}</span>
      </motion.div>
    </div>
  );
}
