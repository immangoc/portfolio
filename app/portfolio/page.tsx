import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { getPhotoCounts } from "@/lib/queries";
import { RevealText } from "@/components/ui/RevealText";
import { Marquee } from "@/components/ui/Marquee";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore Nguyệt Minh's full portfolio: Áo Dài, Concept, Wedding & Kỷ Yếu photography collections.",
};

export default async function PortfolioPage() {
  const [counts, dbCategories] = await Promise.all([
    getPhotoCounts(),
    db.category.findMany({ orderBy: { slug: "asc" } }),
  ]);

  const categories = dbCategories.map((cat) => ({
    ...cat,
    id: cat.slug,
    count: counts[cat.slug] ?? 0,
  }));

  return (
    <>
      {/* Header */}
      <div className="pt-32 pb-16 px-6 md:px-16 bg-ivory">
        <p className="text-xs tracking-[0.4em] text-champagne uppercase mb-4">
          Collections
        </p>
        <RevealText
          as="h1"
          splitBy="words"
          className="font-display text-6xl md:text-8xl text-espresso leading-none"
        >
          Portfolio
        </RevealText>
        <p className="font-display italic text-xl text-bronze/60 mt-4">
          Bộ sưu tập nhiếp ảnh nghệ thuật
        </p>
      </div>

      {/* Marquee */}
      <div className="border-y border-bronze/20 py-3 bg-cream">
        <Marquee
          text="ÁO DÀI • NÀNG THƠ • CƯỚI • KỶ YẾU • FINE ART"
          className="text-xs tracking-[0.3em] text-bronze/40 font-display italic"
        />
      </div>

      {/* Category list — alternating layout */}
      {categories.map((cat, i) => (
        <Link key={cat.id} href={`/portfolio/${cat.slug}`}>
          <div
            className={`grid grid-cols-1 md:grid-cols-2 group cursor-pointer ${
              i % 2 === 0 ? "" : "md:[direction:rtl]"
            }`}
          >
            {/* Image */}
            <div className="relative h-[60vw] md:h-auto md:min-h-[60vh] overflow-hidden bg-espresso/5">
              {cat.heroImage ? (
                <Image
                  src={cat.heroImage}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105 [direction:ltr]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-champagne/30 [direction:ltr]">
                  <span className="text-6xl">📷</span>
                </div>
              )}
              <div className="absolute inset-0 bg-espresso/20 group-hover:bg-espresso/10 transition-colors duration-500" />
            </div>

            {/* Text */}
            <div
              className="flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 [direction:ltr]"
              style={{ background: i % 2 === 0 ? "#EFE8DC" : "#F5F1EA" }}
            >
              <p className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: cat.accentColor }}>
                {cat.tone}
              </p>
              <h2 className="font-display text-5xl md:text-6xl text-espresso mb-4 group-hover:text-champagne transition-colors duration-500">
                {cat.title}
              </h2>
              <p className="font-display italic text-lg text-bronze/60 mb-6">{cat.titleVi}</p>
              <p className="text-sm text-charcoal/60 leading-relaxed max-w-md mb-8">
                {cat.descriptionVi}
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs tracking-[0.2em] uppercase text-champagne">
                  View {cat.count} photographs
                </span>
                <span className="text-champagne transition-transform duration-300 group-hover:translate-x-2">→</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
