import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata = {
  title: "Sửa Danh mục — Admin Nguyệt Minh",
};

export default async function EditCategoryPage({ params }: { params: { slug: string } }) {
  const category = await db.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) notFound();

  return (
    <div className="p-5 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.5em] text-champagne uppercase mb-2">
          Edit Category
        </p>
        <h1 className="text-3xl font-display text-ivory">Sửa Danh mục</h1>
      </div>

      <CategoryForm initialData={category} isEdit />
    </div>
  );
}
