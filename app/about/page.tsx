import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AboutPageClient } from "./AboutPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Nguyệt Minh — Vietnamese fine-art photographer with 6+ years capturing souls in light.",
};

export default async function AboutPage() {
  const [content, milestones] = await Promise.all([
    db.aboutContent.findUnique({ where: { id: "main" } }),
    db.milestone.findMany({ orderBy: { order: "asc" } }),
  ]);
  return <AboutPageClient content={content ?? {}} milestones={milestones} />;
}
