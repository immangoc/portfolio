# Nguyệt Minh Photography — Luxury Portfolio Website

A high-end fine-art photography portfolio for Vietnamese photographer **Nguyệt Minh**, built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Lenis, and Three.js.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Smooth Scroll | Lenis |
| 3D Effects | Three.js + React Three Fiber + Drei |
| Fonts | Cormorant Garamond, Inter, Be Vietnam Pro |

## Project Structure

```
photographer-portfolio/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx           # Root layout (fonts, providers, Header/Footer)
│   ├── page.tsx             # Homepage
│   ├── about/               # Sticky split layout, timeline, 3D polaroids
│   ├── contact/             # Booking form with floating labels
│   ├── journal/             # Blog posts grid
│   └── portfolio/
│       ├── page.tsx         # Portfolio overview (alternating layout)
│       ├── ao-dai/          # Áo Dài collection
│       ├── concept/         # Nàng Thơ concept collection
│       ├── wedding/         # Wedding collection
│       └── ky-yeu/          # Kỷ Yếu graduation collection
├── components/
│   ├── 3d/
│   │   ├── ParticleField    # Gold dust floating particles (WebGL)
│   │   ├── FloatingPolaroids# 3D drifting polaroid photos
│   │   └── ImageDistortion  # GLSL ripple distortion shader
│   ├── layout/
│   │   ├── Header           # Sticky nav + fullscreen mobile menu
│   │   └── Footer           # Links, marquee, social
│   ├── sections/
│   │   ├── HeroSection      # Full-screen hero, Ken Burns, split-text reveal
│   │   ├── CategoryGrid     # Asymmetric masonry with 3D tilt cards
│   │   ├── FeaturedWork     # Parallax horizontal rows + lightbox
│   │   ├── StatsSection     # Count-up animated numbers
│   │   ├── TestimonialsSection
│   │   ├── CTASection       # Parallax booking CTA
│   │   ├── CategoryHero     # Per-category parallax hero
│   │   └── PortfolioGallery # Masonry/Grid/Slider + lightbox + year filters
│   └── ui/
│       ├── CursorFollower   # Magnetic dot + spring-ring cursor
│       ├── LoadingScreen    # Counter 0→100% + curtain panel reveal
│       ├── PageTransition   # Overlay curtain on route change
│       ├── SmoothScroll     # Lenis wrapper
│       ├── ScrollProgress   # Gold thin top progress bar
│       ├── MagneticButton   # Magnetic pull hover effect
│       ├── RevealText       # Staggered word/char reveal (intersection)
│       ├── ImageLightbox    # Fullscreen lightbox with EXIF info panel
│       ├── Marquee          # Infinite scrolling text strip
│       └── CountUp          # Animated count-up on scroll-into-view
├── data/
│   └── portfolio.ts         # All content: images, categories, stats, nav
├── hooks/
│   ├── useMousePosition.ts
│   ├── useScrollProgress.ts
│   ├── useLenis.ts
│   ├── useReducedMotion.ts
│   └── useInView.ts
└── lib/
    └── utils.ts             # cn(), lerp(), clamp(), easing presets
```

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--ivory` | `#F5F1EA` | Primary background |
| `--cream` | `#EFE8DC` | Secondary background |
| `--champagne` | `#C9A961` | Gold accent, CTAs, borders |
| `--bronze` | `#8B6F47` | Secondary text |
| `--espresso` | `#1A1410` | Dark backgrounds, body text |
| `--rose` | `#D4A5A5` | Áo Dài accent color |

## Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

### One-click (recommended)

1. Push this repo to GitHub
2. Visit [vercel.com](https://vercel.com) → **Add New Project**
3. Import the repository — Vercel auto-detects Next.js
4. Click **Deploy**

### Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Environment Variables (optional)

```env
# .env.local
NEXT_PUBLIC_CONTACT_API_KEY=your_key   # for email service (Resend / EmailJS)
NEXT_PUBLIC_MAPBOX_TOKEN=your_token    # if adding Mapbox map
```

## Adding Real Photos

Replace Unsplash URLs in `data/portfolio.ts`:

```ts
{
  id: "ad-001",
  src: "/images/ao-dai/hoi-an-01.jpg",        // local /public/images/
  // or
  src: "https://cdn.yoursite.com/photo.avif", // CDN
  blurDataURL: "data:image/jpeg;base64,...",  // tiny blur placeholder
}
```

Generate blur placeholders:
```bash
npx plaiceholder-cli ./public/images/your-photo.jpg
```

## Customization Quick Reference

| What | Where |
|---|---|
| Photographer name | `data/portfolio.ts` + `app/layout.tsx` |
| Color palette | `tailwind.config.ts` + `app/globals.css` |
| Hero slides | `data/portfolio.ts → heroSlides` |
| Portfolio images | `data/portfolio.ts → *Images arrays` |
| Pricing | `app/contact/ContactPageClient.tsx` |
| Blog posts | `app/journal/page.tsx` |
| Stats (500+, 8 years…) | `data/portfolio.ts → stats` |
| Social links | `components/layout/Footer.tsx` |
| Meta / SEO | `app/layout.tsx → metadata` |

## Performance Notes

- Next.js `Image` with AVIF/WebP, responsive `sizes`, and blur placeholders
- Fonts preloaded with `font-display: swap`
- 3D components use `React.Suspense` fallbacks
- All animations respect `prefers-reduced-motion`
- Code-split per route automatically

## License

© 2024 Nguyệt Minh Photography. All rights reserved.
