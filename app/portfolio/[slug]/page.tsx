import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPhotosByCategory, photoToPortfolioImage } from "@/lib/queries";
import { CategoryHero } from "@/components/sections/CategoryHero";
import { PortfolioGallery } from "@/components/sections/PortfolioGallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  });
  if (!category) return {};
  return {
    title: `${category.title} Portfolio`,
    description: category.description,
  };
}

export default async function DynamicCategoryPage({ params }: { params: { slug: string } }) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) notFound();

  const photos = await getPhotosByCategory(params.slug);

  const mappedCategory = {
    ...category,
    id: category.slug as any,
    images: photos,
  };

  return (
    <>
      <CategoryHero category={mappedCategory} />
      <PortfolioGallery category={mappedCategory} />
    </>
  );
}
