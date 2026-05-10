"use client";

import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  splitBy?: "chars" | "words" | "lines";
  once?: boolean;
}

export function RevealText({
  children,
  className,
  delay = 0,
  stagger = 0.04,
  as: Tag = "p",
  splitBy = "words",
  once = true,
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: "0px 0px -10% 0px",
  });

  const units =
    splitBy === "chars"
      ? children.split("")
      : splitBy === "words"
      ? children.split(" ")
      : [children];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      ref={ref as React.Ref<HTMLDivElement>}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={cn("overflow-hidden", className)}
      aria-label={children}
    >
      {units.map((unit, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            variants={itemVariants}
            className="inline-block"
          >
            {unit}
            {splitBy === "words" && i < units.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}
