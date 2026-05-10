import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  const photos = await db.photo.findMany({
    where: {
      ...(category ? { categorySlug: category } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    },
    orderBy: [{ categorySlug: "asc" }, { order: "asc" }],
  });

  return NextResponse.json(photos);
}
