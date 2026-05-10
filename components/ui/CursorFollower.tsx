"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorFollower() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const ringX = useSpring(dotX, { stiffness: 120, damping: 18 });
  const ringY = useSpring(dotY, { stiffness: 120, damping: 18 });

  const isHovering = useRef(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    const moveCursor = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    };

    const addHover = () => {
      isHovering.current = true;
      ringRef.current?.classList.add("scale-150", "opacity-40");
      dotRef.current?.classList.add("scale-150");
    };

    const removeHover = () => {
      isHovering.current = false;
      ringRef.current?.classList.remove("scale-150", "opacity-40");
      dotRef.current?.classList.remove("scale-150");
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });

    const interactives = document.querySelectorAll(
      "a, button, [data-cursor-hover], input, textarea, select, label"
    );
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
    };
  }, [dotX, dotY]);

  return (
    <>
      {/* Outer ring — follows with spring delay */}
      <motion.div
        ref={ringRef}
        className="pointer-events-none fixed z-[9999] rounded-full border border-champagne/60 transition-all duration-300"
        style={{
          width: 36,
          height: 36,
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {/* Inner dot — snaps directly to cursor */}
      <motion.div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] rounded-full bg-champagne transition-all duration-150"
        style={{
          width: 6,
          height: 6,
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
    </>
  );
}
