import type { Metadata } from "next";
import { portfolioCategories, heroSlides as staticSlides } from "@/data/portfolio";
import { getCategoryHeroImage, photoToPortfolioImage } from "@/lib/queries";
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
  const [featuredDbPhotos, ...heroImages] = await Promise.all([
    db.photo.findMany({ where: { featured: true }, orderBy: { order: "asc" }, take: 8 }),
    ...portfolioCategories.map((cat) => getCategoryHeroImage(cat.slug)),
  ]);

  // Build categories with DB hero images (fallback to static)
  const categories = portfolioCategories.map((cat, i) => ({
    ...cat,
    heroImage: heroImages[i] ?? cat.heroImage,
  }));

  // Hero slides: use first photo of each category if available, else static slides
  const dbSlides = heroImages
    .map((url, i) =>
      url ? { src: url, alt: portfolioCategories[i].title } : null
    )
    .filter(Boolean) as { src: string; alt: string }[];

  const slides = dbSlides.length >= 2 ? dbSlides : staticSlides;

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
