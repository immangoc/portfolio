"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[900] transition-all duration-500",
          scrolled
            ? "py-4 bg-ivory/90 backdrop-blur-md dark:bg-espresso/90"
            : "py-6"
        )}
      >
        <div className="px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="flex flex-col">
              <span className="font-display text-xl tracking-[0.2em] text-espresso dark:text-ivory uppercase">
                Nguyệt Minh
              </span>
              <span className="text-[9px] tracking-[0.4em] text-champagne uppercase mt-0.5">
                Photography
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.slice(0, 5).map((link) => (
              <NavLink key={link.href} href={link.href} active={pathname === link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/contact"
              className={cn(
                "hidden md:block text-xs tracking-[0.25em] uppercase px-5 py-2.5 border border-champagne/60 text-champagne hover:bg-champagne hover:text-espresso transition-all duration-300",
                pathname === "/contact" && "bg-champagne text-espresso"
              )}
            >
              Contact
            </Link>

            {/* Hamburger */}
            <button
              className="w-8 h-6 flex flex-col justify-between group z-10"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "block w-full h-px bg-espresso dark:bg-ivory transition-all duration-500 origin-right",
                  menuOpen && "rotate-45 translate-y-[11px] bg-ivory"
                )}
              />
              <span
                className={cn(
                  "block w-2/3 h-px bg-espresso dark:bg-ivory transition-all duration-500",
                  menuOpen && "opacity-0 w-0"
                )}
              />
              <span
                className={cn(
                  "block w-full h-px bg-espresso dark:bg-ivory transition-all duration-500 origin-right",
                  menuOpen && "-rotate-45 -translate-y-[11px] bg-ivory"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[800] bg-espresso flex flex-col items-center justify-center"
            initial={{ clipPath: "circle(0% at calc(100% - 60px) 40px)" }}
            animate={{ clipPath: "circle(150% at calc(100% - 60px) 40px)" }}
            exit={{ clipPath: "circle(0% at calc(100% - 60px) 40px)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="font-display text-5xl md:text-6xl text-ivory hover:text-champagne transition-colors duration-300 block"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Social links */}
            <motion.div
              className="absolute bottom-12 flex gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {[
                { label: "Instagram", href: "https://www.instagram.com/ng_nguyt03/", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg> },
                { label: "Facebook", href: "https://www.facebook.com/nguyet1507", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg> },
                { label: "TikTok", href: "https://www.tiktok.com/@nguytphoto", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.38-6.22V9.4a8.16 8.16 0 0 0 4.84 1.58V7.53a4.83 4.83 0 0 1-1-.84z"/></svg> },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ivory/40 hover:text-ivory transition-colors"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({
  href,
  children,
  active,
}: {
  href: string;
  children: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-xs tracking-[0.2em] uppercase transition-colors duration-300 gold-underline",
        active ? "text-champagne" : "text-charcoal/70 dark:text-ivory/60 hover:text-champagne"
      )}
    >
      {children}
    </Link>
  );
}
