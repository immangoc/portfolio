import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Nguyệt Minh. Áo Dài, Wedding, Concept & Kỷ Yếu photography in Vietnam.",
};

export default function ContactPage() {
  return <ContactPageClient />;
}
