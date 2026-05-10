"use client";

import { useState, useRef, useCallback, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Category, Photo } from "@prisma/client";

const MOODS = ["ethereal", "romantic", "youthful", "cinematic", "traditional", "vintage"];

const defaultMeta = {
  alt: "",
  title: "",
  location: "",
  year: new Date().getFullYear(),
  mood: [] as string[],
  camera: "",
  lens: "",
  iso: "",
  featured: false,
};

type Meta = typeof defaultMeta;

interface SortablePhotoProps {
  photo: Photo;
  isHero: boolean;
  onEdit: (photo: Photo) => void;
  onDelete: (photo: Photo) => void;
  onToggleFeatured: (photo: Photo) => void;
  onSetHero: (photo: Photo) => void;
}

function SortablePhoto({ photo, isHero, onEdit, onDelete, onToggleFeatured, onSetHero }: SortablePhotoProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative bg-white/[0.04] border border-white/[0.06] rounded-lg overflow-hidden">
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 w-6 h-6 bg-black/50 rounded flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <span className="text-white/50 text-xs leading-none select-none">⠿</span>
      </div>

      {/* Badges */}
      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
        {isHero && (
          <div className="px-1.5 py-0.5 bg-bronze text-ivory text-[9px] tracking-widest uppercase rounded">
            Hero
          </div>
        )}
        {photo.featured && (
          <div className="px-1.5 py-0.5 bg-champagne text-espresso text-[9px] tracking-widest uppercase rounded">
            Featured
          </div>
        )}
      </div>

      {/* Image */}
      <div className="aspect-[3/4] relative bg-white/[0.02]">
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-ivory/70 truncate">{photo.title || photo.alt}</p>
        {photo.location && (
          <p className="text-[10px] text-ivory/30 truncate mt-0.5">{photo.location}</p>
        )}
      </div>

      {/* Actions */}
      <div className="px-3 pb-3 flex gap-1.5">
        <button
          onClick={() => onEdit(photo)}
          className="flex-1 py-1.5 text-[10px] tracking-widest uppercase text-ivory/40 hover:text-ivory border border-white/[0.06] hover:border-white/20 rounded transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onSetHero(photo)}
          title="Set as category hero image"
          className={`py-1.5 px-2 text-[10px] tracking-widest uppercase rounded transition-colors border ${
            isHero
              ? "border-bronze/50 text-bronze bg-bronze/10"
              : "border-white/[0.06] text-ivory/40 hover:text-bronze hover:border-bronze/30"
          }`}
        >
          ◈
        </button>
        <button
          onClick={() => onToggleFeatured(photo)}
          title="Toggle featured"
          className={`py-1.5 px-2 text-[10px] tracking-widest uppercase rounded transition-colors border ${
            photo.featured
              ? "border-champagne/40 text-champagne hover:bg-champagne/10"
              : "border-white/[0.06] text-ivory/40 hover:text-champagne hover:border-champagne/30"
          }`}
        >
          ★
        </button>
        <button
          onClick={() => onDelete(photo)}
          title="Delete"
          className="py-1.5 px-2 text-[10px] text-red-400/50 hover:text-red-400 border border-white/[0.06] hover:border-red-400/30 rounded transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

interface Props {
  categories: Category[];
  initialPhotos: Photo[];
  defaultCategory: string;
  heroMap: Record<string, string>; // slug → cloudinaryId of current hero
}

export function PhotosClient({ categories, initialPhotos, defaultCategory, heroMap: initialHeroMap }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [activeCategory, setActiveCategory] = useState(defaultCategory);
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [heroMap, setHeroMap] = useState<Record<string, string>>(initialHeroMap);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [meta, setMeta] = useState<Meta>(defaultMeta);
  const [editPhoto, setEditPhoto] = useState<Photo | null>(null);
  const [deletePhoto, setDeletePhoto] = useState<Photo | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const categoryPhotos = photos
    .filter((p) => p.categorySlug === activeCategory)
    .sort((a, b) => a.order - b.order);

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files.length) return;
      setPreviewFiles(files);
      setUploading(true);
      setUploadProgress(0);

      let done = 0;
      const results: Photo[] = [];

      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("categorySlug", activeCategory);
        fd.append("alt", meta.alt || file.name.replace(/\.[^.]+$/, ""));
        fd.append("title", meta.title);
        fd.append("location", meta.location);
        fd.append("year", String(meta.year));
        fd.append("mood", JSON.stringify(meta.mood));
        fd.append("camera", meta.camera);
        fd.append("lens", meta.lens);
        if (meta.iso) fd.append("iso", meta.iso);
        fd.append("featured", String(meta.featured));

        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.photo) results.push(data.photo);

        done++;
        setUploadProgress(Math.round((done / files.length) * 100));
      }

      setPhotos((prev) => [...prev, ...results]);
      setUploading(false);
      setPreviewFiles([]);
      setMeta(defaultMeta);
      showToast(`Uploaded ${results.length} photo${results.length > 1 ? "s" : ""}`);
      startTransition(() => router.refresh());
    },
    [activeCategory, meta, router]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    uploadFiles(files);
  }

  async function handleDelete(photo: Photo) {
    const res = await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });
    if (res.ok) {
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      setDeletePhoto(null);
      showToast("Photo deleted");
      startTransition(() => router.refresh());
    } else {
      showToast("Delete failed", "err");
    }
  }

  async function handleSaveEdit() {
    if (!editPhoto) return;
    const res = await fetch(`/api/photos/${editPhoto.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alt: editPhoto.alt,
        title: editPhoto.title,
        location: editPhoto.location,
        year: editPhoto.year,
        mood: editPhoto.mood,
        camera: editPhoto.camera,
        lens: editPhoto.lens,
        iso: editPhoto.iso,
        featured: editPhoto.featured,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setEditPhoto(null);
      showToast("Saved");
    } else {
      showToast("Save failed", "err");
    }
  }

  async function handleToggleFeatured(photo: Photo) {
    const res = await fetch(`/api/photos/${photo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !photo.featured }),
    });
    if (res.ok) {
      const updated = await res.json();
      setPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
  }

  async function handleSetHero(photo: Photo) {
    const res = await fetch(`/api/categories/${photo.categorySlug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ heroImage: photo.src, heroCloudId: photo.cloudinaryId }),
    });
    if (res.ok) {
      setHeroMap((prev) => ({ ...prev, [photo.categorySlug]: photo.cloudinaryId }));
      showToast("Hero image updated — refresh the site to see it");
      startTransition(() => router.refresh());
    } else {
      showToast("Failed to set hero", "err");
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categoryPhotos.findIndex((p) => p.id === active.id);
    const newIndex = categoryPhotos.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(categoryPhotos, oldIndex, newIndex);

    setPhotos((prev) => {
      const others = prev.filter((p) => p.categorySlug !== activeCategory);
      return [...others, ...reordered.map((p, i) => ({ ...p, order: i }))];
    });

    await fetch("/api/photos/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: reordered.map((p) => p.id) }),
    });
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* ── Left panel: upload + meta ── */}
      <div className="w-72 shrink-0 border-r border-white/[0.06] flex flex-col overflow-y-auto">
        <div className="p-6 border-b border-white/[0.06]">
          <p className="text-[10px] tracking-[0.45em] text-champagne uppercase mb-1">Upload</p>
          <p className="text-xs text-ivory/30">Drag files or click to select</p>
        </div>

        {/* Drop zone */}
        <div className="p-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-300 ${
              dragOver
                ? "border-champagne/60 bg-champagne/5"
                : "border-white/[0.1] hover:border-white/[0.2] bg-white/[0.02]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length) uploadFiles(files);
                e.target.value = "";
              }}
            />
            {uploading ? (
              <div>
                <div className="w-full bg-white/10 rounded-full h-1 mb-3">
                  <div
                    className="bg-champagne h-1 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-ivory/40">Uploading... {uploadProgress}%</p>
              </div>
            ) : previewFiles.length ? (
              <p className="text-xs text-ivory/50">{previewFiles.length} file(s) selected</p>
            ) : (
              <>
                <p className="text-2xl text-white/20 mb-2">+</p>
                <p className="text-xs text-ivory/30">Drop images here</p>
              </>
            )}
          </div>
        </div>

        {/* Metadata form */}
        <div className="px-4 pb-6 flex flex-col gap-4">
          <p className="text-[9px] tracking-[0.45em] text-ivory/25 uppercase">Metadata (optional)</p>

          {[
            { key: "alt", label: "Alt text", placeholder: "Describe the photo" },
            { key: "title", label: "Title · Tiêu đề", placeholder: "Xuân Thì" },
            { key: "location", label: "Location · Địa điểm", placeholder: "Đà Lạt" },
            { key: "camera", label: "Camera", placeholder: "Sony A7R V" },
            { key: "lens", label: "Lens", placeholder: "85mm f/1.4" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-1">
                {label}
              </label>
              <input
                type="text"
                value={(meta as Record<string, unknown>)[key] as string}
                placeholder={placeholder}
                onChange={(e) => setMeta((m) => ({ ...m, [key]: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-xs text-ivory/80 placeholder-ivory/20 outline-none focus:border-champagne/40 transition-colors"
              />
            </div>
          ))}

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-1">Year</label>
              <input
                type="number"
                value={meta.year}
                onChange={(e) => setMeta((m) => ({ ...m, year: parseInt(e.target.value) }))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-xs text-ivory/80 outline-none focus:border-champagne/40 transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-1">ISO</label>
              <input
                type="number"
                value={meta.iso}
                placeholder="100"
                onChange={(e) => setMeta((m) => ({ ...m, iso: e.target.value }))}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-xs text-ivory/80 placeholder-ivory/20 outline-none focus:border-champagne/40 transition-colors"
              />
            </div>
          </div>

          {/* Mood tags */}
          <div>
            <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-2">Mood</label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() =>
                    setMeta((prev) => ({
                      ...prev,
                      mood: prev.mood.includes(m)
                        ? prev.mood.filter((x) => x !== m)
                        : [...prev.mood, m],
                    }))
                  }
                  className={`px-2 py-1 text-[9px] rounded tracking-widest uppercase transition-colors ${
                    meta.mood.includes(m)
                      ? "bg-champagne/20 text-champagne border border-champagne/30"
                      : "bg-white/[0.04] text-ivory/30 border border-white/[0.06] hover:text-ivory/60"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Featured */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setMeta((m) => ({ ...m, featured: !m.featured }))}
              className={`w-8 h-4 rounded-full transition-colors duration-300 relative ${
                meta.featured ? "bg-champagne" : "bg-white/20"
              }`}
            >
              <span
                className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${
                  meta.featured ? "translate-x-4" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-[10px] text-ivory/40 uppercase tracking-widest">Featured</span>
          </label>
        </div>
      </div>

      {/* ── Right panel: photo grid ── */}
      <div className="flex-1 overflow-y-auto">
        {/* Category tabs */}
        <div className="sticky top-0 bg-[#0e0c0a] border-b border-white/[0.06] px-6 flex gap-1 z-10">
          {categories.map((cat) => {
            const count = photos.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`px-4 py-4 text-xs transition-colors relative whitespace-nowrap ${
                  activeCategory === cat.slug
                    ? "text-champagne"
                    : "text-ivory/35 hover:text-ivory/70"
                }`}
              >
                {cat.title}
                <span className="ml-1.5 text-[10px] opacity-50">({count})</span>
                {activeCategory === cat.slug && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-champagne" />
                )}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="p-6">
          {categoryPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="text-4xl text-white/10 mb-4">◉</p>
              <p className="text-sm text-ivory/25">No photos yet in this category</p>
              <p className="text-xs text-ivory/15 mt-1">Drop files in the left panel to upload</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={categoryPhotos.map((p) => p.id)} strategy={rectSortingStrategy}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoryPhotos.map((photo) => (
                    <SortablePhoto
                      key={photo.id}
                      photo={photo}
                      isHero={heroMap[photo.categorySlug] === photo.cloudinaryId}
                      onEdit={setEditPhoto}
                      onDelete={setDeletePhoto}
                      onToggleFeatured={handleToggleFeatured}
                      onSetHero={handleSetHero}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* ── Edit modal ── */}
      {editPhoto && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6" onClick={() => setEditPhoto(null)}>
          <div className="bg-[#1a1410] border border-white/[0.08] rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] tracking-[0.45em] text-champagne uppercase">Edit Photo</p>
              <button onClick={() => setEditPhoto(null)} className="text-ivory/30 hover:text-ivory text-lg leading-none">✕</button>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { key: "alt", label: "Alt text" },
                { key: "title", label: "Title · Tiêu đề" },
                { key: "location", label: "Location" },
                { key: "camera", label: "Camera" },
                { key: "lens", label: "Lens" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-1">{label}</label>
                  <input
                    type="text"
                    value={(editPhoto as Record<string, unknown>)[key] as string ?? ""}
                    onChange={(e) => setEditPhoto((p) => p ? { ...p, [key]: e.target.value } : p)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-sm text-ivory/80 outline-none focus:border-champagne/40 transition-colors"
                  />
                </div>
              ))}

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-1">Year</label>
                  <input
                    type="number"
                    value={editPhoto.year}
                    onChange={(e) => setEditPhoto((p) => p ? { ...p, year: parseInt(e.target.value) } : p)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-sm text-ivory/80 outline-none focus:border-champagne/40 transition-colors"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-1">ISO</label>
                  <input
                    type="number"
                    value={editPhoto.iso ?? ""}
                    onChange={(e) => setEditPhoto((p) => p ? { ...p, iso: parseInt(e.target.value) || null } : p)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-sm text-ivory/80 outline-none focus:border-champagne/40 transition-colors"
                  />
                </div>
              </div>

              {/* Mood */}
              <div>
                <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-2">Mood</label>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map((m) => (
                    <button
                      key={m}
                      onClick={() =>
                        setEditPhoto((p) =>
                          p
                            ? {
                                ...p,
                                mood: p.mood.includes(m)
                                  ? p.mood.filter((x) => x !== m)
                                  : [...p.mood, m],
                              }
                            : p
                        )
                      }
                      className={`px-2 py-1 text-[9px] rounded tracking-widest uppercase transition-colors ${
                        editPhoto.mood.includes(m)
                          ? "bg-champagne/20 text-champagne border border-champagne/30"
                          : "bg-white/[0.04] text-ivory/30 border border-white/[0.06] hover:text-ivory/60"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setEditPhoto((p) => p ? { ...p, featured: !p.featured } : p)}
                  className={`w-8 h-4 rounded-full transition-colors duration-300 relative ${editPhoto.featured ? "bg-champagne" : "bg-white/20"}`}
                >
                  <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${editPhoto.featured ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                <span className="text-[10px] text-ivory/40 uppercase tracking-widest">Featured</span>
              </label>

              <button
                onClick={handleSaveEdit}
                className="w-full py-3 bg-champagne text-espresso text-xs tracking-[0.3em] uppercase rounded hover:bg-champagne/80 transition-colors mt-2"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm modal ── */}
      {deletePhoto && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6" onClick={() => setDeletePhoto(null)}>
          <div className="bg-[#1a1410] border border-white/[0.08] rounded-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-ivory/80 mb-2">Delete this photo?</p>
            <p className="text-xs text-ivory/35 mb-6">
              &ldquo;{deletePhoto.title || deletePhoto.alt}&rdquo; sẽ bị xóa khỏi Cloudinary và database.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeletePhoto(null)} className="flex-1 py-2.5 text-xs text-ivory/40 border border-white/[0.08] rounded hover:text-ivory/80 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deletePhoto)} className="flex-1 py-2.5 text-xs text-red-400 border border-red-400/20 rounded hover:bg-red-400/10 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg text-xs tracking-wider ${
          toast.type === "ok" ? "bg-champagne text-espresso" : "bg-red-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
