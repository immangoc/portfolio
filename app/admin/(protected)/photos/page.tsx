import { db } from "@/lib/db";
import { PhotosClient } from "./PhotosClient";

export default async function AdminPhotosPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [categories, photos, heroSlides] = await Promise.all([
    db.category.findMany({ orderBy: { slug: "asc" } }),
    db.photo.findMany({ orderBy: [{ categorySlug: "asc" }, { order: "asc" }] }),
    db.heroSlide.findMany({ orderBy: { order: "asc" } }),
  ]);

  // Map slug → cloudinaryId of current hero for each category
  const heroMap: Record<string, string> = {};
  for (const cat of categories) {
    if (cat.heroCloudId) heroMap[cat.slug] = cat.heroCloudId;
  }

  return (
    <PhotosClient
      categories={categories}
      initialPhotos={photos}
      defaultCategory={searchParams.category ?? categories[0]?.slug ?? "ao-dai"}
      heroMap={heroMap}
      initialSlides={heroSlides}
    />
  );
}
