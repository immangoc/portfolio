import { db } from "@/lib/db";
import type { Photo } from "@prisma/client";
import type { PortfolioImage, MoodTag } from "@/data/portfolio";

export function photoToPortfolioImage(photo: Photo): PortfolioImage {
  return {
    id: photo.id,
    src: photo.src,
    alt: photo.alt,
    width: photo.width,
    height: photo.height,
    blurDataURL: photo.blurDataURL ?? undefined,
    title: photo.title ?? undefined,
    location: photo.location ?? undefined,
    year: photo.year,
    mood: photo.mood as MoodTag[],
    camera: photo.camera ?? undefined,
    lens: photo.lens ?? undefined,
    iso: photo.iso ?? undefined,
    featured: photo.featured,
  };
}

export async function getPhotosByCategory(slug: string): Promise<PortfolioImage[]> {
  const photos = await db.photo.findMany({
    where: { categorySlug: slug },
    orderBy: { order: "asc" },
  });
  return photos.map(photoToPortfolioImage);
}

export async function getCategoryHeroImage(slug: string): Promise<string | null> {
  const cat = await db.category.findUnique({
    where: { slug },
    select: { heroImage: true },
  });
  return cat?.heroImage ?? null;
}

export async function getPhotoCounts(): Promise<Record<string, number>> {
  const groups = await db.photo.groupBy({
    by: ["categorySlug"],
    _count: true,
  });
  return Object.fromEntries(groups.map((g) => [g.categorySlug, g._count]));
}
