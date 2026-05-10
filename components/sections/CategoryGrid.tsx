"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { portfolioCategories as staticCategories, PortfolioCategory } from "@/data/portfolio";
import { RevealText } from "@/components/ui/RevealText";
import { useInView } from "@/hooks/useInView";

const GRID_CONFIG = [
  { colSpan: "md:col-span-3 md:row-span-2", aspect: "aspect-[3/4]" },
  { colSpan: "md:col-span-2 md:row-span-1", aspect: "aspect-[4/3]" },
  { colSpan: "md:col-span-2 md:row-span-1", aspect: "aspect-[4/3]" },
  { colSpan: "md:col-span-3 md:row-span-1", aspect: "aspect-[16/9]" },
];

export function CategoryGrid({ categories: categoriesProp }: { categories?: PortfolioCategory[] } = {}) {
  const portfolioCategories = categoriesProp && categoriesProp.length > 0 ? categoriesProp : staticCategories;
  const { ref, inView } = useInView({ threshold: 0.1 });

  return (
    <section className="py-24 md:py-36 px-6 md:px-16 bg-ivory">
      {/* Section header */}
      <div className="mb-16 max-w-2xl">
        <motion.p
          className="text-xs tracking-[0.4em] text-champagne uppercase mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Collections
        </motion.p>
        <RevealText
          as="h2"
          splitBy="words"
          className="font-display text-4xl md:text-6xl text-espresso leading-tight"
        >
          Stories told through light
        </RevealText>
        <motion.p
          className="font-display italic text-lg text-bronze/70 mt-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Những câu chuyện được kể qua ánh sáng
        </motion.p>
      </div>

      {/* Asymmetric grid */}
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="grid grid-cols-5 gap-4 md:gap-6 auto-rows-[280px]"
      >
        {portfolioCategories.map((category, i) => (
          <CategoryCard
            key={category.id}
            category={category}
            config={GRID_CONFIG[i]}
            index={i}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
}

function CategoryCard({
  category,
  config,
  index,
  inView,
}: {
  category: PortfolioCategory;
  config: { colSpan: string; aspect: string };
  index: number;
  inView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [4, -4]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-4, 4]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mouseX.set((e.clientX - cx) / (rect.width / 2));
    mouseY.set((e.clientY - cy) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`${config.colSpan} col-span-5`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="w-full h-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={`/portfolio/${category.slug}`} className="block w-full h-full group">
          <div className="relative w-full h-full overflow-hidden">
            {/* Image */}
            <Image
              src={category.heroImage}
              alt={category.title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 60vw"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-espresso/10 to-transparent transition-opacity duration-500 group-hover:opacity-80" />

            {/* Accent color strip */}
            <div
              className="absolute top-0 left-0 right-0 h-px transition-all duration-500 origin-left group-hover:opacity-100 opacity-0"
              style={{ background: category.accentColor }}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              {/* Category label */}
              <motion.div className="overflow-hidden">
                <motion.p
                  className="text-[10px] tracking-[0.4em] uppercase mb-2 transition-colors duration-300"
                  style={{ color: category.accentColor }}
                  initial={{ y: "100%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  {category.tone}
                </motion.p>
              </motion.div>

              <h3 className="font-display text-3xl md:text-4xl text-ivory transition-transform duration-500 group-hover:-translate-y-1">
                {category.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-ivory/70 mt-2 max-w-xs">
                {category.descriptionVi}
              </p>

              {/* CTA arrow */}
              <div className="flex items-center gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                <span className="text-xs tracking-widest uppercase text-champagne">
                  View collection
                </span>
                <motion.span
                  className="text-champagne"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </div>

            {/* Image count badge */}
            <div className="absolute top-4 right-4 glass px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] tracking-widest text-ivory/60">
                {category.images.length} photos
              </span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
