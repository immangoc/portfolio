"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PortfolioCategory } from "@/data/portfolio";
import { RevealText } from "@/components/ui/RevealText";

interface CategoryHeroProps {
  category: PortfolioCategory;
}

export function CategoryHero({ category }: CategoryHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div ref={ref} className="relative h-[70vh] md:h-[85vh] overflow-hidden">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        {category.heroImage ? (
          <Image
            src={category.heroImage}
            alt={category.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-espresso/50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/30 via-espresso/20 to-espresso/70" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-16 md:pb-24"
        style={{ opacity }}
      >
        {/* Breadcrumb */}
        <motion.p
          className="text-[10px] tracking-[0.4em] uppercase text-ivory/40 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Portfolio ／ {category.title}
        </motion.p>

        {/* Title */}
        <div className="overflow-hidden">
          <motion.h1
            className="font-display text-6xl md:text-8xl lg:text-9xl text-ivory leading-none"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {category.title}
          </motion.h1>
        </div>

        {/* Subtitle */}
        <div className="overflow-hidden mt-3">
          <motion.p
            className="font-display italic text-xl md:text-2xl text-ivory/60"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {category.titleVi}
          </motion.p>
        </div>

        {/* Tone badge */}
        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div
            className="w-6 h-px"
            style={{ background: category.accentColor }}
          />
          <p className="text-xs tracking-[0.3em] uppercase text-ivory/50">
            {category.tone}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
