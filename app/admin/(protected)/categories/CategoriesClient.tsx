"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export interface CategoryData {
  slug: string;
  title: string;
  titleVi: string;
  description: string;
  heroImage: string | null;
  _count: { photos: number };
}

interface Props {
  categories: CategoryData[];
}

export function CategoriesClient({ categories }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  async function handleDelete(slug: string) {
    try {
      const res = await fetch(`/api/categories/${slug}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteSlug(null);
        startTransition(() => router.refresh());
      } else {
        alert("Failed to delete category");
      }
    } catch {
      alert("Network error");
    }
  }

  return (
    <div className="p-5 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.5em] text-champagne uppercase mb-2">
            Categories Management
          </p>
          <h1 className="text-3xl font-display text-ivory">Quản lý Danh mục</h1>
        </div>
        <Link
          href="/admin/categories/new"
          className="bg-champagne text-espresso px-4 py-2 text-xs uppercase tracking-widest font-medium hover:bg-white transition-colors text-center"
        >
          + Thêm Danh mục
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.slug}
            className="bg-[#15120e] border border-white/[0.08] hover:border-white/20 rounded-xl overflow-hidden flex flex-col transition-colors duration-300"
          >
            {/* Hero Image */}
            <div className="relative h-48 bg-white/[0.02]">
              {cat.heroImage ? (
                <Image
                  src={cat.heroImage}
                  alt={cat.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-ivory/20 text-xs">
                  No Image
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg text-ivory font-display">{cat.titleVi}</h3>
                  <span className="text-[10px] uppercase bg-white/[0.05] border border-white/10 px-2 py-1 rounded text-ivory/60">
                    {cat.slug}
                  </span>
                </div>
                <p className="text-xs text-ivory/40 mb-4 line-clamp-2">
                  {cat.description}
                </p>
                <p className="text-[10px] tracking-widest text-champagne uppercase">
                  {cat._count.photos} Photos
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center gap-3">
                <Link
                  href={`/admin/categories/${cat.slug}/edit`}
                  className="flex-1 py-2 text-center text-xs border border-white/10 rounded text-ivory/80 hover:text-ivory hover:border-white/30 transition-colors"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => setDeleteSlug(cat.slug)}
                  className="px-4 py-2 text-xs border border-rose-500/20 text-rose-400 rounded hover:bg-rose-500/10 hover:border-rose-500/40 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation modal */}
      {deleteSlug && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteSlug(null)}
        >
          <div
            className="bg-[#1a1410] border border-white/10 rounded-xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base text-ivory font-medium mb-2">Xác nhận xóa?</h3>
            <p className="text-xs text-ivory/40 mb-6">
              Hành động này sẽ xóa danh mục <strong>{deleteSlug}</strong> và toàn bộ ảnh thuộc danh mục này!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteSlug(null)}
                className="flex-1 py-2 text-xs border border-white/10 rounded text-ivory/60 hover:text-ivory"
                disabled={isPending}
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteSlug)}
                className="flex-1 py-2 text-xs bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded hover:bg-rose-500/30 disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? "Đang xóa..." : "Xóa ngay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
