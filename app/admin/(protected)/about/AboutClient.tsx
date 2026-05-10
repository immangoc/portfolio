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

const DEFAULTS: AboutData = {
  quote: "Tôi tin rằng mỗi người đều có một câu chuyện xứng đáng được kể — và ánh sáng là ngôn ngữ tôi dùng để kể những câu chuyện đó.",
  bio1: "Sinh ra tại Hà Nội, lớn lên giữa những con phố cổ và ánh đèn hội hè, tôi sớm học được rằng cái đẹp ẩn mình trong từng khoảnh khắc bình thường nhất.",
  bio2: "Sau hơn 6 năm cầm máy, từ những buổi sáng sớm trên ruộng bậc thang Mù Cang Chải đến những đêm khuya trong studio ở Sài Gòn, tôi hiểu rằng nhiếp ảnh không phải là việc bấm nút — mà là việc nhìn thấy linh hồn của người đứng trước ống kính.",
  bio3: "Chuyên môn của tôi là áo dài, portrait nghệ thuật, ảnh cưới, và kỷ yếu. Nhưng điều tôi thực sự làm là lưu giữ những khoảnh khắc mà bạn sẽ muốn nhìn lại mười năm sau và thấy mình trong đó.",
};

export function AboutClient({ initial }: { initial: AboutData }) {
  const router = useRouter();
  const photoRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<AboutData>({ ...DEFAULTS, ...Object.fromEntries(Object.entries(initial).filter(([, v]) => v != null)) });
  const [photoPreview, setPhotoPreview] = useState<string | null>(initial.photoUrl ?? null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  return (
    <div className="max-w-2xl mx-auto p-6 md:p-10 space-y-10">
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
