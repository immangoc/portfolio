"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { featuredImages as staticFeatured, PortfolioImage } from "@/data/portfolio";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { RevealText } from "@/components/ui/RevealText";
import { Marquee } from "@/components/ui/Marquee";

export function FeaturedWork({ images: imagesProp }: { images?: PortfolioImage[] } = {}) {
  const featuredImages = imagesProp && imagesProp.length > 0 ? imagesProp : staticFeatured;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section ref={sectionRef} className="py-24 bg-cream overflow-hidden">
      {/* Header */}
      <div className="px-6 md:px-16 mb-16">
        <motion.p
          className="text-xs tracking-[0.4em] text-champagne uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Selected Works
        </motion.p>
        <RevealText
          as="h2"
          splitBy="words"
          className="font-display text-4xl md:text-6xl text-espresso"
        >
          Featured photography
        </RevealText>
      </div>

      {/* Row 1 — moves left on scroll */}
      <motion.div style={{ x: x1 }} className="flex gap-4 md:gap-6 mb-4 md:mb-6 pl-6 md:pl-16">
        {featuredImages.slice(0, 4).map((img, i) => (
          <FeaturedCard
            key={img.id}
            image={img}
            index={i}
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </motion.div>

      {/* Row 2 — moves right on scroll */}
      <motion.div style={{ x: x2 }} className="flex gap-4 md:gap-6 pl-6 md:pl-8">
        {featuredImages.slice(4).map((img, i) => (
          <FeaturedCard
            key={img.id}
            image={img}
            index={i + 4}
            onClick={() => setLightboxIndex(i + 4)}
          />
        ))}
      </motion.div>

      {/* Marquee strip */}
      <div className="mt-16 border-t border-b border-bronze/20 py-4">
        <Marquee
          text="ÁODÀI • NANGTHO • CUOI • KYIEU • FINEART • VIETNAM"
          className="font-display italic text-xl text-bronze/30"
        />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={featuredImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function FeaturedCard({
  image,
  index,
  onClick,
}: {
  image: PortfolioImage;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="relative flex-shrink-0 overflow-hidden cursor-pointer group"
      style={{ width: index % 3 === 0 ? "360px" : "280px", height: "420px" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: (index % 4) * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      data-cursor-hover
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="360px"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/30 transition-colors duration-500" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="glass p-3 rounded-sm">
          {image.title && (
            <p className="font-display text-sm text-ivory">{image.title}</p>
          )}
          {image.location && (
            <p className="text-[10px] tracking-widest text-ivory/50 uppercase mt-1">
              {image.location}
            </p>
          )}
        </div>
      </div>

      {/* Zoom icon */}
      <div className="absolute top-4 right-4 w-8 h-8 bg-champagne/0 group-hover:bg-champagne/80 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
        <span className="text-espresso text-sm">+</span>
      </div>
    </motion.div>
  );
}
