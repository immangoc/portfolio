import type { Metadata } from "next";
import { AboutPageClient } from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Nguyệt Minh — Vietnamese fine-art photographer with 8+ years capturing souls in light.",
};

export default function AboutPage() {
  return <AboutPageClient />;
}
