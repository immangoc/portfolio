import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RevealText } from "@/components/ui/RevealText";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Behind-the-scenes stories, photography tips, and insights from Nguyệt Minh's journeys across Vietnam.",
};

const posts = [
  {
    slug: "golden-hour-hoi-an",
    title: "Chasing Golden Hour in Hội An",
    titleVi: "Săn Ánh Nắng Chiều Tại Hội An",
    date: "March 2024",
    category: "Behind the Scenes",
    excerpt:
      "The ancient town's lantern light and 4PM sun create a magic hour unlike anywhere else in Vietnam.",
    image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80",
  },
  {
    slug: "ao-dai-color-theory",
    title: "Áo Dài & the Art of Color",
    titleVi: "Áo Dài & Nghệ Thuật Phối Màu",
    date: "February 2024",
    category: "Technique",
    excerpt:
      "How I approach the relationship between fabric color, skin tone, and background to create visual harmony.",
    image: "https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&q=80",
  },
  {
    slug: "shooting-on-film",
    title: "Why I Still Shoot on Film",
    titleVi: "Tại Sao Tôi Vẫn Chụp Film",
    date: "January 2024",
    category: "Philosophy",
    excerpt:
      "Digital is convenience. Film is commitment. There's a reason some things should slow down.",
    image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
  },
  {
    slug: "location-da-lat",
    title: "Đà Lạt: My Eternal Muse",
    titleVi: "Đà Lạt: Nàng Thơ Muôn Đời Của Tôi",
    date: "December 2023",
    category: "Location Guide",
    excerpt:
      "Hidden spots, best seasons, and why this highland city produces my most emotionally resonant work.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80",
  },
  {
    slug: "client-guide",
    title: "How to Prepare for Your Session",
    titleVi: "Chuẩn Bị Cho Buổi Chụp Ảnh Như Thế Nào",
    date: "November 2023",
    category: "Client Guide",
    excerpt:
      "From wardrobe to mindset — everything you need to know to feel confident and beautiful in front of my lens.",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80",
  },
  {
    slug: "wedding-story-phu-quoc",
    title: "A Sunset Wedding in Phú Quốc",
    titleVi: "Đám Cưới Hoàng Hôn Tại Phú Quốc",
    date: "October 2023",
    category: "Wedding Story",
    excerpt:
      "How two people, a sea breeze, and sixty minutes of perfect light became photographs they'll treasure forever.",
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
  },
];

export default function JournalPage() {
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      {/* Header */}
      <div className="pt-32 pb-16 px-6 md:px-16 bg-ivory">
        <p className="text-xs tracking-[0.4em] text-champagne uppercase mb-4">
          Stories & Insights
        </p>
        <RevealText
          as="h1"
          splitBy="words"
          className="font-display text-6xl md:text-8xl text-espresso leading-none"
        >
          Journal
        </RevealText>
        <p className="font-display italic text-xl text-bronze/50 mt-4">
          Nhật ký ánh sáng
        </p>
      </div>

      {/* Featured post */}
      <Link href={`/journal/${featured.slug}`}>
        <div className="group relative h-[60vh] md:h-[70vh] overflow-hidden bg-espresso">
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/30 to-transparent" />
          <div className="absolute bottom-0 left-0 px-6 md:px-16 py-12 max-w-2xl">
            <p className="text-[10px] tracking-[0.4em] uppercase text-champagne mb-4">
              Featured · {featured.category}
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ivory mb-3 group-hover:text-champagne transition-colors duration-300">
              {featured.title}
            </h2>
            <p className="font-display italic text-lg text-ivory/60 mb-4">
              {featured.titleVi}
            </p>
            <p className="text-sm text-ivory/50">{featured.excerpt}</p>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-xs tracking-widest text-champagne uppercase">
                Read More
              </span>
              <span className="text-champagne">→</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Grid */}
      <div className="px-6 md:px-16 py-20 bg-cream grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {rest.map((post, i) => (
          <Link key={post.slug} href={`/journal/${post.slug}`}>
            <article className="group">
              <div className="relative h-64 overflow-hidden mb-6">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-espresso/10 group-hover:bg-espresso/20 transition-colors duration-500" />
              </div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-champagne mb-3">
                {post.category} · {post.date}
              </p>
              <h3 className="font-display text-2xl text-espresso mb-2 group-hover:text-champagne transition-colors duration-300">
                {post.title}
              </h3>
              <p className="font-display italic text-base text-bronze/50 mb-4">
                {post.titleVi}
              </p>
              <p className="text-sm text-charcoal/60 leading-relaxed">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-5">
                <span className="text-xs tracking-widest text-bronze/40 uppercase group-hover:text-champagne transition-colors">
                  Read
                </span>
                <span className="text-bronze/40 group-hover:text-champagne group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}
