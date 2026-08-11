"use client";

import { useRef, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  AnimatePresence,
} from "framer-motion";
import { RevealText } from "@/components/ui/RevealText";

const channels = [
  {
    index: "01",
    label: "Email",
    sub: "Liên hệ qua email",
    value: "hello@nguyetminh.com",
    href: "mailto:hello@nguyetminh.com",
    external: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    index: "02",
    label: "Zalo · Phone",
    sub: "Nhắn tin hoặc gọi điện",
    value: "0399 394 349",
    href: "tel:0399394349",
    external: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
  {
    index: "03",
    label: "Instagram",
    sub: "Follow the journey",
    value: "@ng_nguyt03",
    href: "https://www.instagram.com/ng_nguyt03/",
    external: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    index: "04",
    label: "Facebook",
    sub: "Theo dõi trang",
    value: "Nguyệt Minh",
    href: "https://www.facebook.com/nguyet1507",
    external: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    index: "05",
    label: "TikTok",
    sub: "Video & behind the scenes",
    value: "@nguytphoto",
    href: "https://www.tiktok.com/@nguytphoto",
    external: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.83 4.83 0 0 1-1-.84z"/>
      </svg>
    ),
  },
];



const sweepVariants = {
  rest: { scaleX: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  hover: { scaleX: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

function ChannelRow({ ch, delay }: { ch: (typeof channels)[0]; delay: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [2, -2]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), { stiffness: 280, damping: 28 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
  }, [mx, my]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.a
        ref={ref}
        href={ch.href}
        target={ch.external ? "_blank" : undefined}
        rel={ch.external ? "noopener noreferrer" : undefined}
        initial="rest"
        whileHover="hover"
        animate="rest"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="group relative flex items-center justify-between py-6 md:py-8 border-b border-bronze/10 overflow-hidden"
      >
        {/* Gold border reveal on hover */}
        <motion.span
          className="absolute bottom-0 left-0 h-px bg-champagne origin-left"
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } } }}
        />

        {/* Sweep fill */}
        <motion.span
          className="absolute inset-0 origin-left"
          style={{ background: "linear-gradient(90deg, rgba(239,232,220,0.9) 0%, rgba(239,232,220,0.3) 100%)" }}
          variants={sweepVariants}
        />

        {/* Champagne glow */}
        <motion.span
          className="pointer-events-none absolute inset-0"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1, transition: { duration: 0.6 } },
          }}
          style={{
            background: "radial-gradient(ellipse 60% 80% at 20% 50%, rgba(201,169,97,0.09), transparent 70%)",
          }}
        />

        {/* Left — number + icon badge + label */}
        <div className="relative z-10 flex items-center gap-3 md:gap-5">
          <motion.span
            className="text-[9px] tracking-[0.45em] text-bronze/20 w-4 shrink-0 font-mono tabular-nums select-none hidden sm:inline-block"
            style={{ translateZ: 6 }}
          >
            {ch.index}
          </motion.span>

          {/* Platform Icon Badge */}
          <div className="w-8 h-8 rounded-full bg-bronze/5 border border-bronze/15 flex items-center justify-center text-bronze group-hover:text-champagne group-hover:border-champagne/50 group-hover:bg-champagne/10 transition-all duration-300 shrink-0">
            {ch.icon}
          </div>

          <div style={{ translateZ: 24 } as React.CSSProperties}>
            <motion.p
              className="font-display leading-none text-espresso"
              style={{ fontSize: "clamp(1.1rem, 2.2vw, 1.6rem)" }}
              variants={{
                rest: { color: "var(--espresso)" },
                hover: { color: "var(--champagne)", transition: { duration: 0.4 } },
              }}
            >
              {ch.label}
            </motion.p>
            <p className="text-[8px] tracking-[0.3em] text-bronze/35 uppercase mt-1 hidden md:block">
              {ch.sub}
            </p>
          </div>
        </div>

        {/* Right — value + arrow */}
        <div
          className="relative z-10 flex items-center gap-3 md:gap-6"
          style={{ translateZ: 14 } as React.CSSProperties}
        >
          <motion.span
            className="text-xs md:text-sm tracking-wide font-light"
            variants={{
              rest: { color: "rgba(43,37,32,0.4)" },
              hover: { color: "var(--espresso)", transition: { duration: 0.4 } },
            }}
          >
            {ch.value}
          </motion.span>

          <motion.span
            className="text-sm shrink-0"
            variants={{
              rest: { color: "rgba(139,111,71,0.2)", x: 0 },
              hover: { color: "var(--champagne)", x: 4, transition: { type: "spring", stiffness: 500, damping: 20 } },
            }}
          >
            →
          </motion.span>
        </div>
      </motion.a>
    </motion.div>
  );
}

export function ContactPageClient({ concepts = [] }: { concepts?: string[] }) {
  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, -70]);
  const titleOpacity = useTransform(scrollY, [0, 350], [1, 0.55]);

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    concept: concepts[0] || "",
    date: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
      } else {
        alert("Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại!");
      }
    } catch {
      alert("Có lỗi kết nối. Vui lòng kiểm tra lại mạng!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contact: "",
      concept: "Áo Dài",
      date: "",
      message: "",
    });
    setIsSuccess(false);
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col overflow-x-hidden">
      {/* ── Grain overlay ── */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[3] opacity-[0.028] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px",
        }}
      />

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-12 px-6 md:px-16 lg:px-24 overflow-hidden">
        {/* Floating background blur elements */}
        <motion.div
          aria-hidden
          className="absolute -top-40 -right-24 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,169,97,0.08) 0%, transparent 68%)" }}
          animate={{ x: [0, 15, 0], y: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.p
            className="text-[10px] tracking-[0.55em] text-champagne uppercase mb-4"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            Bắt đầu hành trình của bạn · Let&apos;s create together
          </motion.p>

          <motion.div style={{ y: titleY, opacity: titleOpacity }}>
            <RevealText
              as="h1"
              splitBy="words"
              className="font-display text-espresso leading-[0.88] tracking-tight text-[clamp(3.5rem,8vw,7.5rem)]"
            >
              Contact
            </RevealText>
          </motion.div>
        </div>
      </section>

      {/* ── Content Grid ── */}
      <section className="flex-1 px-6 md:px-16 lg:px-24 pb-24 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Contact details & Info */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Info panel */}
            <div className="flex flex-col gap-4">
              <p className="text-[10px] tracking-[0.45em] text-bronze/40 uppercase">Studio Info</p>
              <div className="flex items-center gap-3">
                <span className="h-px w-6 bg-champagne" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-espresso/80">Hà Nội &amp; Toàn Quốc</span>
              </div>
              <p className="text-xs text-bronze/60 font-light leading-relaxed">
                Nhận chụp ảnh Ngoại cảnh, Studio, Concept thời trang, Đám cưới nghệ thuật và Kỷ yếu cao cấp. Sẵn sàng di chuyển khắp các tỉnh thành và nước ngoài.
              </p>
            </div>

            {/* Existing Channel Rows */}
            <div className="flex flex-col">
              <p className="text-[10px] tracking-[0.45em] text-bronze/40 uppercase mb-2">Direct Channels</p>
              {channels.map((ch, i) => (
                <ChannelRow key={ch.index} ch={ch} delay={i * 0.05} />
              ))}
            </div>
          </div>

          {/* Right Column: Booking inquiry form */}
          <div className="lg:col-span-7">
            <div className="glass p-8 md:p-12 rounded-2xl border border-bronze/10 shadow-xl relative overflow-hidden bg-white/40">
              {/* Subtle glass lights */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-champagne/10 rounded-full blur-[40px] pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose/5 rounded-full blur-[40px] pointer-events-none" />

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.div
                    key="booking-form"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="mb-8">
                      <h2 className="font-display text-2xl md:text-3xl text-espresso mb-2">Đặt lịch tư vấn nghệ thuật</h2>
                      <p className="text-xs text-bronze/50 font-light">Hãy gửi thông tin chi tiết, Minh sẽ liên hệ lại qua Zalo/Email sớm nhất.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                      
                      {/* Name */}
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder=" "
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="focus:border-champagne/60 transition-colors"
                        />
                        <label className="text-xs tracking-widest uppercase">Tên của bạn · Full Name *</label>
                      </div>

                      {/* Contact */}
                      <div className="form-group">
                        <input
                          type="text"
                          placeholder=" "
                          required
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                          className="focus:border-champagne/60 transition-colors"
                        />
                        <label className="text-xs tracking-widest uppercase">Số điện thoại / Zalo *</label>
                      </div>

                      {/* Concept Selection */}
                      <div className="flex flex-col gap-2 mt-2">
                        <span className="text-[10px] tracking-widest uppercase text-bronze/50 block">Chọn dịch vụ · Category</span>
                        <div className="flex flex-wrap gap-2">
                          {concepts.map((concept) => (
                            <button
                              key={concept}
                              type="button"
                              onClick={() => setFormData({ ...formData, concept })}
                              className={`px-3 py-1.5 text-[10px] tracking-widest uppercase transition-all duration-300 rounded ${
                                formData.concept === concept
                                  ? "bg-champagne text-espresso font-medium border border-champagne"
                                  : "bg-white/60 text-bronze/70 border border-bronze/20 hover:border-champagne hover:text-champagne hover:bg-white"
                              }`}
                            >
                              {concept}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex flex-col gap-2 mt-2">
                        <label className="text-[10px] tracking-widest uppercase text-bronze/50 block">Ngày dự kiến chụp · Preferred Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-white/60 border border-bronze/20 focus:border-champagne/60 rounded px-3 py-2 text-xs text-espresso outline-none transition-colors"
                        />
                      </div>

                      {/* Message */}
                      <div className="form-group">
                        <textarea
                          placeholder=" "
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="focus:border-champagne/60 transition-colors min-h-[80px]"
                        />
                        <label className="text-xs tracking-widest uppercase">Ý tưởng hoặc lời nhắn · Details &amp; Ideas</label>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 relative py-4 bg-espresso text-ivory tracking-[0.2em] text-xs uppercase font-medium rounded-lg overflow-hidden border border-espresso/10 hover:border-champagne/30 transition-all flex items-center justify-center gap-2 group"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        {/* Gold sweep background on hover */}
                        <span className="absolute inset-0 bg-champagne origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0" />
                        
                        <span className="relative z-10 flex items-center gap-2 group-hover:text-espresso transition-colors duration-400">
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Đang gửi thông tin...
                            </>
                          ) : (
                            <>
                              Gửi thông tin đặt lịch
                              <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                            </>
                          )}
                        </span>
                      </motion.button>

                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="booking-success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                      className="w-16 h-16 bg-champagne/10 border border-champagne/40 rounded-full flex items-center justify-center mb-6"
                    >
                      <span className="text-champagne text-2xl">✓</span>
                    </motion.div>

                    <h3 className="font-display text-2xl text-espresso mb-3">Thông tin đã gửi thành công!</h3>
                    
                    <div className="max-w-md text-xs text-bronze/60 font-light leading-relaxed flex flex-col gap-2 mb-8">
                      <p>Cảm ơn bạn đã quan tâm và lựa chọn dịch vụ chụp ảnh nghệ thuật của Nguyệt Minh.</p>
                      <p className="font-normal text-espresso">Mình sẽ liên hệ lại với bạn qua số điện thoại / Zalo bạn cung cấp trong vòng 2 giờ làm việc.</p>
                    </div>

                    <button
                      onClick={resetForm}
                      className="px-6 py-2.5 bg-white/60 text-bronze hover:text-espresso border border-bronze/20 hover:border-champagne hover:bg-champagne/10 rounded text-xs uppercase tracking-widest transition-colors font-medium"
                    >
                      Quay lại gửi yêu cầu mới
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* ── Footer strip ── */}
      <motion.footer
        className="px-6 md:px-16 lg:px-24 py-10 border-t border-bronze/10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-display italic text-bronze/25 text-sm">
            Available nationwide &amp; abroad
          </p>
          <p className="text-[9px] tracking-[0.45em] uppercase text-bronze/25">
            © {new Date().getFullYear()} Nguyệt Minh Photography
          </p>
        </div>
      </motion.footer>
    </div>
  );
}
