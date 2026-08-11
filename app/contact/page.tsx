import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Nguyệt Minh. Áo Dài, Wedding, Concept & Kỷ Yếu photography in Vietnam.",
};

export default async function ContactPage() {
  const categories = await db.category.findMany({
    select: { titleVi: true },
    orderBy: { slug: "asc" }
  });

  const concepts = [...categories.map(c => c.titleVi), "Khác"];

  return <ContactPageClient concepts={concepts} />;
}
