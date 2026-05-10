"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealText } from "@/components/ui/RevealText";
import { CountUp } from "@/components/ui/CountUp";
import { FloatingPolaroids } from "@/components/3d/FloatingPolaroids";
import { stats } from "@/data/portfolio";
import { CTASection } from "@/components/sections/CTASection";

const timeline = [
  {
    year: "2016",
    title: "First Click",
    titleVi: "Lần Chụp Đầu Tiên",
    body: "Borrowed my sister's Canon 550D and fell irreversibly in love with light.",
  },
  {
    year: "2018",
    title: "First Exhibition",
    titleVi: "Triển Lãm Đầu Tiên",
    body: "Exhibited at Hanoi Fine Arts Museum — 30 portraits, sold out opening night.",
  },
  {
    year: "2020",
    title: "Studio Founded",
    titleVi: "Thành Lập Studio",
    body: "Opened my first dedicated studio in Ho Chi Minh City.",
  },
  {
    year: "2022",
    title: "International Feature",
    titleVi: "Báo Quốc Tế",
    body: "Featured in Vogue Vietnam & Harper's Bazaar Vietnam.",
  },
  {
    year: "2024",
    title: "Today",
    titleVi: "Hôm Nay",
    body: "500+ sessions, clients across Vietnam and Southeast Asia.",
  },
];

interface AboutData { photoUrl?: string | null; quote?: string | null; bio1?: string | null; bio2?: string | null; bio3?: string | null; }

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=85";
const DEFAULT_QUOTE = "Tôi tin rằng mỗi người đều có một câu chuyện xứng đáng được kể — và ánh sáng là ngôn ngữ tôi dùng để kể những câu chuyện đó.";
const DEFAULT_BIO1 = "Sinh ra tại Hà Nội, lớn lên giữa những con phố cổ và ánh đèn hội hè, tôi sớm học được rằng cái đẹp ẩn mình trong từng khoảnh khắc bình thường nhất.";
const DEFAULT_BIO2 = "Sau hơn 6 năm cầm máy, từ những buổi sáng sớm trên ruộng bậc thang Mù Cang Chải đến những đêm khuya trong studio ở Sài Gòn, tôi hiểu rằng nhiếp ảnh không phải là việc bấm nút — mà là việc nhìn thấy linh hồn của người đứng trước ống kính.";
const DEFAULT_BIO3 = "Chuyên môn của tôi là áo dài, portrait nghệ thuật, ảnh cưới, và kỷ yếu. Nhưng điều tôi thực sự làm là lưu giữ những khoảnh khắc mà bạn sẽ muốn nhìn lại mười năm sau và thấy mình trong đó.";

export function AboutPageClient({ content = {} }: { content?: AboutData }) {
  const photo = content.photoUrl ?? DEFAULT_PHOTO;
  const quote = content.quote ?? DEFAULT_QUOTE;
  const bio1 = content.bio1 ?? DEFAULT_BIO1;
  const bio2 = content.bio2 ?? DEFAULT_BIO2;
  const bio3 = content.bio3 ?? DEFAULT_BIO3;
  const stickyRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Hero */}
      <div className="pt-32 pb-0 bg-ivory overflow-hidden">
        <div className="px-6 md:px-16 mb-16">
          <motion.p
            className="text-xs tracking-[0.4em] text-champagne uppercase mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The Photographer
          </motion.p>
          <RevealText
            as="h1"
            splitBy="words"
            className="font-display text-6xl md:text-8xl text-espresso leading-none"
          >
            Nguyệt Minh
          </RevealText>
          <motion.p
            className="font-display italic text-2xl text-bronze/50 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Nhiếp ảnh gia nghệ thuật
          </motion.p>
        </div>

        {/* Split layout — sticky photo + scrolling bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-start">
          {/* Sticky image */}
          <div
            ref={stickyRef}
            className="relative md:sticky md:top-0 h-[60vh] md:h-screen overflow-hidden"
          >
            <Image
              src={photo}
              alt="Nguyệt Minh"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />

            {/* Overlay text */}
            <div className="absolute bottom-8 left-8">
              <p className="text-[10px] tracking-[0.4em] uppercase text-ivory/40">
                Sony A7R V · 85mm f/1.4
              </p>
            </div>
          </div>

          {/* Bio text */}
          <div ref={textRef} className="px-8 md:px-16 py-16 md:py-24 bg-cream">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mb-12"
            >
              <p className="font-display text-2xl md:text-3xl text-espresso leading-relaxed italic mb-6">
                &ldquo;{quote}&rdquo;
              </p>
              <p className="text-sm text-charcoal/60 leading-relaxed">
                I believe every person carries a story worthy of being told —
                and light is the language I use to tell it.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="space-y-6 text-sm text-charcoal/70 leading-relaxed"
            >
              <p>{bio1}</p>
              <p>{bio2}</p>
              <p>{bio3}</p>
            </motion.div>

            {/* Skills tags */}
            <motion.div
              className="flex flex-wrap gap-2 mt-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {[
                "Áo Dài",
                "Concept Fine Art",
                "Wedding",
                "Kỷ Yếu",
                "Studio Lighting",
                "Location Scouting",
                "Film Editing",
                "Color Grading",
              ].map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-champagne/30 text-bronze"
                >
                  {skill}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-espresso py-20 px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="font-display text-5xl text-champagne">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-xs tracking-widest text-ivory/40 uppercase mt-2">
              {stat.labelVi}
            </p>
          </motion.div>
        ))}
      </div>

      {/* 3D Floating Polaroids section */}
      <div className="relative bg-cream overflow-hidden py-24">
        <div className="px-6 md:px-16 mb-16 text-center">
          <motion.p
            className="text-xs tracking-[0.4em] text-champagne uppercase mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Behind the Lens
          </motion.p>
          <RevealText
            as="h2"
            splitBy="words"
            className="font-display text-4xl md:text-5xl text-espresso"
          >
            Moments from the journey
          </RevealText>
        </div>

        <FloatingPolaroids className="w-full h-96 md:h-[500px]" />
      </div>

      {/* Timeline */}
      <div className="bg-ivory py-24 px-6 md:px-16">
        <div className="mb-16">
          <motion.p
            className="text-xs tracking-[0.4em] text-champagne uppercase mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            The Journey
          </motion.p>
          <RevealText
            as="h2"
            splitBy="words"
            className="font-display text-4xl md:text-5xl text-espresso"
          >
            Milestones
          </RevealText>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-champagne/20" />

          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              className={`relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 pl-8 md:pl-0 ${
                i % 2 === 0 ? "md:pr-16" : "md:pl-16 md:[grid-template-columns:1fr_1fr]"
              }`}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Dot */}
              <div className="absolute left-0 md:left-1/2 top-2 w-3 h-3 bg-champagne rounded-full -translate-x-1/2 md:-translate-x-1/2" />

              <div className={i % 2 === 0 ? "md:text-right" : "md:col-start-2"}>
                <p className="font-display text-5xl text-champagne/30 mb-2">
                  {item.year}
                </p>
                <h3 className="font-display text-2xl text-espresso mb-1">
                  {item.title}
                </h3>
                <p className="font-display italic text-lg text-bronze/50 mb-3">
                  {item.titleVi}
                </p>
                <p className="text-sm text-charcoal/60 leading-relaxed">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <CTASection />
    </>
  );
}
