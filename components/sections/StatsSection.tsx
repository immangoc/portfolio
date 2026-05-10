"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/portfolio";
import { CountUp } from "@/components/ui/CountUp";

export function StatsSection() {
  return (
    <section className="py-20 md:py-28 bg-espresso overflow-hidden">
      <div className="px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-display text-5xl md:text-6xl text-champagne">
              <CountUp value={stat.value} suffix={stat.suffix} />
            </p>
            <p className="text-xs tracking-[0.3em] text-ivory/40 uppercase mt-3">
              {stat.label}
            </p>
            <p className="font-display italic text-sm text-ivory/30 mt-1">
              {stat.labelVi}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
