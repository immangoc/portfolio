import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  const [photoCount, categoryStats] = await Promise.all([
    db.photo.count(),
    db.category.findMany({
      include: { _count: { select: { photos: true } } },
    }),
  ]);

  const featuredCount = await db.photo.count({ where: { featured: true } });

  return (
    <div className="p-10">
      <div className="mb-10">
        <p className="text-[10px] tracking-[0.5em] text-champagne uppercase mb-2">
          Welcome back
        </p>
        <h1 className="text-3xl font-display text-ivory">
          {session?.user?.name?.split(" ")[0] ?? "Admin"}
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Photos", value: photoCount },
          { label: "Featured", value: featuredCount },
          { label: "Categories", value: categoryStats.length },
          { label: "Drafts", value: 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white/[0.04] border border-white/[0.06] rounded-lg p-5">
            <p className="text-3xl font-display text-ivory mb-1">{s.value}</p>
            <p className="text-xs text-ivory/35 tracking-wider uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[10px] tracking-[0.4em] text-champagne uppercase">Categories</p>
        <Link
          href="/admin/photos"
          className="text-xs text-ivory/40 hover:text-champagne transition-colors"
        >
          Manage photos →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categoryStats.map((cat) => (
          <Link
            key={cat.slug}
            href={`/admin/photos?category=${cat.slug}`}
            className="group bg-white/[0.03] border border-white/[0.06] hover:border-champagne/20 rounded-lg p-5 flex items-center justify-between transition-colors duration-300"
          >
            <div>
              <p className="text-sm text-ivory/80 group-hover:text-ivory transition-colors">
                {cat.title}
              </p>
              <p className="text-xs text-ivory/30 mt-0.5">{cat.titleVi}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-display text-ivory/60 group-hover:text-champagne transition-colors">
                {cat._count.photos}
              </p>
              <p className="text-[9px] text-ivory/25 uppercase tracking-wider">photos</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
