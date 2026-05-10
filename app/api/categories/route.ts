import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const categories = await db.category.findMany({
    include: { photos: { orderBy: { order: "asc" } } },
  });
  return NextResponse.json(categories);
}
