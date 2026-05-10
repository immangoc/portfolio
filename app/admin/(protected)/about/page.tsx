import { db } from "@/lib/db";
import { AboutClient } from "./AboutClient";

export default async function AdminAboutPage() {
  const content = await db.aboutContent.findUnique({ where: { id: "main" } });
  return <AboutClient initial={content ?? {}} />;
}
