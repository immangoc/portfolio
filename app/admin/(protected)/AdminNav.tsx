"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const links = [
  { href: "/admin", label: "Dashboard", icon: "◈" },
  { href: "/admin/photos", label: "Photos", icon: "◉" },
  { href: "/admin/about", label: "About", icon: "✦" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-white/[0.06] flex flex-col py-8 px-5">
      <p className="text-[10px] tracking-[0.45em] text-champagne uppercase mb-10 px-1">
        Admin Panel
      </p>

      <nav className="flex flex-col gap-1 flex-1">
        {links.map((l) => {
          const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors duration-200 ${
                active
                  ? "bg-champagne/10 text-champagne"
                  : "text-ivory/40 hover:text-ivory/80 hover:bg-white/[0.04]"
              }`}
            >
              <span className="text-xs">{l.icon}</span>
              {l.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="flex items-center gap-3 px-3 py-2.5 text-sm text-ivory/30 hover:text-ivory/60 transition-colors duration-200"
      >
        <span className="text-xs">→</span>
        Sign out
      </button>
    </aside>
  );
}
