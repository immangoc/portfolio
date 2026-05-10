import type { Metadata } from "next";
import { portfolioCategories } from "@/data/portfolio";
import { getPhotosByCategory, getCategoryHeroImage } from "@/lib/queries";
import { CategoryHero } from "@/components/sections/CategoryHero";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";
import { CTASection } from "@/components/sections/CTASection";

export const dynamic = "force-dynamic";

const staticCategory = portfolioCategories.find((c) => c.id === "ky-yeu")!;

export const metadata: Metadata = {
  title: "Kỷ Yếu — Graduation Photography",
  description:
    "Vietnamese graduation & yearbook photography. Youth captured in golden light.",
  openGraph: { images: [{ url: staticCategory.heroImage }] },
};

export default async function KyYeuPage() {
  const [dbPhotos, dbHero] = await Promise.all([
    getPhotosByCategory("ky-yeu"),
    getCategoryHeroImage("ky-yeu"),
  ]);

  const category = {
    ...staticCategory,
    heroImage: dbHero ?? staticCategory.heroImage,
    images: dbPhotos.length > 0 ? dbPhotos : staticCategory.images,
  };

  return (
    <>
      <CategoryHero category={category} />
      <div className="px-6 md:px-16 py-16 bg-ivory max-w-3xl">
        <p className="font-display text-2xl text-espresso leading-relaxed italic mb-4">
          &ldquo;{category.descriptionVi}&rdquo;
        </p>
        <p className="text-sm text-charcoal/50 leading-relaxed">{category.description}</p>
      </div>
      <PortfolioGallery category={category} />
      <CTASection />
    </>
  );
}
