"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioImage } from "@/data/portfolio";
import { cn } from "@/lib/utils";

interface ImageLightboxProps {
  images: PortfolioImage[];
  initialIndex: number;
  onClose: () => void;
}

export function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const current = images[index];

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "30%" : "-30%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-30%" : "30%", opacity: 0 }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9950] flex items-center justify-center bg-espresso/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-6 right-6 z-10 text-ivory/60 hover:text-ivory transition-colors text-2xl font-display"
        onClick={onClose}
      >
        ✕
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 font-body text-xs tracking-widest text-ivory/40 uppercase">
        {index + 1} / {images.length}
      </div>

      {/* Image */}
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={index}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-h-[85vh] max-w-[85vw] flex items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={current.src}
            alt={current.alt}
            width={current.width}
            height={current.height}
            className="max-h-[85vh] w-auto object-contain rounded-sm shadow-2xl"
            priority
          />

          {/* Info panel toggle */}
          <button
            className="absolute bottom-4 right-4 glass rounded-full px-3 py-1 text-xs tracking-widest text-ivory/60 uppercase hover:text-ivory transition-colors"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? "Hide" : "Info"}
          </button>

          {/* EXIF info panel */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-56 glass p-6 flex flex-col gap-3 rounded-r-sm"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                {current.title && (
                  <div>
                    <p className="text-xs tracking-widest text-champagne/60 uppercase mb-1">Title</p>
                    <p className="font-display text-base text-ivory">{current.title}</p>
                  </div>
                )}
                {current.location && (
                  <div>
                    <p className="text-xs tracking-widest text-champagne/60 uppercase mb-1">Location</p>
                    <p className="text-sm text-ivory/80">{current.location}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs tracking-widest text-champagne/60 uppercase mb-1">Year</p>
                  <p className="text-sm text-ivory/80">{current.year}</p>
                </div>
                {current.camera && (
                  <div>
                    <p className="text-xs tracking-widest text-champagne/60 uppercase mb-1">Camera</p>
                    <p className="text-sm text-ivory/80">{current.camera}</p>
                  </div>
                )}
                {current.lens && (
                  <div>
                    <p className="text-xs tracking-widest text-champagne/60 uppercase mb-1">Lens</p>
                    <p className="text-sm text-ivory/80">{current.lens}</p>
                  </div>
                )}
                {current.iso && (
                  <div>
                    <p className="text-xs tracking-widest text-champagne/60 uppercase mb-1">ISO</p>
                    <p className="text-sm text-ivory/80">{current.iso}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-auto">
                  {current.mood.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] tracking-widest uppercase px-2 py-0.5 border border-champagne/30 text-champagne/60 rounded-full"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory transition-colors text-3xl font-display z-10 w-12 h-12 flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); prev(); }}
      >
        ‹
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-ivory/40 hover:text-ivory transition-colors text-3xl font-display z-10 w-12 h-12 flex items-center justify-center"
        onClick={(e) => { e.stopPropagation(); next(); }}
      >
        ›
      </button>
    </motion.div>
  );
}
