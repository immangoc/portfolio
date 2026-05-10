"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/data/portfolio";
import { RevealText } from "@/components/ui/RevealText";

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  return (
    <section className="py-24 md:py-36 px-6 md:px-16 bg-ivory overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.p
          className="text-xs tracking-[0.4em] text-champagne uppercase mb-4 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Client Love
        </motion.p>
        <RevealText
          as="h2"
          splitBy="words"
          className="font-display text-4xl md:text-5xl text-espresso text-center mb-16"
        >
          Words from my clients
        </RevealText>

        {/* Quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <div className="font-display text-5xl text-champagne/30 mb-4">"</div>
            <p className="font-display italic text-xl md:text-2xl text-espresso leading-relaxed max-w-2xl mx-auto">
              {current.contentVi}
            </p>
            <p className="text-sm text-charcoal/50 mt-4 italic">{current.content}</p>

            {/* Client */}
            <div className="flex flex-col items-center mt-8 gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-champagne/30">
                <Image
                  src={current.avatar}
                  alt={current.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-espresso">{current.name}</p>
                <p className="text-xs tracking-widest text-champagne/70 uppercase mt-0.5">
                  {current.role}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${
                i === active
                  ? "w-6 h-1.5 bg-champagne"
                  : "w-1.5 h-1.5 bg-champagne/30 hover:bg-champagne/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
