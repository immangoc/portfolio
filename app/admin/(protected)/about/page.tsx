import { db } from "@/lib/db";
import { AboutClient } from "./AboutClient";

export default async function AdminAboutPage() {
  const [content, milestones] = await Promise.all([
    db.aboutContent.findUnique({ where: { id: "main" } }),
    db.milestone.findMany({ orderBy: { order: "asc" } }),
  ]);
  return <AboutClient initial={content ?? {}} initialMilestones={milestones} />;
}
