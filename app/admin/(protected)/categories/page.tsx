import { db } from "@/lib/db";
import { CategoriesClient } from "./CategoriesClient";

export const metadata = {
  title: "Categories — Admin Nguyệt Minh",
};

export default async function AdminCategoriesPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { photos: true } } },
    orderBy: { slug: "asc" },
  });

  return <CategoriesClient categories={categories} />;
}
