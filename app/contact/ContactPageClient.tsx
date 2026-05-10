"use client";

import { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
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
  },
  {
    index: "02",
    label: "Zalo · Phone",
    sub: "Nhắn tin hoặc gọi điện",
    value: "0399 394 349",
    href: "tel:0399394349",
    external: false,
  },
  {
    index: "03",
    label: "Instagram",
    sub: "Follow the journey",
    value: "@ng_nguyt03",
    href: "https://www.instagram.com/ng_nguyt03/",
    external: true,
  },
  {
    index: "04",
    label: "Facebook",
    sub: "Theo dõi trang",
    value: "Nguyệt Minh",
    href: "https://www.facebook.com/nguyet1507",
    external: true,
  },
  {
    index: "05",
    label: "TikTok",
    sub: "Video & behind the scenes",
    value: "@nguytphoto",
    href: "https://www.tiktok.com/@nguytphoto",
    external: true,
  },
];

const sweepVariants = {
  rest: { scaleX: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
  hover: { scaleX: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
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
      initial={{ opacity: 0, y: 36 }}
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
        className="group relative flex items-center justify-between py-8 md:py-11 border-b border-bronze/10 overflow-hidden"
      >
        {/* Gold border reveal on hover */}
        <motion.span
          className="absolute bottom-0 left-0 h-px bg-champagne origin-left"
          variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1, transition: { duration: 0.5, ease: [0.16,1,0.3,1] as [number,number,number,number] } } }}
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

        {/* Left — number + label */}
        <div className="relative z-10 flex items-center gap-6 md:gap-12">
          <motion.span
            className="text-[9px] tracking-[0.45em] text-bronze/20 w-5 shrink-0 font-mono tabular-nums select-none"
            style={{ translateZ: 6 }}
          >
            {ch.index}
          </motion.span>

          <div style={{ translateZ: 24 } as React.CSSProperties}>
            <motion.p
              className="font-display leading-none text-espresso"
              style={{ fontSize: "clamp(1.6rem, 3.8vw, 3rem)" }}
              variants={{
                rest: { color: "var(--espresso)" },
                hover: { color: "var(--champagne)", transition: { duration: 0.4 } },
              }}
            >
              {ch.label}
            </motion.p>
            <p className="text-[9px] tracking-[0.35em] text-bronze/30 uppercase mt-1.5 hidden md:block">
              {ch.sub}
            </p>
          </div>
        </div>

        {/* Right — value + arrow */}
        <div
          className="relative z-10 flex items-center gap-4 md:gap-8"
          style={{ translateZ: 14 } as React.CSSProperties}
        >
          <motion.span
            className="text-sm md:text-base tracking-wide font-light"
            variants={{
              rest: { color: "rgba(43,37,32,0.4)" },
              hover: { color: "var(--espresso)", transition: { duration: 0.4 } },
            }}
          >
            {ch.value}
          </motion.span>

          <motion.span
            className="text-base shrink-0"
            variants={{
              rest: { color: "rgba(139,111,71,0.2)", x: 0 },
              hover: { color: "var(--champagne)", x: 6, transition: { type: "spring", stiffness: 500, damping: 20 } },
            }}
          >
            →
          </motion.span>
        </div>
      </motion.a>
    </motion.div>
  );
}

export function ContactPageClient() {
  const { scrollY } = useScroll();
  const titleY    = useTransform(scrollY, [0, 500], [0, -70]);
  const titleOpacity = useTransform(scrollY, [0, 350], [1, 0.55]);
  const bgLetterY = useTransform(scrollY, [0, 500], [0, 50]);

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
      <section className="relative pt-40 pb-28 px-6 md:px-16 lg:px-24 border-b border-bronze/10 overflow-hidden">

        {/* Floating orbs */}
        <motion.div
          aria-hidden
          className="absolute -top-40 -right-24 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(201,169,97,0.08) 0%, transparent 68%)" }}
          animate={{ x: [0, 18, 0], y: [0, -22, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute bottom-8 left-1/4 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,111,71,0.06) 0%, transparent 70%)" }}
          animate={{ x: [0, -12, 0], y: [0, 16, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
        <motion.div
          aria-hidden
          className="absolute top-1/2 left-1/2 w-[280px] h-[280px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(circle, rgba(212,165,165,0.04) 0%, transparent 70%)" }}
          animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Decorative bg letter */}
        <motion.span
          aria-hidden
          className="absolute right-4 md:right-12 top-20 font-display leading-none select-none pointer-events-none text-bronze/[0.022]"
          style={{ fontSize: "clamp(14rem, 30vw, 28rem)", y: bgLetterY }}
        >
          C
        </motion.span>

        {/* Thin horizontal accent line */}
        <motion.div
          className="absolute left-0 top-0 h-px bg-champagne/30"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "left", width: "100%" }}
        />

        <div className="max-w-6xl mx-auto relative">
          <motion.p
            className="text-[10px] tracking-[0.55em] text-champagne uppercase mb-10"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            Let&apos;s create together
          </motion.p>

          {/* Parallax title */}
          <motion.div style={{ y: titleY, opacity: titleOpacity }}>
            <RevealText
              as="h1"
              splitBy="words"
              className="font-display text-espresso leading-[0.88] tracking-tight text-[clamp(4.5rem,11vw,10rem)]"
            >
              Contact
            </RevealText>
          </motion.div>

          <div className="mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <motion.p
              className="font-display italic text-bronze/35"
              style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)" }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Đặt lịch chụp ảnh
            </motion.p>

            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <span className="h-px w-8 bg-bronze/20" />
              <span className="text-[9px] tracking-[0.5em] uppercase text-bronze/30">Hà Nội</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Channel rows ── */}
      <section className="flex-1 px-6 md:px-16 lg:px-24 py-6 relative">
        {/* Subtle vertical accent */}
        <motion.div
          className="absolute left-6 md:left-16 lg:left-24 top-0 bottom-0 w-px bg-bronze/5 pointer-events-none"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ transformOrigin: "top" }}
        />

        <div className="max-w-6xl mx-auto">
          {channels.map((ch, i) => (
            <ChannelRow key={ch.index} ch={ch} delay={i * 0.06} />
          ))}
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
