"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface CategoryFormData {
  slug: string;
  title: string;
  titleVi: string;
  description: string;
  descriptionVi: string;
  heroImage: string | null;
  heroCloudId: string | null;
  accentColor: string;
  tone: string;
}

interface Props {
  initialData?: CategoryFormData;
  isEdit?: boolean;
}

export function CategoryForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>(
    initialData || {
      slug: "",
      title: "",
      titleVi: "",
      description: "",
      descriptionVi: "",
      heroImage: null,
      heroCloudId: null,
      accentColor: "#C9A961",
      tone: "Film Grain · Vintage",
    }
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialData?.heroImage || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save category data first
      const url = isEdit ? `/api/categories/${initialData!.slug}` : "/api/categories";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save category data");
      
      const savedCategory = await res.json();

      // 3. Upload image via PATCH if file is selected
      if (file) {
        const imageFormData = new FormData();
        imageFormData.append("heroImage", file);
        
        const uploadRes = await fetch(`/api/categories/${savedCategory.slug}`, {
          method: "PATCH",
          body: imageFormData,
        });

        if (!uploadRes.ok) throw new Error("Failed to upload image");
      }

      router.push("/admin/categories");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi lưu danh mục.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest text-champagne uppercase mb-2">
              Slug (URL)
            </label>
            <input
              required
              disabled={isEdit}
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
              placeholder="e.g. fashion-2024"
              className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-ivory outline-none focus:border-champagne disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-champagne uppercase mb-2">
              Title (English)
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-ivory outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-champagne uppercase mb-2">
              Title (Vietnamese)
            </label>
            <input
              required
              type="text"
              value={formData.titleVi}
              onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-ivory outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-champagne uppercase mb-2">
              Description (English)
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-ivory outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest text-champagne uppercase mb-2">
              Description (Vietnamese)
            </label>
            <textarea
              required
              rows={3}
              value={formData.descriptionVi}
              onChange={(e) => setFormData({ ...formData, descriptionVi: e.target.value })}
              className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-ivory outline-none focus:border-champagne"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-widest text-champagne uppercase mb-2">
                Accent Color
              </label>
              <input
                required
                type="text"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                placeholder="#C9A961"
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-ivory outline-none focus:border-champagne"
              />
            </div>
            <div>
              <label className="block text-[10px] tracking-widest text-champagne uppercase mb-2">
                Tone Keywords
              </label>
              <input
                required
                type="text"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                placeholder="Trắng Kem · Cinematic"
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg px-4 py-2 text-sm text-ivory outline-none focus:border-champagne"
              />
            </div>
          </div>
        </div>

        {/* Hero Image Upload */}
        <div>
          <label className="block text-[10px] tracking-widest text-champagne uppercase mb-2">
            Hero Image
          </label>
          <div
            className="border-2 border-dashed border-white/10 rounded-xl bg-white/[0.02] relative hover:bg-white/[0.04] transition-colors overflow-hidden flex items-center justify-center cursor-pointer aspect-[3/4]"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            {preview ? (
              <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
            ) : (
              <div className="text-center p-6 text-ivory/40">
                <p className="text-2xl mb-2">📷</p>
                <p className="text-xs">Click or drag image to upload</p>
                <p className="text-[10px] mt-1 opacity-60">Vertical (Portrait) recommended</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-white/10 text-sm tracking-widest uppercase text-ivory/60 hover:text-ivory rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-champagne text-espresso text-sm tracking-widest uppercase font-medium rounded-lg hover:bg-white transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Category"}
        </button>
      </div>
    </form>
  );
}
