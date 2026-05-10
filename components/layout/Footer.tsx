"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Marquee } from "@/components/ui/Marquee";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-espresso text-ivory overflow-hidden">
      {/* Marquee strip */}
      <div className="border-y border-champagne/20 py-3">
        <Marquee
          text="PORTFOLIO • LUXURY • FINE ART • VIETNAM • NHIẾP ẢNH NGHỆ THUẬT"
          className="text-[11px] tracking-[0.3em] text-champagne/50"
        />
      </div>

      <div className="px-6 md:px-16 py-20 grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Brand */}
        <div>
          <h3 className="font-display text-3xl text-ivory mb-2">Nguyệt Minh</h3>
          <p className="text-[10px] tracking-[0.4em] text-champagne uppercase mb-6">
            Fine Art Photography
          </p>
          <p className="text-sm text-ivory/40 leading-relaxed max-w-xs">
            Lưu giữ khoảnh khắc — Kể chuyện bằng ánh sáng
          </p>
          <p className="text-sm text-ivory/30 mt-2 italic font-display">
            Preserving moments, telling stories through light.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <p className="text-[10px] tracking-[0.3em] text-champagne/60 uppercase mb-8">
            Navigation
          </p>
          <nav className="flex flex-col gap-4">
            {[
              { href: "/portfolio", label: "Portfolio" },
              { href: "/portfolio/ao-dai", label: "Áo Dài" },
              { href: "/portfolio/concept", label: "Nàng Thơ" },
              { href: "/portfolio/wedding", label: "Cưới" },
              { href: "/portfolio/ky-yeu", label: "Kỷ Yếu" },
              { href: "/about", label: "About" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ivory/40 hover:text-champagne transition-colors duration-300 w-fit gold-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] tracking-[0.3em] text-champagne/60 uppercase mb-8">
            Get in Touch
          </p>
          <div className="flex flex-col gap-4">
            <a
              href="mailto:hello@nguyetminh.com"
              className="text-sm text-ivory/40 hover:text-champagne transition-colors gold-underline w-fit"
            >
              hello@nguyetminh.com
            </a>
            <a
              href="tel:0399394349"
              className="text-sm text-ivory/40 hover:text-champagne transition-colors gold-underline w-fit"
            >
              0399 394 349
            </a>
            <p className="text-sm text-ivory/30">
              Hà Nội
            </p>
          </div>

          {/* Social */}
          <div className="flex gap-5 mt-10">
            <a
              href="https://www.instagram.com/ng_nguyt03/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-ivory/15 flex items-center justify-center text-ivory/40 hover:border-champagne hover:text-champagne transition-all duration-300"
              aria-label="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a
              href="https://www.facebook.com/nguyet1507"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-ivory/15 flex items-center justify-center text-ivory/40 hover:border-champagne hover:text-champagne transition-all duration-300"
              aria-label="Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a
              href="https://www.tiktok.com/@nguytphoto"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-ivory/15 flex items-center justify-center text-ivory/40 hover:border-champagne hover:text-champagne transition-all duration-300"
              aria-label="TikTok"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.83 4.83 0 0 1-1-.84z"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10 px-6 md:px-16 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[11px] tracking-widest text-ivory/25 uppercase">
          © {year} Nguyệt Minh Photography. All rights reserved.
        </p>
        <p className="text-[11px] tracking-widest text-ivory/25 uppercase">
          Crafted with love in Vietnam 🇻🇳
        </p>
      </div>
    </footer>
  );
}
