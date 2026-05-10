"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PortfolioCategory, PortfolioImage } from "@/data/portfolio";
import { ImageLightbox } from "@/components/ui/ImageLightbox";
import { cn } from "@/lib/utils";

type Layout = "masonry" | "grid" | "slider";
type FilterYear = number | "all";

interface PortfolioGalleryProps {
  category: PortfolioCategory;
}

export function PortfolioGallery({ category }: PortfolioGalleryProps) {
  const [layout, setLayout] = useState<Layout>("masonry");
  const [filterYear, setFilterYear] = useState<FilterYear>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const years = Array.from(
    new Set(category.images.map((img) => img.year))
  ).sort((a, b) => b - a);

  const filtered = category.images.filter(
    (img) => filterYear === "all" || img.year === filterYear
  );

  const handleImageClick = useCallback(
    (img: PortfolioImage) => {
      const idx = filtered.indexOf(img);
      setLightboxIndex(idx);
    },
    [filtered]
  );

  return (
    <section className="py-20 px-6 md:px-16 bg-ivory min-h-screen">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-12">
        {/* Year filter */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setFilterYear("all")}
            className={cn(
              "text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300",
              filterYear === "all"
                ? "border-champagne bg-champagne text-espresso"
                : "border-bronze/30 text-bronze hover:border-champagne hover:text-champagne"
            )}
          >
            All
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setFilterYear(year)}
              className={cn(
                "text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-300",
                filterYear === year
                  ? "border-champagne bg-champagne text-espresso"
                  : "border-bronze/30 text-bronze hover:border-champagne hover:text-champagne"
              )}
            >
              {year}
            </button>
          ))}
        </div>

        {/* Layout toggle */}
        <div className="flex items-center gap-1">
          {(["masonry", "grid", "slider"] as Layout[]).map((l) => (
            <button
              key={l}
              onClick={() => setLayout(l)}
              className={cn(
                "px-3 py-2 text-xs tracking-widest uppercase transition-all duration-300",
                layout === l ? "text-champagne" : "text-bronze/40 hover:text-bronze"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${layout}-${filterYear}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {layout === "masonry" && (
            <MasonryLayout images={filtered} onImageClick={handleImageClick} />
          )}
          {layout === "grid" && (
            <GridLayout images={filtered} onImageClick={handleImageClick} />
          )}
          {layout === "slider" && (
            <SliderLayout images={filtered} onImageClick={handleImageClick} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Count */}
      <p className="mt-12 text-xs tracking-widest text-bronze/40 uppercase text-center">
        {filtered.length} photographs
      </p>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={filtered}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Masonry Layout ─────────────────────────────────────────────────────── */
function MasonryLayout({
  images,
  onImageClick,
}: {
  images: PortfolioImage[];
  onImageClick: (img: PortfolioImage) => void;
}) {
  const col1 = images.filter((_, i) => i % 3 === 0);
  const col2 = images.filter((_, i) => i % 3 === 1);
  const col3 = images.filter((_, i) => i % 3 === 2);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {[col1, col2, col3].map((col, ci) => (
        <div key={ci} className={cn("flex flex-col gap-4 md:gap-6", ci === 1 && "md:mt-12")}>
          {col.map((img, i) => (
            <GalleryImage
              key={img.id}
              image={img}
              index={ci * 10 + i}
              onClick={() => onImageClick(img)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Grid Layout ────────────────────────────────────────────────────────── */
function GridLayout({
  images,
  onImageClick,
}: {
  images: PortfolioImage[];
  onImageClick: (img: PortfolioImage) => void;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {images.map((img, i) => (
        <GalleryImage
          key={img.id}
          image={img}
          index={i}
          onClick={() => onImageClick(img)}
          className="aspect-[3/4]"
        />
      ))}
    </div>
  );
}

/* ── Slider Layout ──────────────────────────────────────────────────────── */
function SliderLayout({
  images,
  onImageClick,
}: {
  images: PortfolioImage[];
  onImageClick: (img: PortfolioImage) => void;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      {/* Main image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIdx}
          className="relative w-full h-[70vh] overflow-hidden cursor-pointer"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => onImageClick(images[activeIdx])}
        >
          <Image
            src={images[activeIdx].src}
            alt={images[activeIdx].alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          {images[activeIdx].title && (
            <div className="absolute bottom-6 left-6">
              <p className="font-display text-2xl text-ivory">
                {images[activeIdx].title}
              </p>
              {images[activeIdx].location && (
                <p className="text-xs tracking-widest text-ivory/50 uppercase mt-1">
                  {images[activeIdx].location}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActiveIdx(i)}
            className={cn(
              "relative flex-shrink-0 w-20 h-24 overflow-hidden transition-all duration-300",
              i === activeIdx
                ? "ring-1 ring-champagne opacity-100"
                : "opacity-50 hover:opacity-75"
            )}
          >
            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="80px" />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Single image card ──────────────────────────────────────────────────── */
function GalleryImage({
  image,
  index,
  onClick,
  className,
}: {
  image: PortfolioImage;
  index: number;
  onClick: () => void;
  className?: string;
}) {
  return (
    <motion.div
      className={cn("relative overflow-hidden cursor-pointer group", className)}
      style={{ aspectRatio: !className ? `${image.width}/${image.height}` : undefined }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: (index % 6) * 0.07,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={onClick}
      data-cursor-hover
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 50vw, 33vw"
        placeholder={image.blurDataURL ? "blur" : "empty"}
        blurDataURL={image.blurDataURL}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-espresso/0 group-hover:bg-espresso/25 transition-colors duration-500" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <div className="glass p-3">
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

      {/* Featured badge */}
      {image.featured && (
        <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-champagne rounded-full" />
      )}
    </motion.div>
  );
}
