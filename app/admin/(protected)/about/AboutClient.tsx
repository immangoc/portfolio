"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface AboutData {
  photoUrl?: string | null;
  quote?: string | null;
  bio1?: string | null;
  bio2?: string | null;
  bio3?: string | null;
}

interface Milestone {
  id: string;
  year: string;
  title: string;
  titleVi: string;
  body: string;
  order: number;
}

const DEFAULTS: AboutData = {
  quote: "Tôi tin rằng mỗi người đều có một câu chuyện xứng đáng được kể — và ánh sáng là ngôn ngữ tôi dùng để kể những câu chuyện đó.",
  bio1: "Sinh ra tại Hà Nội, lớn lên giữa những con phố cổ và ánh đèn hội hè, tôi sớm học được rằng cái đẹp ẩn mình trong từng khoảnh khắc bình thường nhất.",
  bio2: "Sau hơn 6 năm cầm máy, từ những buổi sáng sớm trên ruộng bậc thang Mù Cang Chải đến những đêm khuya trong studio ở Sài Gòn, tôi hiểu rằng nhiếp ảnh không phải là việc bấm nút — mà là việc nhìn thấy linh hồn của người đứng trước ống kính.",
  bio3: "Chuyên môn của tôi là áo dài, portrait nghệ thuật, ảnh cưới, và kỷ yếu. Nhưng điều tôi thực sự làm là lưu giữ những khoảnh khắc mà bạn sẽ muốn nhìn lại mười năm sau và thấy mình trong đó.",
};

const BLANK_MILESTONE = { year: "", title: "", titleVi: "", body: "" };

export function AboutClient({
  initial,
  initialMilestones,
}: {
  initial: AboutData;
  initialMilestones: Milestone[];
}) {
  const router = useRouter();
  const photoRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<AboutData>({
    ...DEFAULTS,
    ...Object.fromEntries(Object.entries(initial).filter(([, v]) => v != null)),
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(initial.photoUrl ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [editing, setEditing] = useState<Record<string, Milestone>>({});
  const [newMs, setNewMs] = useState(BLANK_MILESTONE);
  const [addingNew, setAddingNew] = useState(false);
  const [msSaving, setMsSaving] = useState<string | null>(null);

  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handlePhotoChange(file: File) {
    setUploading(true);
    setPhotoPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("photo", file);
    const res = await fetch("/api/about", { method: "PATCH", body: fd });
    if (res.ok) {
      showToast("Ảnh đã cập nhật");
      router.refresh();
    } else {
      showToast("Upload thất bại", "err");
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/about", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote: data.quote, bio1: data.bio1, bio2: data.bio2, bio3: data.bio3 }),
    });
    if (res.ok) {
      showToast("Đã lưu");
      router.refresh();
    } else {
      showToast("Lưu thất bại", "err");
    }
    setSaving(false);
  }

  async function handleMsSave(id: string) {
    const ms = editing[id];
    if (!ms) return;
    setMsSaving(id);
    const res = await fetch(`/api/milestones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ms),
    });
    if (res.ok) {
      const updated = await res.json();
      setMilestones((prev) => prev.map((m) => (m.id === id ? updated : m)));
      setEditing((e) => { const n = { ...e }; delete n[id]; return n; });
      showToast("Đã lưu");
    } else {
      showToast("Lỗi lưu milestone", "err");
    }
    setMsSaving(null);
  }

  async function handleMsDelete(id: string) {
    if (!confirm("Xóa milestone này?")) return;
    const res = await fetch(`/api/milestones/${id}`, { method: "DELETE" });
    if (res.ok) {
      setMilestones((prev) => prev.filter((m) => m.id !== id));
      showToast("Đã xóa");
    } else {
      showToast("Lỗi xóa", "err");
    }
  }

  async function handleMsAdd() {
    if (!newMs.year || !newMs.title || !newMs.titleVi || !newMs.body) {
      showToast("Vui lòng điền đầy đủ", "err");
      return;
    }
    setMsSaving("new");
    const res = await fetch("/api/milestones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMs),
    });
    if (res.ok) {
      const created = await res.json();
      setMilestones((prev) => [...prev, created]);
      setNewMs(BLANK_MILESTONE);
      setAddingNew(false);
      showToast("Đã thêm");
    } else {
      showToast("Lỗi thêm milestone", "err");
    }
    setMsSaving(null);
  }

  const fieldCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded px-3 py-2 text-sm text-ivory/80 placeholder-ivory/20 outline-none focus:border-champagne/40 transition-colors";

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-10 space-y-8 md:space-y-10">
      <div>
        <p className="text-[10px] tracking-[0.45em] text-champagne uppercase mb-1">About</p>
        <p className="text-xs text-ivory/30">Chỉnh sửa nội dung trang Về Tôi</p>
      </div>

      {/* Profile photo */}
      <div>
        <p className="text-[9px] tracking-widest uppercase text-ivory/30 mb-3">Ảnh đại diện</p>
        <div className="flex items-start gap-5">
          <div
            className="relative w-32 h-40 rounded-lg overflow-hidden bg-white/[0.04] border border-white/[0.08] cursor-pointer hover:border-champagne/40 transition-colors shrink-0"
            onClick={() => photoRef.current?.click()}
          >
            {photoPreview ? (
              <Image src={photoPreview} alt="About photo" fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-ivory/20 text-2xl">+</div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-xs text-ivory/60">...</p>
              </div>
            )}
          </div>
          <div className="text-xs text-ivory/30 leading-relaxed pt-2">
            <p>Bấm vào ảnh để thay đổi.</p>
            <p className="mt-1 text-ivory/20">JPEG, PNG, WebP · Tối đa 20MB</p>
          </div>
        </div>
        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePhotoChange(file);
            e.target.value = "";
          }}
        />
      </div>

      {/* Quote */}
      <div>
        <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-2">Quote</label>
        <textarea
          rows={3}
          value={data.quote ?? ""}
          onChange={(e) => setData((d) => ({ ...d, quote: e.target.value }))}
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-4 py-3 text-sm text-ivory/80 placeholder-ivory/20 outline-none focus:border-champagne/40 transition-colors resize-none leading-relaxed"
        />
      </div>

      {/* Bio paragraphs */}
      {(["bio1", "bio2", "bio3"] as const).map((key, i) => (
        <div key={key}>
          <label className="text-[9px] tracking-widest uppercase text-ivory/30 block mb-2">
            Đoạn văn {i + 1}
          </label>
          <textarea
            rows={4}
            value={data[key] ?? ""}
            onChange={(e) => setData((d) => ({ ...d, [key]: e.target.value }))}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded px-4 py-3 text-sm text-ivory/80 placeholder-ivory/20 outline-none focus:border-champagne/40 transition-colors resize-none leading-relaxed"
          />
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-3 bg-champagne text-espresso text-xs tracking-[0.3em] uppercase rounded hover:bg-champagne/80 transition-colors disabled:opacity-50"
      >
        {saving ? "Đang lưu..." : "Lưu thay đổi"}
      </button>

      {/* Divider */}
      <div className="border-t border-white/[0.06]" />

      {/* Milestones */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[10px] tracking-[0.45em] text-champagne uppercase mb-1">Milestones</p>
            <p className="text-xs text-ivory/30">Các mốc sự kiện trong hành trình</p>
          </div>
          {!addingNew && (
            <button
              onClick={() => setAddingNew(true)}
              className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-champagne/30 text-champagne hover:bg-champagne/10 transition-colors rounded"
            >
              + Thêm mới
            </button>
          )}
        </div>

        <div className="space-y-4">
          {milestones.map((ms) => {
            const isEditing = !!editing[ms.id];
            const cur = editing[ms.id] ?? ms;
            return (
              <div key={ms.id} className="border border-white/[0.08] rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-display text-champagne/60 text-sm">{ms.year}</span>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleMsSave(ms.id)}
                          disabled={msSaving === ms.id}
                          className="text-[10px] tracking-widest uppercase px-3 py-1 bg-champagne text-espresso rounded hover:bg-champagne/80 disabled:opacity-50 transition-colors"
                        >
                          {msSaving === ms.id ? "..." : "Lưu"}
                        </button>
                        <button
                          onClick={() => setEditing((e) => { const n = { ...e }; delete n[ms.id]; return n; })}
                          className="text-[10px] tracking-widest uppercase px-3 py-1 border border-white/[0.08] text-ivory/40 rounded hover:text-ivory/70 transition-colors"
                        >
                          Huỷ
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditing((e) => ({ ...e, [ms.id]: { ...ms } }))}
                          className="text-[10px] tracking-widest uppercase px-3 py-1 border border-white/[0.08] text-ivory/40 rounded hover:border-champagne/30 hover:text-champagne transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleMsDelete(ms.id)}
                          className="text-[10px] tracking-widest uppercase px-3 py-1 border border-white/[0.08] text-ivory/30 rounded hover:border-red-500/40 hover:text-red-400 transition-colors"
                        >
                          Xóa
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      value={cur.year}
                      onChange={(e) => setEditing((ed) => ({ ...ed, [ms.id]: { ...cur, year: e.target.value } }))}
                      placeholder="Năm (vd: 2024)"
                      className={fieldCls}
                    />
                    <input
                      value={cur.title}
                      onChange={(e) => setEditing((ed) => ({ ...ed, [ms.id]: { ...cur, title: e.target.value } }))}
                      placeholder="Tiêu đề (EN)"
                      className={fieldCls}
                    />
                    <input
                      value={cur.titleVi}
                      onChange={(e) => setEditing((ed) => ({ ...ed, [ms.id]: { ...cur, titleVi: e.target.value } }))}
                      placeholder="Tiêu đề (VI)"
                      className={fieldCls}
                    />
                    <textarea
                      rows={3}
                      value={cur.body}
                      onChange={(e) => setEditing((ed) => ({ ...ed, [ms.id]: { ...cur, body: e.target.value } }))}
                      placeholder="Nội dung"
                      className={`${fieldCls} resize-none`}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-ivory/70">{ms.title} · <span className="text-ivory/40 italic">{ms.titleVi}</span></p>
                    <p className="text-xs text-ivory/40 mt-1 leading-relaxed">{ms.body}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add new form */}
          {addingNew && (
            <div className="border border-champagne/20 rounded-lg p-4 space-y-3">
              <p className="text-[9px] tracking-widest uppercase text-champagne/60">Milestone mới</p>
              <input
                value={newMs.year}
                onChange={(e) => setNewMs((n) => ({ ...n, year: e.target.value }))}
                placeholder="Năm (vd: 2025)"
                className={fieldCls}
              />
              <input
                value={newMs.title}
                onChange={(e) => setNewMs((n) => ({ ...n, title: e.target.value }))}
                placeholder="Tiêu đề (EN)"
                className={fieldCls}
              />
              <input
                value={newMs.titleVi}
                onChange={(e) => setNewMs((n) => ({ ...n, titleVi: e.target.value }))}
                placeholder="Tiêu đề (VI)"
                className={fieldCls}
              />
              <textarea
                rows={3}
                value={newMs.body}
                onChange={(e) => setNewMs((n) => ({ ...n, body: e.target.value }))}
                placeholder="Nội dung"
                className={`${fieldCls} resize-none`}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleMsAdd}
                  disabled={msSaving === "new"}
                  className="flex-1 py-2 bg-champagne text-espresso text-xs tracking-[0.3em] uppercase rounded hover:bg-champagne/80 disabled:opacity-50 transition-colors"
                >
                  {msSaving === "new" ? "Đang thêm..." : "Thêm"}
                </button>
                <button
                  onClick={() => { setAddingNew(false); setNewMs(BLANK_MILESTONE); }}
                  className="px-4 py-2 border border-white/[0.08] text-ivory/40 text-xs tracking-widest uppercase rounded hover:text-ivory/70 transition-colors"
                >
                  Huỷ
                </button>
              </div>
            </div>
          )}

          {milestones.length === 0 && !addingNew && (
            <p className="text-xs text-ivory/20 text-center py-8">Chưa có milestone nào. Bấm &ldquo;+ Thêm mới&rdquo; để tạo.</p>
          )}
        </div>
      </div>

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
