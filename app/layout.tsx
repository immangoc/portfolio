import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { PageTransition } from "@/components/ui/PageTransition";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://nguyetminh.com"),
  title: {
    default: "Nguyệt Minh — Fine Art Photography Vietnam",
    template: "%s | Nguyệt Minh Photography",
  },
  description:
    "Vietnamese fine-art photographer specializing in Áo Dài, Concept, Wedding & Kỷ Yếu photography. Luxury editorial portraits with a cinematic soul.",
  keywords: [
    "Vietnamese photographer",
    "fine art photography",
    "áo dài photography",
    "wedding photographer Vietnam",
    "kỷ yếu",
    "concept photography",
    "luxury portrait",
    "Ho Chi Minh City photographer",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: "en_US",
    siteName: "Nguyệt Minh Photography",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nguyệt Minh — Fine Art Photography Vietnam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await db.category.findMany({
    select: { slug: true, title: true, titleVi: true },
    orderBy: { slug: "asc" }
  });

  const navLinks = [
    { href: "/portfolio", label: "Portfolio", labelVi: "Bộ Sưu Tập" },
    ...categories.map(c => ({
      href: `/portfolio/${c.slug}`,
      label: c.title,
      labelVi: c.titleVi,
    })),
    { href: "/about", label: "About", labelVi: "Về Tôi" },
    { href: "/contact", label: "Contact", labelVi: "Liên Hệ" },
  ];

  return (
    <html
      lang="vi"
      className={`${cormorant.variable} ${inter.variable} ${beVietnam.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-ivory text-espresso antialiased overflow-x-hidden">
        <SmoothScroll>
          <ScrollProgress />
          <Header navLinks={navLinks} />
          <PageTransition>
            <main className="min-h-screen">{children}</main>
          </PageTransition>
          <Footer navLinks={navLinks} />
        </SmoothScroll>
      </body>
    </html>
  );
}
