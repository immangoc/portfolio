import type { Metadata } from "next";
import { heroSlides as staticSlides } from "@/data/portfolio";
import { photoToPortfolioImage } from "@/lib/queries";
import { db } from "@/lib/db";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategoryGrid } from "@/components/sections/CategoryGrid";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { StatsSection } from "@/components/sections/StatsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nguyễn Thị Nguyệt — Fine Art Photography Vietnam",
  description:
    "Vietnamese fine-art photographer. Áo Dài, Concept, Wedding & Kỷ Yếu photography. Cinematic, ethereal, luxury portraits.",
};

export default async function Home() {
  // Fetch all data in parallel
  const [featuredDbPhotos, heroSlidesDb, dbCategories] = await Promise.all([
    db.photo.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 8 }),
    db.heroSlide.findMany({ orderBy: { order: "asc" } }),
    db.category.findMany({ orderBy: { slug: "asc" } }),
  ]);

  // Build categories matching the PortfolioCategory interface format
  const categories = dbCategories.map(cat => ({
    ...cat,
    id: cat.slug as any,
    images: [] // images are not loaded eagerly on homepage to save bandwidth
  }));

  // Hero slides: use DB slides if available, else static slides
  const slides = heroSlidesDb.length > 0
    ? heroSlidesDb.map((s: { src: string; alt: string }) => ({ src: s.src, alt: s.alt }))
    : staticSlides;

  // Featured images: use DB photos if available
  const featuredImages =
    featuredDbPhotos.length > 0
      ? featuredDbPhotos.map(photoToPortfolioImage)
      : undefined;

  return (
    <>
      <HeroSection slides={slides} />
      <CategoryGrid categories={categories} />
      <FeaturedWork images={featuredImages} />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
