"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<"counting" | "curtain" | "done">("counting");

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * 100);
      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setCount(100);
        setTimeout(() => setPhase("curtain"), 300);
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 1300);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      {phase === "counting" && (
        <motion.div
          key="loading"
          className="fixed inset-0 z-[9990] flex flex-col items-center justify-center bg-espresso"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Brand name */}
          <motion.p
            className="font-display text-sm tracking-[0.5em] text-champagne/60 uppercase mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Nguyệt Minh
          </motion.p>

          {/* Counter */}
          <motion.span
            className="font-display text-[8rem] leading-none text-ivory/10 tabular-nums select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {String(count).padStart(3, "0")}
          </motion.span>

          {/* Progress bar */}
          <div className="mt-12 w-48 h-px bg-ivory/10 overflow-hidden">
            <motion.div
              className="h-full bg-champagne origin-left"
              style={{ scaleX: count / 100 }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            />
          </div>
        </motion.div>
      )}

      {phase === "curtain" && (
        <>
          {/* Left curtain panel */}
          <motion.div
            key="curtain-left"
            className="fixed top-0 left-0 z-[9990] h-full w-1/2 bg-espresso"
            initial={{ x: 0 }}
            animate={{ x: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
          {/* Right curtain panel */}
          <motion.div
            key="curtain-right"
            className="fixed top-0 right-0 z-[9990] h-full w-1/2 bg-espresso"
            initial={{ x: 0 }}
            animate={{ x: "100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          />
        </>
      )}
    </AnimatePresence>
  );
}
