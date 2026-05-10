"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { heroSlides as staticSlides } from "@/data/portfolio";

type Slide = { src: string; alt: string };

export function HeroSection({ slides: slidesProp }: { slides?: Slide[] } = {}) {
  const heroSlides = slidesProp && slidesProp.length > 0 ? slidesProp : staticSlides;
  const [loaded, setLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hasLoaded = sessionStorage.getItem("site_loaded");
      if (hasLoaded) {
        setShowLoading(false);
        setLoaded(true);
      }
    }
  }, []);

  const handleLoadingComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("site_loaded", "true");
    }
    setLoaded(true);
    setShowLoading(false);
  };

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Auto-advance slides
  useEffect(() => {
    if (!loaded) return;
    const id = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(id);
  }, [loaded, heroSlides.length]);

  const titleChars = Array.from("Nguyệt Minh");

  return (
    <>
      {showLoading && <LoadingScreen onComplete={handleLoadingComplete} />}

      <section
        ref={containerRef}
        className="relative h-screen w-full overflow-hidden bg-espresso"
      >
        {/* Background images with Ken Burns */}
        <AnimatePresence mode="sync">
          <motion.div
            key={currentSlide}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1.12 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.5 }, scale: { duration: 8, ease: "linear" } }}
          >
            <Image
              src={heroSlides[currentSlide].src}
              alt={heroSlides[currentSlide].alt}
              fill
              className="object-cover"
              priority={currentSlide === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/10 via-transparent to-espresso/70" />
        <div className="absolute inset-0 bg-espresso/20" />

        {/* Content */}
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
          style={{ y, opacity }}
        >
          {loaded && (
            <>
              {/* Photographer name — staggered char reveal */}
              <div className="overflow-hidden mb-4">
                <div className="flex justify-center flex-wrap gap-[1px] pb-3">
                  {titleChars.map((char, i) => (
                    <motion.span
                      key={i}
                      className="font-display text-5xl md:text-7xl lg:text-8xl text-ivory"
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{ y: "0%", opacity: 1 }}
                      transition={{
                        delay: 0.1 + i * 0.05,
                        duration: 0.8,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {char === " " ? " " : char}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Tagline */}
              <div className="overflow-hidden">
                <motion.p
                  className="font-display italic text-lg md:text-xl text-ivory/70 tracking-wide"
                  initial={{ y: "110%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  Lưu giữ khoảnh khắc — Kể chuyện bằng ánh sáng
                </motion.p>
              </div>

              {/* Divider line */}
              <motion.div
                className="w-px h-16 bg-champagne/50 mt-10"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 1.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </>
          )}
        </motion.div>

        {/* Scroll indicator */}
        {loaded && (
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
          >
            <span className="text-[9px] tracking-[0.4em] text-ivory/40 uppercase">
              Scroll
            </span>
            <div className="w-px h-10 overflow-hidden bg-ivory/20">
              <motion.div
                className="w-full bg-champagne"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                style={{ height: "50%" }}
              />
            </div>
          </motion.div>
        )}

        {/* Slide indicators */}
        {loaded && (
          <div className="absolute bottom-8 right-8 z-10 flex gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`transition-all duration-500 ${
                  i === currentSlide
                    ? "w-6 h-px bg-champagne"
                    : "w-2 h-px bg-ivory/30 hover:bg-ivory/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Bottom-left label */}
        {loaded && (
          <motion.div
            className="absolute bottom-8 left-8 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <p className="text-[10px] tracking-[0.35em] text-ivory/30 uppercase">
              Fine Art Photography
            </p>
          </motion.div>
        )}
      </section>
    </>
  );
}
