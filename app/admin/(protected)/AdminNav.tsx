"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/photos", label: "Photos", icon: "◉" },
  { href: "/admin/categories", label: "Categories", icon: "❖" },
  { href: "/admin/bookings", label: "Bookings", icon: "✉" },
  { href: "/admin/about", label: "About", icon: "✦" },
];

export function AdminNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-56 shrink-0 border-r border-white/[0.06] flex-col py-8 px-5">
        <p className="text-[10px] tracking-[0.45em] text-champagne uppercase mb-10 px-1">
          Admin Panel
        </p>

        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors duration-200 ${
                isActive(l.href)
                  ? "bg-champagne/10 text-champagne"
                  : "text-ivory/40 hover:text-ivory/80 hover:bg-white/[0.04]"
              }`}
            >
              <span className="text-xs">{l.icon}</span>
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/30 hover:text-ivory/60 transition-colors duration-200"
        >
          <span className="text-xs">→</span>
          Sign out
        </button>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 bg-[#0e0c0a] border-b border-white/[0.06] flex items-center justify-between px-4">
        <p className="text-[10px] tracking-[0.45em] text-champagne uppercase">Admin</p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="text-[10px] tracking-widest uppercase text-ivory/30 hover:text-ivory/60 transition-colors"
        >
          Sign out
        </button>
      </header>

      {/* ── Mobile bottom tab bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#0e0c0a] border-t border-white/[0.06] flex items-stretch">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
              isActive(l.href) ? "text-champagne" : "text-ivory/30"
            }`}
          >
            <span className="text-base leading-none">{l.icon}</span>
            <span className="text-[9px] tracking-widest uppercase">{l.label}</span>
            {isActive(l.href) && (
              <span className="absolute top-0 w-8 h-px bg-champagne" />
            )}
          </Link>
        ))}
      </nav>
    </>
  );
}
