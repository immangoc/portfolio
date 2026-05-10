"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1.0]);

  return (
    <section ref={ref} className="relative h-[70vh] overflow-hidden flex items-center justify-center">
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=85"
          alt="Contact me"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-espresso/60" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center px-6">
        <motion.p
          className="text-xs tracking-[0.4em] text-champagne uppercase mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Ready to create?
        </motion.p>
        <motion.h2
          className="font-display text-5xl md:text-7xl text-ivory mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          Let&apos;s tell your story
        </motion.h2>
        <motion.p
          className="font-display italic text-xl text-ivory/60 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Hãy cùng nhau tạo ra những khoảnh khắc không thể quên
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 px-10 py-4 bg-champagne text-espresso text-sm tracking-[0.2em] uppercase hover:bg-ivory transition-all duration-300"
          >
            Contact Me
            <motion.span
              className="transition-transform group-hover:translate-x-1"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
