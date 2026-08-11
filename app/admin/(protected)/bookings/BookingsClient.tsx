"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface BookingData {
  id: string;
  name: string;
  contact: string;
  concept: string;
  date: string | null;
  message: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  initialBookings: BookingData[];
}

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả", color: "text-ivory/60" },
  { value: "pending", label: "Đang chờ", color: "text-amber-400" },
  { value: "confirmed", label: "Đã xác nhận", color: "text-sky-400" },
  { value: "completed", label: "Hoàn thành", color: "text-emerald-400" },
  { value: "cancelled", label: "Đã hủy", color: "text-rose-400" },
];

export function BookingsClient({ initialBookings }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [bookings, setBookings] = useState<BookingData[]>(initialBookings);
  const [activeFilter, setActiveFilter] = useState("all");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state when initialBookings updates (e.g., from router.refresh)
  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  const filteredBookings = bookings.filter(
    (b) => activeFilter === "all" || b.status === activeFilter
  );

  function showToast(msg: string, type: "ok" | "err" = "ok") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: updated.status } : b))
        );
        showToast("Đã cập nhật trạng thái");
        startTransition(() => router.refresh());
      } else {
        showToast("Lỗi khi cập nhật trạng thái", "err");
      }
    } catch {
      showToast("Lỗi kết nối", "err");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        setDeleteId(null);
        showToast("Đã xóa đơn đặt lịch");
        startTransition(() => router.refresh());
      } else {
        showToast("Xóa thất bại", "err");
      }
    } catch {
      showToast("Lỗi kết nối", "err");
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "confirmed":
        return "bg-sky-500/10 text-sky-400 border-sky-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      default:
        return "bg-white/10 text-ivory/60 border-white/10";
    }
  }

  return (
    <div className="p-5 md:p-10 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-4 py-2.5 rounded text-xs tracking-widest uppercase border backdrop-blur-md shadow-xl transition-all ${
            toast.type === "ok"
              ? "bg-champagne/20 border-champagne text-champagne"
              : "bg-red-500/20 border-red-500 text-red-400"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] tracking-[0.5em] text-champagne uppercase mb-2">
            Inquiries &amp; Bookings
          </p>
          <h1 className="text-3xl font-display text-ivory">Quản lý Đặt Lịch</h1>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 border border-white/[0.06] rounded-lg overflow-x-auto">
          {STATUS_OPTIONS.map((st) => {
            const count =
              st.value === "all"
                ? bookings.length
                : bookings.filter((b) => b.status === st.value).length;

            return (
              <button
                key={st.value}
                onClick={() => setActiveFilter(st.value)}
                className={`px-3 py-1.5 text-xs rounded transition-colors whitespace-nowrap ${
                  activeFilter === st.value
                    ? "bg-champagne/20 text-champagne font-medium"
                    : "text-ivory/40 hover:text-ivory hover:bg-white/[0.04]"
                }`}
              >
                {st.label} <span className="opacity-50 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center border border-dashed border-white/10 rounded-xl">
          <p className="text-4xl text-white/10 mb-3">✉</p>
          <p className="text-sm text-ivory/30">Chưa có thông tin đặt lịch nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-[#15120e] border border-white/[0.08] hover:border-white/20 rounded-xl p-5 flex flex-col justify-between transition-colors duration-300 relative group"
            >
              <div>
                {/* Header: Status badge & date */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                  <span
                    className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded border font-medium ${getStatusBadge(
                      b.status
                    )}`}
                  >
                    {STATUS_OPTIONS.find((s) => s.value === b.status)?.label || b.status}
                  </span>
                  <span className="text-[10px] text-ivory/30 font-mono">
                    {mounted ? new Date(b.createdAt).toLocaleDateString("vi-VN") : ""}
                  </span>
                </div>

                {/* Client Info */}
                <div className="mb-4">
                  <h3 className="text-base text-ivory font-medium mb-1">{b.name}</h3>
                  <a
                    href={`tel:${b.contact}`}
                    className="text-xs text-champagne hover:underline inline-block font-mono"
                  >
                    📞 {b.contact}
                  </a>
                </div>

                {/* Concept & Preferred Date */}
                <div className="grid grid-cols-2 gap-2 mb-4 bg-white/[0.02] p-3 rounded-lg border border-white/[0.04]">
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-ivory/30 mb-0.5">Dịch vụ</p>
                    <p className="text-xs text-ivory/80 font-medium">{b.concept}</p>
                  </div>
                  <div>
                    <p className="text-[9px] tracking-widest uppercase text-ivory/30 mb-0.5">Ngày chụp</p>
                    <p className="text-xs text-ivory/80">{b.date || "Chưa chọn"}</p>
                  </div>
                </div>

                {/* Message / Notes */}
                {b.message && (
                  <div className="mb-4">
                    <p className="text-[9px] tracking-widest uppercase text-ivory/30 mb-1">Lời nhắn</p>
                    <p className="text-xs text-ivory/60 font-light italic leading-relaxed line-clamp-3 bg-white/[0.02] p-3 rounded border border-white/[0.04]">
                      &ldquo;{b.message}&rdquo;
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 mt-2">
                {/* Change Status Select */}
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  className="bg-white/[0.04] border border-white/[0.08] text-xs text-ivory/80 rounded px-2 py-1 outline-none focus:border-champagne/50 transition-colors"
                >
                  <option value="pending" className="bg-[#15120e] text-amber-400">Đang chờ</option>
                  <option value="confirmed" className="bg-[#15120e] text-sky-400">Xác nhận</option>
                  <option value="completed" className="bg-[#15120e] text-emerald-400">Hoàn thành</option>
                  <option value="cancelled" className="bg-[#15120e] text-rose-400">Hủy bỏ</option>
                </select>

                {/* Delete Button */}
                <button
                  onClick={() => setDeleteId(b.id)}
                  className="px-2 py-1 text-[10px] uppercase text-rose-400/50 hover:text-rose-400 border border-white/[0.06] hover:border-rose-400/30 rounded transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div
            className="bg-[#1a1410] border border-white/10 rounded-xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base text-ivory font-medium mb-2">Xác nhận xóa?</h3>
            <p className="text-xs text-ivory/40 mb-6">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 text-xs border border-white/10 rounded text-ivory/60 hover:text-ivory"
              >
                Hủy
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 text-xs bg-rose-500/20 border border-rose-500/40 text-rose-300 rounded hover:bg-rose-500/30"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
