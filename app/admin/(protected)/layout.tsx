import type { ReactNode } from "react";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "./AdminNav";

export const metadata: Metadata = { title: "Admin — Nguyệt Minh" };

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="admin-layout min-h-screen bg-[#0e0c0a] text-ivory flex">
      <AdminNav />
      {/* pt-12 = mobile top bar, pb-16 = mobile bottom tab bar */}
      <main className="flex-1 overflow-auto pt-12 pb-16 md:pt-0 md:pb-0">
        {children}
      </main>
    </div>
  );
}
