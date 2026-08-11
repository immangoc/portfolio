import { CategoryForm } from "@/components/admin/CategoryForm";

export const metadata = {
  title: "Thêm Danh mục mới — Admin Nguyệt Minh",
};

export default function NewCategoryPage() {
  return (
    <div className="p-5 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.5em] text-champagne uppercase mb-2">
          New Category
        </p>
        <h1 className="text-3xl font-display text-ivory">Thêm Danh mục</h1>
      </div>

      <CategoryForm />
    </div>
  );
}
